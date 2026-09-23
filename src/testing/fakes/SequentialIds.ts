import type { IdGenerator } from "../../ids";

// Chapter 7: "fake it with a sequence". ord_1, ord_2, ...
export class SequentialIds implements IdGenerator {
  private n = 0;
  constructor(private readonly prefix = "ord_") {}
  next() {
    this.n += 1;
    return `${this.prefix}${this.n}`;
  }
}
