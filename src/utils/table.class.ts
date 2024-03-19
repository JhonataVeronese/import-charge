class Table {
  private _header: TableHeader = [];
  private _lines: TableLine[][] = [];
  private _footer: TableFooter = [];

  static create(): Table {
    return new Table();
  }

  addColumn(column: TableColumn){
    this._header.push(column);
    return this;
  }

  addColumnsAfter(columns: TableColumn | TableColumn[], existingColumnValue: string) {
      let existingColumnIndex = this._header.findIndex(col => col.value === existingColumnValue);
      if (existingColumnIndex !== -1) {
          if (Array.isArray(columns)) {
              this._header.splice(existingColumnIndex + 1, 0, ...columns);
          } else {
              this._header.splice(existingColumnIndex + 1, 0, columns);
          }
      }
      return this;
  }

  addColumnsBefore(columns: TableColumn | TableColumn[], existingColumnValue: string) {
      let existingColumnIndex = this._header.findIndex(col => col.value === existingColumnValue);
      if (existingColumnIndex !== -1) {
          if (Array.isArray(columns)) {
              this._header.splice(existingColumnIndex, 0, ...columns);
          } else {
              this._header.splice(existingColumnIndex, 0, columns);
          }
      }
      return this;
  }

  addLine(line: TableLine[]){
    this._lines.push(line);
    return this;
  }

  addFooter(footer: TableFooterColumn[]){
    this._footer.push(...footer);
    return this;
  }

  headerToPrint() {
    return this._header.map(column => {
      return {
        value: column.value,
        customClass: column.customClass.join(' '),
        type: column.type || '',
        colspan: column.colspan || 1,
      }
    });
  }

  linesToPrint() {
    const lines = this._lines?.map(line => line?.map( (value, index) => {
      const column = this._header[index];

      return {
        value: value.value,
        type: column?.type || '',
        colspan: value.colspan || 1,
        customClass:column?.customClass 
          ? [...column?.customClass, ...value.customClass || []].join(' ') 
          :'',
      }
    }))

    return lines.length ? lines : [[{
      value: 'Não há dados para exibir',
      type: '',
      customClass: 'align-center',
      colspan: this._header.length,
    }]];;
  }

  footerToPrint() {
    return this._footer.map(column => {
      return {
        value: column.value,
        type: column.type || '',
        customClass:column.customClass ? column.customClass.join(' ') : '',
        colspan: column.colspan || 1,
      }
    });
  }

  countColumns() {
    return this._header.length;
  }
}

type TableLine = {
  value: string;
  colspan?: number;
  customClass?: string[];
};

type TableColumn = {
  value: string;
  customClass: string[];
  colspan?: number;
  type?: string;
}

type TableFooterColumn = TableColumn
type TableHeader = TableColumn[];
type TableFooter = TableFooterColumn[];

export { Table, TableHeader, TableLine, TableColumn };
