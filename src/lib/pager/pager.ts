import { BaseModel } from '@ui-model/core';

export class Pager extends BaseModel {
  private _index = 0;

  get index(): number {
    return this._index;
  }

  set index(value: number) {
    value = +value;
    if (value < this.indexMin) {
      value = this.indexMin;
    }
    if (value > this.indexMax) {
      value = this.indexMax;
    }

    if (this._index !== value) {
      this._index = Math.max(value, 0);
      this.changed();
    }
  }

  get isFirst(): boolean {
    return this.index <= this.indexMin;
  }

  get isLast(): boolean {
    return this.index >= this.indexMax;
  }

  get offset(): number {
    return Math.max(this.index * this.size, 0);
  }

  private _size = 10;

  get size(): number {
    return this._size;
  }

  set size(value: number) {
    value = +value;
    if (value < 0) {
      throw new Error('`pageSize` cannot be less than 0');
    }
    if (this._size !== value) {
      const latestOffset = this.offset;
      this._size = value;
      this.index = Math.floor(latestOffset / this._size);
      if (this.index > this.indexMax) {
        this.index = this.indexMax;
      }
      this.changed();
    }
  }

  get begin(): number {
    return this.offset;
  }

  get end(): number {
    return Math.min(this.offset + this.size, this.totalItems);
  }

  private _totalItems = 0;

  get totalItems(): number {
    return this._totalItems;
  }

  set totalItems(value: number) {
    value = +value;
    if (value < 0) {
      throw new Error('`totalItems` cannot be less than 0');
    }

    if (this._totalItems !== value) {
      const latestPage = this.index;
      this._totalItems = value;
      this.goTo(latestPage);
      this.changed();
    }
  }

  get isEmpty(): boolean {
    return this.totalItems === 0;
  }

  get count(): number {
    if (this.size === 0) {
      return 0;
    }
    return Math.ceil(this.totalItems / this.size);
  }

  get indexMin(): number {
    return 0;
  }

  get indexMax(): number {
    return this.count - 1;
  }

  get hasPrev(): boolean {
    return !this.isFirst;
  }

  get hasNext(): boolean {
    return !this.isLast;
  }

  get required(): boolean {
    return this.totalItems > this.size;
  }

  setIndex(value: number): this {
    this.index = value;
    return this;
  }

  isActive(page: number): boolean {
    return this.index === page;
  }

  setSize(value: number): this {
    this.size = value;
    return this;
  }

  setTotalItems(value: number): this {
    this.totalItems = value;
    return this;
  }

  prev(step: number = 1): void {
    this.index -= step;
  }

  next(step: number = 1): void {
    this.index += step;
  }

  goTo(page: number): void {
    this.index = page;
  }

  goToFirst(): void {
    this.goTo(this.indexMin);
  }

  goToLast(): void {
    this.goTo(this.indexMax);
  }
}
