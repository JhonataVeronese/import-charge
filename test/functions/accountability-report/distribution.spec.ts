import { describe, test, expect, vi, beforeAll } from 'vitest'

import {
  generateDistribution
} from '../../../src/functions/accountability-report-generate/generate-data-item/distribution'

describe('', () => {
  const input = {
    type: 'credit',
    report: {
      id: 42,
      name: 'Test Mapper',
      type: 'accountability',
      hasField: null,
      dateOfCompetence: new Date( 2023, 2, 19, 12),
      lastGeneratedAt: null,
      deletedAt: null,
      reportItems: [
        {
          id: 178,
          title: 'Capa',
          position: 1,
          periodNumberOfMonths: 1,
          periodType: 'after',
          reportId: 42,
          deletedAt: null,
          dataReportItems: [
            {
              id: 177,
              type: 'attachment',
              queryRef: null,
              querySelections: [],
              attachmentFileId: 1,
              attachmentUrl: 'https://static.vecteezy.com/system/resources/thumbnails/007/752/415/small/abstract-geometric-logo-icon-design-free-vector.jpg',
              description: null,
              signatureNumber: null,
              deletedAt: null,
              reportItemId: 178
            }
          ]
        },
        {
          id: 176,
          title: 'Introdução',
          position: 2,
          periodNumberOfMonths: 1,
          periodType: 'before',
          reportId: 42,
          deletedAt: null,
          dataReportItems: [
            {
              id: 175,
              type: 'description',
              queryRef: null,
              querySelections: [],
              attachmentFileId: null,
              attachmentUrl: null,
              description: 'Test',
              signatureNumber: null,
              deletedAt: null,
              reportItemId: 176
            }
          ]
        },
        {
          id: 177,
          title: 'Parecer do conselho',
          position: 3,
          periodNumberOfMonths: 0,
          periodType: 'current',
          reportId: 42,
          deletedAt: null,
          dataReportItems: [
            {
              id: 176,
              type: 'signature',
              queryRef: null,
              querySelections: [],
              attachmentFileId: null,
              attachmentUrl: null,
              description: 'Assinatura',
              signatureNumber: 3,
              deletedAt: null,
              reportItemId: 177
            }
          ]
        },
        {
          id: 179,
          title: 'Resumo Financeiro',
          position: 4,
          periodNumberOfMonths: 0,
          periodType: 'current',
          reportId: 42,
          deletedAt: null,
          dataReportItems: [
            {
              id: 178,
              type: 'query',
              queryRef: null,
              querySelections: [],
              attachmentFileId: null,
              attachmentUrl: null,
              description: null,
              signatureNumber: null,
              deletedAt: null,
              reportItemId: 179
            }
          ]
        },
        {
          id: 180,
          title: 'Relatório de Distribuição de Receitas',
          position: 5,
          periodNumberOfMonths: 0,
          periodType: 'current',
          reportId: 42,
          deletedAt: null,
          dataReportItems: [
            {
              id: 179,
              type: 'query',
              queryRef: null,
              querySelections: [],
              attachmentFileId: null,
              attachmentUrl: null,
              description: null,
              signatureNumber: null,
              deletedAt: null,
              reportItemId: 180
            }
          ]
        },
        {
          id: 181,
          title: 'Relatório de Distribuição de Despesas',
          position: 6,
          periodNumberOfMonths: 0,
          periodType: 'current',
          reportId: 42,
          deletedAt: null,
          dataReportItems: [
            {
              id: 180,
              type: 'query',
              queryRef: null,
              querySelections: [],
              attachmentFileId: null,
              attachmentUrl: null,
              description: null,
              signatureNumber: null,
              deletedAt: null,
              reportItemId: 181
            }
          ]
        },
        {
          id: 182,
          title: 'Receitas Liquidadas',
          position: 7,
          periodNumberOfMonths: 0,
          periodType: 'current',
          reportId: 42,
          deletedAt: null,
          dataReportItems: [
            {
              id: 181,
              type: 'query',
              queryRef: null,
              querySelections: [],
              attachmentFileId: null,
              attachmentUrl: null,
              description: null,
              signatureNumber: null,
              deletedAt: null,
              reportItemId: 182
            }
          ]
        },
        {
          id: 183,
          title: 'Fluxo de Caixa',
          position: 8,
          periodNumberOfMonths: 0,
          periodType: 'current',
          reportId: 42,
          deletedAt: null,
          dataReportItems: [
            {
              id: 182,
              type: 'query',
              queryRef: null,
              querySelections: [],
              attachmentFileId: null,
              attachmentUrl: null,
              description: null,
              signatureNumber: null,
              deletedAt: null,
              reportItemId: 183
            }
          ]
        },
        {
          id: 184,
          title: 'Constituição Americana',
          position: 9,
          periodNumberOfMonths: 1,
          periodType: 'after',
          reportId: 42,
          deletedAt: null,
          dataReportItems: [
            {
              id: 183,
              type: 'attachment',
              queryRef: null,
              querySelections: [],
              attachmentFileId: 1,
              attachmentUrl: 'https://test-plin-condominiums-bucket.s3.sa-east-1.amazonaws.com/88f9d1aee4f25e8029febde1bc9949de-resumo-financeiro.pdf',
              description: null,
              signatureNumber: null,
              deletedAt: null,
              reportItemId: 184
            }
          ]
        }
      ],
      reportAssociation: [
        {
          id: 7,
          companyId: null,
          condominiumId: 5,
          reportId: 42,
          deletedAt: null,
          company: null,
          condominium: {
            id: 5,
            name: 'TRY CODES SOLUCOES E CONSULTORIA LTDA',
            companyId: 16,
            deletedAt: null,
            cnpj: '45.198.671/0001-47',
            city: 'Curitiba',
            company: {
              id: 16,
              name: 'PLIN SOLUCOES LTDA',
              cnpj: '38203385000167',
              deletedAt: null,
              documentCompany: [
                {
                  files: {
                    url_file: 'https://test-plin-condominiums-bucket.s3.sa-east-1.amazonaws.com/98211a7ad207c12ff062cf311de1c8af-randonlogo_362323%20%284%29.png'
                  }
                }
              ]
            },
            employee: [
              {
                id: 131,
                name: 'Jorge',
                condominiumId: 5,
                employeePositionId: 6,
                deletedAt: null
              }
            ],
            bankAccounts: [
              {
                id: 167,
                uuid: '5e72066a-d45c-4d91-8ca4-f120abe23dfb',
                name: 'Minha continha ABC',
                agencyNumber: '1234',
                agencyDigit: null,
                accountNumber: '12345',
                accountDigit: '6',
                condominiumId: 5,
                companyId: null,
                deletedAt: null
              },
              {
                id: 34,
                uuid: '128c2bc8-d2e5-43ce-bdfd-00ade0c037c2',
                name: 'Nu Conta teste alterada 2',
                agencyNumber: '0001',
                agencyDigit: null,
                accountNumber: '6201414',
                accountDigit: '7',
                condominiumId: 5,
                companyId: null,
                deletedAt: null
              }
            ]
          }
        }
      ]
    },
    reportItem: {
      id: 180,
      title: 'Relatório de Distribuição de Receitas',
      position: 5,
      periodNumberOfMonths: 0,
      periodType: 'current',
      reportId: 42,
      deletedAt: null,
      dataReportItems: [
        {
          id: 179,
          type: 'query',
          queryRef: null,
          querySelections: [],
          attachmentFileId: null,
          attachmentUrl: null,
          description: null,
          signatureNumber: null,
          deletedAt: null,
          reportItemId: 180
        }
      ]
    },
    categories: [
      {
        id: 557,
        name: 'Juros',
        uuid: '0c67a0d8-bcd2-420c-8b41-44d33f98d8e9',
        deletedAt: null
      },
      {
        id: 559,
        name: 'Tarifa Bancária',
        uuid: 'cb80526f-1f29-4856-a4c5-f1ef72d7739c',
        deletedAt: null
      },
      {
        id: 561,
        name: 'Rendimento Investimento',
        uuid: 'a65d94e9-5721-4fab-bdc8-e5582134c20e',
        deletedAt: null
      }
    ],
    bankAccountsFinancial: [
      {
        id: 3,
        uuid: '128c2bc8-d2e5-43ce-bdfd-00ade0c037c2',
        name: null,
        bankCode: null,
        agency: null,
        dgAgency: null,
        accountNumber: null,
        dgAccount: null,
        balanceInitial: 16788,
        balance: 12235,
        releases: [
          {
            type: 'RECEITA',
            value: 90.99,
            origin: 'MANUAL',
            categoryUuid: '0c67a0d8-bcd2-420c-8b41-44d33f98d8e9',
            competenceDate: null,
            paymentDate: new Date('2023-03-02T00:00:00.000Z')
          },
          {
            type: 'RECEITA',
            value: 3456.66,
            origin: 'MANUAL',
            categoryUuid: 'cb80526f-1f29-4856-a4c5-f1ef72d7739c',
            competenceDate: new Date('2023-03-02T00:00:00.000Z'),
            paymentDate: new Date('2023-03-16T00:00:00.000Z')
          },
          {
            type: 'RECEITA',
            value: 234.66,
            origin: 'MANUAL',
            categoryUuid: 'a65d94e9-5721-4fab-bdc8-e5582134c20e',
            competenceDate: new Date('2023-03-02T00:00:00.000Z'),
            paymentDate: new Date('2023-03-25T00:00:00.000Z')
          },
          {
            type: 'RECEITA',
            value: 2303,
            origin: 'TRANSFERENCIA',
            categoryUuid: null,
            competenceDate: new Date('2023-03-02T00:00:00.000Z'),
            paymentDate: new Date('2023-03-10T00:00:00.000Z')
          },
          {
            type: 'RECEITA',
            value: 345,
            origin: 'TRANSFERENCIA',
            categoryUuid: null,
            competenceDate: new Date('2023-03-02T00:00:00.000Z'),
            paymentDate: new Date('2023-03-10T00:00:00.000Z')
          },
          {
            type: 'RECEITA',
            value: 458,
            origin: 'TRANSFERENCIA',
            categoryUuid: null,
            competenceDate: new Date('2023-03-02T00:00:00.000Z'),
            paymentDate: new Date('2023-03-10T00:00:00.000Z')
          },
          {
            type: 'RECEITA',
            value: 233,
            origin: 'TRANSFERENCIA',
            categoryUuid: null,
            competenceDate: new Date('2023-03-02T00:00:00.000Z'),
            paymentDate: new Date('2023-03-11T00:00:00.000Z')
          },
          {
            type: 'RECEITA',
            value: 345,
            origin: 'TRANSFERENCIA',
            categoryUuid: null,
            competenceDate: new Date('2023-03-02T00:00:00.000Z'),
            paymentDate: new Date('2023-03-12T00:00:00.000Z')
          },
          {
            type: 'RECEITA',
            value: 799,
            origin: 'TRANSFERENCIA',
            categoryUuid: null,
            competenceDate: new Date('2023-03-02T00:00:00.000Z'),
            paymentDate: new Date('2023-03-12T00:00:00.000Z')
          }
        ]
      },
      {
        id: 199,
        uuid: '5e72066a-d45c-4d91-8ca4-f120abe23dfb',
        name: null,
        bankCode: null,
        agency: null,
        dgAgency: null,
        accountNumber: null,
        dgAccount: null,
        balanceInitial: 23521,
        balance: 224656,
        releases: []
      }
    ]
  }
  test('', () => {
    //@ts-ignore
    const data = generateDistribution(input)
    expect(data).toEqual([
      {
        templateId: '6428501313d7b8d5fed590f7',
        backgroundLogo: 'https://cdn.greatsoftwares.com.br/arquivos/paginas/12586-49eb246efabe65b8eb22a0e32d951ca0.png',
        header: {
          orgLogo: 'https://test-plin-condominiums-bucket.s3.sa-east-1.amazonaws.com/98211a7ad207c12ff062cf311de1c8af-randonlogo_362323%20%284%29.png',
          report: {
            code: 'RDR 00042',
            dateOfCompetence: 'Março de 2023',
            subtitle: 'TRY CODES SOLUCOES E CONSULTORIA LTDA',
            title: 'Relatório de Distribuição de Receitas'
          },
          dateOfIssue: { date: '09 de Maio de 2023', text: 'Emissão em:' },
          qrcodeUrl: 'https://app.plincondominios.com.br',
          total: { text: 'Total', value: 8265.31 }
        },
        content: {
          options: [
            { percentage: 1.1, quantity: 90.99, value: 'Juros' },
            {
              percentage: 41.82,
              quantity: 3456.66,
              value: 'Tarifa Bancária'
            },
            {
              percentage: 2.84,
              quantity: 234.66,
              value: 'Rendimento Investimento'
            },
            { percentage: 54.24, quantity: 4483, value: 'Outros' }
          ],
          total: 8265.31
        }
      },
      {
        templateId: '6428501313d7b8d5fed590f6',
        backgroundLogo: 'https://cdn.greatsoftwares.com.br/arquivos/paginas/12586-49eb246efabe65b8eb22a0e32d951ca0.png',
        lines: [
          [
            {
              type: '',
              value: 'Outros (54.24%)',
              colspan: 4,
              customClass: 'colspan-header'
            }
          ],
          [
            { type: '', value: '3 cobranças' },
            { type: '', value: '09/03' },
            { type: 'percentage', value: '69.28%' },
            { type: 'currency', value: 3106 }
          ],
          [
            { type: '', value: '1 cobrança' },
            { type: '', value: '10/03' },
            { type: 'percentage', value: '5.2%' },
            { type: 'currency', value: 233 }
          ],
          [
            { type: '', value: '2 cobranças' },
            { type: '', value: '11/03' },
            { type: 'percentage', value: '25.52%' },
            { type: 'currency', value: 1144 }
          ],
          [
            {
              type: '',
              value: 'Tarifa Bancária (41.82%)',
              colspan: 4,
              customClass: 'colspan-header'
            }
          ],
          [
            { type: '', value: '1 cobrança' },
            { type: '', value: '15/03' },
            { type: 'percentage', value: '100%' },
            { type: 'currency', value: 3456.66 }
          ],
          [
            {
              type: '',
              value: 'Rendimento Investimento (2.84%)',
              colspan: 4,
              customClass: 'colspan-header'
            }
          ],
          [
            { type: '', value: '1 cobrança' },
            { type: '', value: '24/03' },
            { type: 'percentage', value: '100%' },
            { type: 'currency', value: 234.66 }
          ],
          [
            {
              type: '',
              value: 'Juros (1.1%)',
              colspan: 4,
              customClass: 'colspan-header'
            }
          ],
          [
            { type: '', value: '1 cobrança' },
            { type: '', value: '01/03' },
            { type: 'percentage', value: '100%' },
            { type: 'currency', value: 90.99 }
          ]
        ],
        tableFooter: [
          { type: '', value: 'itens listados', colspan: 3 },
          { type: 'currency', value: '8265.31' }
        ],
        tableHead: [ 'Receitas', 'Liquidação', '', 'Valor' ],
        totalSome: 8265.31,
        header: {
          orgLogo: 'https://test-plin-condominiums-bucket.s3.sa-east-1.amazonaws.com/98211a7ad207c12ff062cf311de1c8af-randonlogo_362323%20%284%29.png',
          report: {
            code: 'RDR 00042',
            dateOfCompetence: 'Março de 2023',
            subtitle: 'TRY CODES SOLUCOES E CONSULTORIA LTDA',
            title: 'Relatório de Distribuição de Receitas'
          },
          dateOfIssue: { date: '09 de Maio de 2023', text: 'Emissão em:' },
          qrcodeUrl: 'https://app.plincondominios.com.br',
          total: { text: 'Saldo Total', value: 8265.31 }
        }
      }
    ])
  })

  beforeAll(() => {
    const date = new Date(2023, 4, 9, 13)
    vi.setSystemTime(date)
  })

})
