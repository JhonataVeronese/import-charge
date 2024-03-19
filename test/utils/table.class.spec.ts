import { describe, test, expect, vi, beforeAll, it } from 'vitest'
import { Table } from '../../src/utils/table.class'

describe('table class', () => {
  test('should be able to create a table', () => {
    const table = Table.create()
    table
      .addColumn({
        value: 'ID',
        customClass: ['width-small'],
        type: 'number'
      })
      .addColumn({
        value: 'Nosso Numero',
        customClass: ['width-medium'],
        type: 'number',
      })
      .addColumn({
        value: 'Valor',
        customClass: ['width-medium'],
        type: 'number',
      })
      .addLine([
        {
          value: '1',
        },
        {
          value: '124432'
        },
        {
          value: '20392019320',
        }
      ])
      .addLine([
        {
          value: '2',
        },
        {
          value: '124432'
        },
        {
          value: '203932429320',
        }
      ])
      .addFooter([
        {
          value: 'Total',
          customClass: ['text-left'],
          colspan: 2,
        },
        {
          value: '22313',
          customClass: ['text-right']
        }
      ])

    console.dir(table.headerToPrint())
    console.dir(table.linesToPrint())
    console.dir(table.footerToPrint())
  })

  it('should add a column', () => {
    const table = Table.create();
    table.addColumn({ value: "Nome", customClass: [""] });
    const header = table.headerToPrint();
    expect(header.length).to.equal(1);
    expect(header[0].value).to.equal("Nome");
  });

  it('should add a column after a specific column', () => {
    const table = Table.create();
    table.addColumn({ value: "Nome", customClass: [""] });
    table.addColumn({ value: "Idade", customClass: [""] });
    table.addColumnsAfter({ value: "Taxa", customClass: [""] }, "Nome");
    const header = table.headerToPrint();
    expect(header.length).to.equal(3);
    expect(header[1].value).to.equal("Taxa");
  });

  it('should add a column before a specific column', () => {
    const table = Table.create();
    table.addColumn({ value: "Nome", customClass: [""] });
    table.addColumn({ value: "Idade", customClass: [""] });
    table.addColumnsBefore({ value: "Extra", customClass: [""] }, "Idade");
    const header = table.headerToPrint();
    expect(header.length).to.equal(3);
    expect(header[1].value).to.equal("Extra");
  });

  it('should add a line', () => {
    const table = Table.create();
    table.addLine([{ value: "João", customClass: [""] }]);
    const lines = table.linesToPrint();
    expect(lines.length).to.equal(1);
    expect(lines[0][0].value).to.equal("João");
  });

  it('should add a footer', () => {
    const table = Table.create();
    table.addFooter([{ value: "Total", customClass: [""] }]);
    const footer = table.footerToPrint();
    expect(footer.length).to.equal(1);
    expect(footer[0].value).to.equal("Total");
  });

  it('should add multiple columns after a specific column', () => {
    const table = Table.create();
    table.addColumn({ value: "Nome", customClass: [""] });
    table.addColumn({ value: "Idade", customClass: [""] });
    table.addColumnsAfter([{ value: "Taxa1", customClass: [""] }, { value: "Taxa2", customClass: [""] }], "Nome");
    const header = table.headerToPrint();
    expect(header.length).to.equal(4);
    expect(header[1].value).to.equal("Taxa1");
    expect(header[2].value).to.equal("Taxa2");
  });

  it('should add multiple columns before a specific column', () => {
    const table = Table.create();
    table.addColumn({ value: "Nome", customClass: [""] });
    table.addColumn({ value: "Idade", customClass: [""] });
    table.addColumnsBefore([{ value: "Extra1", customClass: [""] }, { value: "Extra2", customClass: [""] }], "Idade");
    const header = table.headerToPrint();
    expect(header.length).to.equal(4);
    expect(header[1].value).to.equal("Extra1");
    expect(header[2].value).to.equal("Extra2");
  });
})