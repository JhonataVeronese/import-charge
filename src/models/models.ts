export type AccountPlinWebModel = {
  id?: number | bigint;
  uuid?: string;
  externalUuid?: string | null;
  connectionUuid?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  lastClosingDate?: Date | null;
  balance?: number | null;
  balanceInitial?: number | null;
  bankAccountType?: string | null;
  currency?: string | null;
  dgAccount?: string | null;
  dgAgency?: string | null;
  bankCode?: string | null;
  agency?: string | null;
  accountNumber?: string | null;
  name?: string | null;
  ownerAccountId?: number;
};

export type ChargeModel = {
  id?: number;
  uuid: string;
  accountId: number;
  paymentMethodId?: number;
  paymentMethodName?: string;
  payerId?: number;
  beneficiaryId?: number;
  chargeIdOriginal?: number;
  status: ChargeStatusEnum;
  baseValue: number;
  finalValue?: number;
  dueDate: Date;
  liquidateDate?: Date;
  creditDate?: Date;
  competenceDate: Date;
  extraordinary: boolean;
  visualized: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  internalId?: number;
  condominiumUuid?: string;
  companyUuid?: string;
  chargeItems: ChargeItemModel[];
  chargeBills: ChargeBillModel[];
  chargeOriginalList: ChargeModel[];
  payer?: PayerModel;
  beneficiary?: BeneficiaryModel;
  receiveMethod?: ReceiveMethodEnum;
  sendReceiptOnLiquidation?: boolean;
  defaultInterestValue?: number;
  fineValue?: number;
  applyDiscount?: boolean;
  discountValue?: number;
  amountPayable?: number;
  plinBillsBucketId?: string;
  finePercentage?: number;
  interestPercentage?: number;
  daysAfterDueDateToDelinquency?: number;
  daysAfterDelinquencyToCancel?: number;
  duplicateFee?: number;
  chargeReIssue?: boolean;
  pdfUrl?: string;
  delinquencyDate?: Date;
  cancellationDate?: Date;
  ourNumber?: string;
  pixCopyAndPaste?: string;
  barCode?: string;
};

export enum ChargeStatusEnum {
  PROCESSANDO = "PROCESSANDO",
  A_VENCER = "A_VENCER",
  VENCIDO = "VENCIDO",
  PAGO = "PAGO",
  INDISPONIVEL = "INDISPONIVEL",
  ERRO = "ERRO",
  INVALIDO = "INVALIDO",
  INADIMPLENTE = "INADIMPLENTE",
  INADIMPLENTE_INDISPONIVEL = "INADIMPLENTE_INDISPONIVEL",
}
export enum ChargeStatusOverdueEnum {
  INADIMPLENTE = ChargeStatusEnum.INADIMPLENTE,
  INADIMPLENTE_INDISPONIVEL = ChargeStatusEnum.INADIMPLENTE_INDISPONIVEL,
}

export enum ReceiveMethodEnum {
  CHEQUE = "CHEQUE",
  PIX = "PIX",
  TRANSFERENCIA = "TRANSFERENCIA",
  DINHEIRO = "DINHEIRO",
  BOLETO = "BOLETO",
}

export enum ChargeSituationWebhookEnum {
  ACTIVE = "ACTIVE",
  OVERDUE = "OVERDUE",
  EXPIRED = "EXPIRED",
}

export type PayerModel = {
  id?: number;
  name: string;
  document?: string;
  documentType?: DocumentType;
  unitUuid?: string;
  unitName?: string;
  condominiumUuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  address: AddressModel[];
  charge?: ChargeModel[];
};

export enum DocumentType {
  CPF = "CPF",
  CNPJ = "CNPJ",
}

export type BeneficiaryModel = {
  id?: number;
  name: string;
  accountId: number;
  documentType?: DocumentType;
  companyUuid: string;
  condominiumUuid?: string;
  document?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  address: AddressModel[];
  charge?: ChargeModel[];
};

export type AddressModel = {
  id?: number;
  payerId?: number;
  beneficiaryId?: number;
  address: string;
  city?: string;
  federativeUnit?: string;
  zipCode: string;
  complement?: string;
  neighborhood?: string;
  areaCode?: string;
  cellphone?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type ChargeItemModel = {
  id?: number;
  chargeId?: number;
  complement?: string;
  categoryUuid?: string;
  coastCenterUuid?: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type ChargeBillModel = {
  id?: number;
  chargeId?: number;
  billUuid?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};
