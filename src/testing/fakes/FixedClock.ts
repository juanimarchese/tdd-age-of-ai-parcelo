import type { Clock } from "../../clock";

export class FixedClock implements Clock {
  constructor(private readonly fixed: Date) {}
  now() { return this.fixed; }
}
