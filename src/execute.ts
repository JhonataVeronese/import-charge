import fs from "fs";
import { prismaPlinFinancial } from "./infra/database/plin-financial/prisma";
import { prismaPlinCondominiums } from "./infra/database/plin-condominiums/prisma";
import {
  AccountPlinWebModel,
  ChargeModel,
  ChargeStatusEnum,
  ReceiveMethodEnum,
} from "./models/models";
import { randomUUID } from "crypto";
import { format } from "date-fns";

async function execute() {
  const prismaPlinApi = prismaPlinCondominiums();
  const prismaFinancial = prismaPlinFinancial();
  console.log("-------------------------------------------------------");
  console.log("------------ IMPORTADOR PLIN DE COBRANÇAS -------------");
  console.log("-------------------------------------------------------\n\n");

  console.log("Buscar dados da conta no plin web");

  // FAZER A CONSULTA NO FINANCIAL DAS CONTAS, PEGAR O UUID E FAZER A MESMA CONSULTA NO PLIN API USANDO O UUID DAS CONTAS COMO NOT IN E ADICIONAR O FILTRO POR CONTAS Q TEM COBRANÇAS
  const accountPlinAPI = await prismaPlinApi.bankaccount
    .findMany()
    .then((accounts) => {
      console.log(
        "Total de contas encontradas no plin web-> ",
        accounts.length
      );
      console.log("-------------------------------------------------------\n");

      return accounts.map((accountPlin) => {
        return {
          name: accountPlin.name?.substring(0, 80) ?? null,
          bankCode: accountPlin.bank ?? null,
          agency: accountPlin.agency ?? null,
          dgAgency: accountPlin.dg_agency ?? null,
          accountNumber: accountPlin.account ?? null,
          dgAccount: accountPlin.dg_account ?? null,
          bankAccountType: "CORRENTE",
          balanceInitial: accountPlin.opening_balance
            ? Number(accountPlin.opening_balance)
            : 0,
          balance: accountPlin.balance ? Number(accountPlin.balance) : 0,
          currency: "BRL",
          connectionUuid: null,
          ownerAccountId: undefined,
          createdAt: accountPlin.created_at
            ? format(accountPlin.created_at, "yyyy-MM-dd")
            : null,
          updatedAt: accountPlin.updated_at
            ? format(accountPlin.updated_at, "yyyy-MM-dd")
            : null,
          deletedAt: accountPlin.deleted_at
            ? format(accountPlin.deleted_at, "yyyy-MM-dd")
            : null,
          externalUuid: null,
          uuid: accountPlin.uuid,
          lastClosingDate: null,
        } as AccountPlinWebModel;
      });
    })
    .catch((error) => {
      console.error(error);
    });

  const accountFinancialAPI = await prismaFinancial.account
    .findMany({ where: { deletedAt: null } })
    .then((accounts) => {
      console.log("Total de contas no financial-api -> ", accounts.length);

      return accounts.map((accountFinancial) => {
        return accountFinancial.uuid;
      });
    })
    .catch((error) => {
      console.error(error);
    });

  if (accountPlinAPI) {
    const accountsToInsert = accountPlinAPI.filter(
      (account) => !accountFinancialAPI?.includes(account.uuid ?? "")
    );

    console.log("Contas para insert no financial-> ", accountsToInsert?.length);
    console.log("-------------------------------------------------------\n");

    console.log("Gerar script de inserção das novas contas");
    console.log("-------------------------------------------------------\n");
    const insertsAccounts: string[] = [];

    accountsToInsert?.forEach((account) => {
      const insert = `insert into public."Account"
      (id,"name","bankCode",agency,"dgAgency","accountNumber","dgAccount","bankAccountType","balanceInitial",balance,currency,
      "connectionUuid","ownerAccountId","createdAt","updatedAt","deletedAt","externalUuid","uuid","lastClosingDate") 
      select 
      ${`nextval('"Account_id_seq"'::regclass)`},
      '${account.name}',
      '${account.bankCode}',
      ${account.agency ? `'${account.agency}'` : null},
      ${account.dgAgency ? `'${account.dgAgency}'` : null},
      ${account.accountNumber ? `'${account.accountNumber}'` : null},
      ${account.dgAccount ? `'${account.dgAccount}'` : null},
      '${account.bankAccountType}',
      ${account.balanceInitial ?? null},
      ${account.balance ?? null},
      ${account.currency ? `'${account.currency}'` : `'BRL'`},
      ${account.connectionUuid ? `'${account.connectionUuid}'` : null},
      ${account.ownerAccountId ?? null},
      CURRENT_DATE, 
      CURRENT_DATE,
      null,
      null,
      '${account.uuid}',
      null
      where not exists (select 1 from public."Account" where uuid = '${
        account.uuid
      }');
      `;

      insertsAccounts.push(insert);
    });

    const sqlCommands = insertsAccounts.join("\n");

    fs.writeFile("1-contasBancarias.sql", sqlCommands, (err) => {
      if (err) throw err;
      // console.log('\n\nArquivo criado: "createAccountFinancialApi.sql".');
    });
  }

  console.log("-------------------------------------------------------\n");
  console.log("1 - Buscando dados de cobrança no plin web");

  const currentDate = new Date();
  const billsPlinAPI = await prismaPlinApi.bills
    .findMany({
      include: {
        bankaccount: { include: { monetary: true } },
        billings: {
          include: {
            billing_items: { include: { plan_account_categories: true } },
          },
        },
        companies: {
          include: {
            bankaccount_bankaccountTocompanies_bankaccount_default_id: true,
          },
        },
        condominiums: {
          include: {
            bankaccount_bankaccountTocondominiums_bankaccount_default_id: true,
          },
        },
        units: {
          select: {
            unit_owners: {
              where: { financial_responsible: true },
              select: {
                profiles: {
                  select: {
                    addresses: {
                      select: {
                        address: true,
                        cities: {
                          select: {
                            name: true,
                            states: { select: { initials: true } },
                          },
                        },
                        zipcode: true,
                        complement: true,
                      },
                      where: { deleted_at: null },
                      take: 1,
                      orderBy: { created_at: "desc" },
                    },
                    name: true,
                    cpf_cnpj: true,
                  },
                },
              },
            },
            blocks: { select: { name: true } },
            neighborhood: true,
            name: true,
            uuid: true,
          },
        },
      },
    })
    .then((bills) => {
      console.log("Cobranças encontradas-> ", bills.length);
      console.log("-------------------------------------------------------\n");

      const chargeList = bills.map((charge) => {
        return { ...charge, uuid: randomUUID() };
      });

      return chargeList.map((charge) => {
        let status: ChargeStatusEnum;

        if (charge.data_do_liquidacao) {
          status = ChargeStatusEnum.PAGO;
        } else {
          if (charge.data_vencimento < currentDate) {
            status = ChargeStatusEnum.VENCIDO;
          } else {
            status = ChargeStatusEnum.A_VENCER;
          }
        }

        let accountUuid: string | null = null;
        if (
          charge.condominiums
            ?.bankaccount_bankaccountTocondominiums_bankaccount_default_id
        ) {
          accountUuid =
            charge.condominiums
              ?.bankaccount_bankaccountTocondominiums_bankaccount_default_id
              .uuid;
        } else if (
          charge.companies
            ?.bankaccount_bankaccountTocompanies_bankaccount_default_id
        ) {
          accountUuid =
            charge.companies
              ?.bankaccount_bankaccountTocompanies_bankaccount_default_id.uuid;
        }

        const accountCharge = accountPlinAPI?.find(
          (account) => account.uuid === accountUuid
        );

        let unitPayerModel;
        if (charge.units) {
          const unit = charge.units;
          const address = unit?.unit_owners[0]?.profiles?.addresses[0];

          const documentPayer =
            unit?.unit_owners[0]?.profiles?.cpf_cnpj?.replace(/[^0-9]/g, "");

          unitPayerModel = {
            uuid: unit?.uuid,
            payerName: unit?.unit_owners[0]?.profiles?.name ?? "",
            document: documentPayer,
            documentType: documentPayer?.length === 11 ? "CPF" : "CNPJ",
            unitName: `${`${unit?.name} ${
              unit?.blocks ? ` - ${unit?.blocks?.name}` : ""
            }`}`,
            condominium: {
              uuid: charge.condominiums?.uuid ?? undefined,
              name: charge.condominiums?.name ?? undefined,
            },
          };
        }

        const documentBeneficiary = charge.condominiums?.cnpj
          ? charge.condominiums?.cnpj.replace(/[^0-9]/g, "")
          : "";

        let beneficiaryModel;
        if (charge.condominiums) {
          beneficiaryModel = {
            uuid: charge.condominiums?.uuid,
            document: documentBeneficiary,
            documentType: documentBeneficiary?.length === 11 ? "CPF" : "CNPJ",
            beneficiaryName: charge.condominiums?.name
              ? charge.condominiums?.name.substring(0, 80)
              : "",
          };
        }

        const chargeItems: any[] = [];
        if (charge.billings) {
          charge.billings.forEach((billing) => {
            billing.billing_items.forEach((item) => {
              chargeItems.push({
                amount: Number(item.amount),
                coastCenterUuid: null,
                complement: item.complement,
                categoryUuid: item.plan_account_categories?.uuid,
                chargeUuid: charge.uuid,
              });
            });
          });
        }

        charge.bankaccount?.monetary?.sort((a, b) => {
          if (a.created_at && b.created_at) {
            return a.created_at.getTime() - b.created_at.getTime();
          }
          return 0;
        });

        const configBankAccount = charge.bankaccount?.monetary[0]
          ?.days_for_inadiplency
          ? charge.bankaccount?.monetary[0]?.days_for_inadiplency
          : 0;

        return {
          uuid: charge.uuid,
          companyUuid: null,
          condominiumUuid: charge.condominiums?.uuid,
          plinBillsBucketId: charge.condominiums?.bills_bucket_id,

          accountCharge,
          unitPayerModel,
          beneficiaryModel,
          chargeItems,

          ChargeBillModel: {
            billUuid: charge.plin_boletos_id,
          },

          status,
          paymentMethodName: "Boleto",
          receiveMethod: ReceiveMethodEnum.BOLETO,

          dueDate: charge.data_vencimento
            ? format(charge.data_vencimento, "yyyy-MM-dd")
            : null,
          creditDate: charge.data_credito
            ? format(charge.data_credito, "yyyy-MM-dd")
            : "",
          liquidateDate: charge.data_do_liquidacao
            ? format(charge.data_do_liquidacao, "yyyy-MM-dd")
            : "",
          competenceDate: charge.data_competencia
            ? format(charge.data_competencia, "yyyy-MM-dd")
            : null,

          baseValue: charge.valor,
          finalValue: charge.valor_pago,
          amountPayable: charge.valor_pago,

          defaultInterestValue: charge.juros,
          discountValue: charge.juros,
          fineValue: charge.multa,

          pdfUrl: charge.url,
          ourNumber: charge.nosso_numero,
          pixCopyAndPaste: charge.pix_copy_and_paste,

          daysAfterDelinquencyToCancel: configBankAccount ?? 0,
          daysAfterDueDateToDelinquency: configBankAccount ?? 0,

          createdAt: charge.created_at
            ? format(charge.created_at, "yyyy-MM-dd")
            : null,
          updatedAt: charge.updated_at
            ? format(charge.updated_at, "yyyy-MM-dd")
            : null,
          deletedAt: charge.deleted_at
            ? format(charge.deleted_at, "yyyy-MM-dd")
            : null,
        };
      });
    })
    .catch((error) => {
      console.error(error);
    });

  console.log("Gerar script de inserção de cobranças");
  console.log("-------------------------------------------------------\n");
  const insertsCharges: string[] = [];

  billsPlinAPI?.forEach((chargeInsert) => {
    const insertCharge = `    
    -------------------------------------------- Início da transação
    Rollback;
    BEGIN TRANSACTION;

    insert into public."Payer"
  (id,
    "condominiumUuid",
    "unitUuid",
    "name",
    "documentType",
    "document",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "unitName")
  values(
    ${`nextval('"Payer_id_seq"'::regclass)`},
    '${chargeInsert.unitPayerModel?.condominium.uuid ?? null}',
    '${chargeInsert.unitPayerModel?.uuid ?? null}',
    '${chargeInsert.unitPayerModel?.payerName ?? null}',
    ${
      chargeInsert.unitPayerModel?.documentType
        ? `'${chargeInsert.unitPayerModel?.documentType}'`
        : `'CPF'`
    },
    ${
      chargeInsert.unitPayerModel?.document
        ? `'${chargeInsert.unitPayerModel?.document}'`
        : null
    },
    CURRENT_DATE,
    CURRENT_DATE,
    null,
    '${chargeInsert.unitPayerModel?.unitName ?? null}'
  );
  

  insert into public."Beneficiary"
  (id,
    "name",
    "document",
    "documentType",
    "accountId",
    "companyUuid",
    "condominiumUuid",
    created_at,
    updated_at,
    deleted_at)
  values(
    ${`nextval('"Beneficiary_id_seq"'::regclass)`},
    '${chargeInsert.beneficiaryModel?.beneficiaryName}',
    ${
      chargeInsert.beneficiaryModel?.document
        ? `'${chargeInsert.beneficiaryModel?.document}'`
        : null
    },
    ${
      chargeInsert.beneficiaryModel?.documentType
        ? `'${chargeInsert.beneficiaryModel?.documentType}'`
        : `'CPF'`
    },
    (select id from public."Account" where uuid = '${
      chargeInsert.accountCharge?.uuid
    }'),
    ${chargeInsert.companyUuid ? `'${chargeInsert.companyUuid}'` : `''`},
    ${
      chargeInsert.beneficiaryModel?.uuid
        ? `'${chargeInsert.beneficiaryModel?.uuid}'`
        : null
    },
    CURRENT_DATE,
    CURRENT_DATE,
    null
  );


  insert into public."Charge"  
    (id,
    "uuid",
    "accountId",
    "paymentMethodId",
    "payerId",
    "beneficiaryId",
    --"chargeIdOriginal",
    status,
    "baseValue",
    "finalValue",
    "dueDate",
    "liquidateDate",
    "creditDate",
    "competenceDate",
    "extraordinary",
    "visualized",
    "createdAt",
    "updatedAt",
    "deletedAt",
    --"internalId",
    "companyUuid",
    "condominiumUuid",
    "receiveMethod",
    "applyDiscount",
    "defaultInterestValue",
    "discountValue",
    "fineValue",
    "sendReceiptOnLiquidation",
    "amountPayable",
    "plinBillsBucketId",
    "daysAfterDelinquencyToCancel",
    "daysAfterDueDateToDelinquency",
    "finePercentage",
    "interestPercentage",
    "duplicateFee",
    "chargeReIssue",
    "pdfUrl",
    "cancellationDate",
    "delinquencyDate",
    "ourNumber",
    "barCode",
    "pixCopyAndPaste")
  values(
    ${`nextval('"Charge_id_seq"'::regclass)`},
    '${chargeInsert.uuid}',
    (select id from public."Account" where uuid = '${
      chargeInsert.accountCharge?.uuid
    }'),
    (select id from public."PaymentMethod" where name = '${
      chargeInsert.paymentMethodName
    }'),
    (currval(('"Payer_id_seq"'))),
   	(currval(('"Beneficiary_id_seq"'))),
    --null,
    '${chargeInsert.status}',
    ${chargeInsert.baseValue},
    ${chargeInsert.finalValue},
    '${chargeInsert.dueDate}',
    ${chargeInsert.liquidateDate ? `'${chargeInsert.liquidateDate}'` : null},
    ${chargeInsert.creditDate ? `'${chargeInsert.creditDate}'` : null},
    ${chargeInsert.competenceDate ? `'${chargeInsert.competenceDate}'` : null},
    false,
    false,
    '${chargeInsert.createdAt}',
    '${chargeInsert.updatedAt}',
    null,
    --null,
    ${chargeInsert.companyUuid ? `'${chargeInsert.companyUuid}'` : null},
    ${
      chargeInsert.condominiumUuid ? `'${chargeInsert.condominiumUuid}'` : null
    },
    '${chargeInsert.receiveMethod}',
    null,
    ${chargeInsert.defaultInterestValue},
    ${chargeInsert.discountValue},
    ${chargeInsert.fineValue},
    null,
    ${chargeInsert.amountPayable},
    null,
    null,
    null,
    null,
    null,
    null,
    false,
    null,
    null,
    null,
    '${chargeInsert.ourNumber}',
    null,
    ${chargeInsert.pdfUrl ? `'${chargeInsert.pdfUrl}'` : null}
  );


  insert into public."ChargeBill"
    (id, "billUuid", "chargeId")
  values(
    ${`nextval('"ChargeBill_id_seq"'::regclass)`},
    ${
      chargeInsert.ChargeBillModel.billUuid
        ? `'${chargeInsert.ChargeBillModel.billUuid}'`
        : null
    },
    (select id from public."Charge" where uuid = '${chargeInsert.uuid}')
  );

  COMMIT;
  -------------------------------------------- Fim da transação
  `;

    insertsCharges.push(insertCharge);
  });

  const sqlCommands = insertsCharges.join("\n");

  fs.writeFile("2-PayerBeneficiaryCharge.sql", sqlCommands, (err) => {
    if (err) throw err;
    // console.log('\n\nArquivo criado: "createAccountFinancialApi.sql".');
  });

  const insertsChargesItems: string[] = [];

  console.log("Gerar script de inserção de itens das cobranças");
  console.log("-------------------------------------------------------\n");
  billsPlinAPI?.forEach((chargeInsert) => {
    const insertChargeItems = chargeInsert.chargeItems
      .map((item) => {
        return `      
          insert into public."ChargeItem"
            (id,
              "chargeId",
              complement,
              "categoryUuid",
              amount,              
              "coastCenterUuid")
            values(
              ${`nextval('"ChargeItem_id_seq"'::regclass)`},
              (select id from public."Charge" where uuid = '${
                item.chargeUuid
              }'),
              ${item.complement ? `'${item.complement}'` : null},
              ${item.categoryUuid ? `'${item.categoryUuid}'` : null},
              ${item.amount ? `'${item.amount}'` : 0},
            null);
        `;
      })
      .join("");

    insertsChargesItems.push(insertChargeItems);
  });

  const sqlChargeItensCommands = insertsChargesItems.join("\n");

  fs.writeFile("3-ChargesItem.sql", sqlChargeItensCommands, (err) => {
    if (err) throw err;
    // console.log('\n\nArquivo criado: "createAccountFinancialApi.sql".');
  });

  console.log("-------------------------------------------------------\n");

  console.log("-------------------------------------------------------\n");
  console.log("IMPORTADOR PLIN FIM");
  console.log(
    "Executar os scripts gerados no banco de dados em ordem - conta -> cobrança -> itens de cobrança"
  );
  console.log("-------------------------------------------------------\n");
}

// Para executar o script -> npx ts-node .\src\execute.ts
execute();
