import { Reducer } from "../messages/message-reducer.ts";
import { Result } from "./../utils/result.ts";
import { AggregateError } from "./error.ts";
import { AggregateEvent } from "./event.ts";

export abstract class Aggregate<TState, TEvent extends AggregateEvent> {
  abstract readonly name: string;

  get version(): number {
    return this._version;
  }
  private _version = -1;

  /**
   * There is a weird TS bug where:
   * Type 'null' is not assignable to type 'Readonly<any>'
   * This return type is a workaround for that.
   */
  get state(): TState extends null ? TState : Readonly<TState> {
    return this._state as TState extends null ? TState : Readonly<TState>;
  }
  private _state: TState;

  private _changes: TEvent[] = [];

  constructor(
    readonly id: string,
    private readonly reducer: Reducer<TState, TEvent>,
  ) {
    this._state = reducer.initial();
  }

  getUncommittedChanges(): TEvent[] {
    return [...this._changes];
  }

  markChangesAsCommitted(): void {
    this._changes = [];
  }

  loadFromHistory(history: TEvent[], initialState = this.state): void {
    if (this.version !== -1) {
      throw new Error("Aggregate already loaded!");
    }
    const lastEvent = history.at(-1);
    if (!lastEvent) {
      throw new Error("Cannot load Aggregate from empty history!");
    }

    this._state = history.reduce(this.reducer, initialState);
    this._version = lastEvent.aggregateVersion;
  }

  protected apply(event: TEvent): void {
    event.aggregateId = this.id;
    event.aggregateVersion = ++this._version;
    this._state = this.reducer(this.state, event);
    this._changes.push(event);
  }

  protected reject<T extends AggregateError>(error: T): Result<never, T> {
    error.aggregateName = this.name;
    error.aggregateId = this.id;
    error.aggregateVersion = this.version;
    return Result.err(error);
  }
}

export function aggregate<TState, TEvent extends AggregateEvent>(
  name: string,
  reducer: Reducer<TState, TEvent>,
) {
  abstract class AggregateMixin extends Aggregate<TState, TEvent> {
    override readonly name = name;

    constructor(id: string) {
      super(id, reducer);
    }
  }

  return AggregateMixin;
}
