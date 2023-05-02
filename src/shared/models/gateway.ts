import { MessageBroker } from "../messages/message-broker.ts";
import { AggregateEvent } from "./event.ts";
import { Aggregate } from "./aggregate.ts";

export class AggregateGateway<T extends Aggregate<any, any>> {
  constructor(
    private factory: (id: string) => T,
    private readonly messagesBroker: MessageBroker,
    private readonly eventStore = new AggregateEventStoreGateway(),
  ) {}

  async save(aggregate: T): Promise<void> {
    const eventsToSave = aggregate.getUncommittedChanges();
    this.eventStore.save(aggregate.id, eventsToSave);
    eventsToSave.forEach((e) => this.messagesBroker.pub(e));
    aggregate.markChangesAsCommitted();
  }

  async exists(id: string): Promise<boolean> {
    const history = this.eventStore.get(id);

    return !!history.length;
  }

  async get(id: string): Promise<T> {
    const history = this.eventStore.get(id);
    const aggregate = this.factory(id);
    aggregate.loadFromHistory(history);
    return aggregate;
  }
}

class AggregateEventStoreGateway {
  private map = new Map<string, AggregateEvent[]>();

  get(aggregateId: string): AggregateEvent[] {
    return this.secureRead(aggregateId);
  }

  save(aggregateId: string, eventsToSave: AggregateEvent[]) {
    const firstEventToSave = eventsToSave.at(0);
    if (!firstEventToSave) {
      return;
    }

    const savedEvents = this.secureRead(aggregateId);
    if (savedEvents.find((e) => e.aggregateVersion === firstEventToSave.aggregateVersion)) {
      throw new Error("Concurrency Error - Cannot perform the operation due to internal conflict");
    }

    this.map.set(aggregateId, [...savedEvents, ...eventsToSave]);
  }

  private secureRead(aggregateId: string): AggregateEvent[] {
    return this.map.get(aggregateId) || [];
  }
}
