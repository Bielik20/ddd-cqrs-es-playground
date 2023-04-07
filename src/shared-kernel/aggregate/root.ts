import { err, Result } from "./../utils/result.ts";
import { AggregateError } from "./error.ts";
import { AggregateEvent, AggregateEventCreator, EventType } from "./event.ts";

export abstract class AggregateRoot {
  private _version = -1;
  get version(): number {
    return this._version;
  }

  private _changes: AggregateEvent[] = [];
  abstract readonly name: string;

  constructor(readonly id: string) {}

  reject(error: AggregateError<any>): Result<never, AggregateError> {
    error.aggregateName = this.name;
    error.aggregateId = this.id;
    error.aggregateVersion = this.version;
    return err(error);
  }

  getUncommittedChanges(): AggregateEvent[] {
    return [...this._changes];
  }

  markChangesAsCommitted() {
    this._changes = [];
  }

  loadFromHistory(history: AggregateEvent[]) {
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

  private applyHistoricalChange(event: AggregateEvent) {
    this.apply(event);
  }

  protected applyChange<T extends AggregateEventCreator<any, any, any>>(
    creator: T,
    payload: EventType<T>["payload"],
  ) {
    const event = creator(payload, this.id, ++this._version);
    this.apply(event);
    this._changes.push(event);
  }

  protected abstract apply(event: AggregateEvent): void;
}
