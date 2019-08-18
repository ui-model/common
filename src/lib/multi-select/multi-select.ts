import { BaseModel, objectByField, objectById, Transformer } from '@ui-model/core';

export class MultiSelect<T> extends BaseModel {
  private selectedStates = new Map<T, boolean>();

  private _options: T[] = [];
  get options(): T[] {
    return this._options;
  }

  set options(value: T[]) {
    this._options = value;
    this.changed();
  }

  private _transformer: Transformer<T, any> = objectById;

  get transformer(): Transformer<T, any> {
    return this._transformer;
  }

  set transformer(value: Transformer<T, any>) {
    this._transformer = value;
    this.changed();
  }

  private _valueField = 'id';

  get valueField(): string {
    return this._valueField;
  }

  set valueField(value: string) {
    if (value !== this._valueField) {
      this._valueField = value;
      this.transformer = objectByField(value);
    }
  }

  get allSelected(): boolean {
    return this.options && this.options.length && !this.anyUnselected;
  }

  set allSelected(value: boolean) {
    if (value) {
      this.selectAll();
    } else {
      this.deselectAll();
    }
  }

  get indeterminate(): boolean {
    return this.anySelected && this.anyUnselected;
  }

  get anySelected(): boolean {
    return !!this.options && this.options.filter((option) => this.selected(option)).length > 0;
  }

  get anyUnselected(): boolean {
    return !!this.options && this.options.filter((option) => this.unselected(option)).length > 0;
  }

  get selection(): T[] {
    if (!this.options) {
      return [];
    }

    return this.options.filter((option) => this.selected(option));
  }

  set selection(selections: T[]) {
    if (!selections) {
      return;
    }
    selections.forEach((value) => {
      this.select(value);
    });
  }

  setOptions(value: T[]): this {
    this.options = value;
    return this;
  }

  setTransformer(value: Transformer<T, any>): this {
    this.transformer = value;
    return this;
  }

  setValueField(field: string): this {
    this.valueField = field;
    return this;
  }

  setAllSelected(value: boolean): this {
    this.allSelected = value;
    return this;
  }

  selected(option: T): boolean {
    return this.selectedStates.get(this._transformer(option));
  }

  unselected(option: T): boolean {
    return !this.selected(option);
  }

  selectAs(option: T, value: any): void {
    this.selectedStates.set(this._transformer(option), !!value);
    this.changed();
  }

  select(option: T): void {
    this.selectAs(option, true);
  }

  deselect(option: T): void {
    this.selectAs(option, false);
  }

  selectAll(): void {
    this.options.forEach((option) => this.select(option));
  }

  deselectAll(): void {
    this.options.forEach((option) => this.deselect(option));
  }

  toggle(option: T): void {
    this.selectAs(option, !this.selected(option));
  }

  toggleAll(): void {
    this.options.forEach((option) => this.toggle(option));
  }

  setSelection(value: T[]): this {
    this.selection = value;
    return this;
  }
}
