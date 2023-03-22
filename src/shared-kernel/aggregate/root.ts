import { err, Result } from "./../utils/result.ts";
import { AggregateEvent } from "./event.ts";
import { AggregateError } from "./error.ts";

export abstract class AggregateRoot<
  TEvent extends AggregateEvent = AggregateEvent,
> {
  private _version = -1;
  get version(): number {
    return this._version;
  }

  private _changes: TEvent[] = [];
  abstract readonly name: string;

  constructor(readonly id: string) {}

  reject(error: AggregateError<any>): Result<never, AggregateError> {
    error.aggregateName = this.name;
    error.aggregateId = this.id;
    error.aggregateVersion = this.version;
    return err(error);
  }

  getUncommittedChanges(): TEvent[] {
    return [...this._changes];
  }

  markChangesAsCommitted() {
    this._changes = [];
  }

  loadFromHistory(history: TEvent[]) {
    if (this.version !== -1) {
      throw new Error("Aggregate already loaded!");
    }
    const lastEvent = history.at(-1);
    if (!lastEvent) {
      throw new Error("Cannot load Aggregate from empty history!");
    }

    history.forEach((event) => this.applyHistoricalChange(event));
    this._version = lastEvent.aggregateVersion;
  }

  private applyHistoricalChange(event: TEvent) {
    this.apply(event);
  }

  protected applyChange(event: TEvent) {
    event.aggregateName = this.name;
    event.aggregateId = this.id;
    event.aggregateVersion = ++this._version;
    this.apply(event);
    this._changes.push(event);
  }

  protected abstract apply(event: TEvent): void;
}
