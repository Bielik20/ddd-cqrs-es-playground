# DDD CQRS demo

## Setup

Install Deno.

Run these commands to get started:

> Run the program

`deno run main.ts`

> Run the program and watch for file changes

`deno task dev`

> Run the tests

`deno test`

> Run the benchmarks

`deno bench`

## Sources

### Articles:

- https://serverlessland.com/event-driven-architecture/visuals/eda-and-ddd
- AWS Event Sourcing (Event Store)
  - https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-data-persistence/service-per-team.html
  - https://aws.amazon.com/blogs/database/build-a-cqrs-event-store-with-amazon-dynamodb/
  - https://medium.com/@domagojk/serverless-event-sourcing-in-aws-lambda-dynamodb-sqs-7237d79aed27
- DDD Aggregate
  - https://infinitetree.eu/blog/2017/02/08/exploring-aggregate-boundaries-in-event-sourced-systems/
  - https://betterprogramming.pub/domain-driven-design-a-walkthrough-of-building-an-aggregate-c84113aa9975
  - _comprehensive_
    https://khalilstemmler.com/articles/typescript-domain-driven-design/aggregate-design-persistence/
- Projections
  - https://domaincentric.net/blog/event-sourcing-projections
- Saga
  - https://microservices.io/patterns/data/saga.html
- CQRS
  - https://www.baeldung.com/cqrs-event-sourcing-java
- CQRS and Saga
  - https://medium.com/javarevisited/difference-between-saga-and-cqrs-design-patterns-in-microservices-acd1729a6b02
  - https://campbelltech.io/blog/f/cqrs-vs-saga

### Repositories:

- https://github.com/xolvio/typescript-event-sourcing
- https://github.com/yerinadler/typescript-event-sourcing-sample-app
- https://github.com/domagojk/beenion
- https://github.com/gregoryyoung/m-r/blob/master/SimpleCQRS/Domain.cs
- https://github.com/stemmlerjs/white-label
- https://github.com/stemmlerjs/ddd-forum
- https://github.com/aws-samples/aws-lambda-domain-model-sample

## Dictionary

- **Aggregate**: A cluster of domain objects that can be treated as a single unit. An aggregate will
  have one of its component objects be the aggregate root. Any references from outside the aggregate
  should only go to the aggregate root. The root can thus ensure the integrity of the aggregate as a
  whole.
- **Message**: A message is a piece of information that is sent from one system to another. It can
  be a command, an event, or just a regular piece of information.
- **Event**: Something that has happened in the past. Domain Events are things that have happened in
  the domain, Domain Events are not commands. Domain Events describe facts. They are named in the
  past tense so that their names read as something that has already happened.
- **Command**: A command is a message that represents an intention to change the state of the
  system. It is a request that encapsulates the intention of an action without specifying the
  implementation of that action. Commands are named in the imperative form, as something that should
  be done.
- **Query**: A query is a request for information from the system. It does not change the state of
  the system.
- **Projection**: A projection is a read model that is derived from one or more event streams. It is
  a denormalized view of the data that is optimized for a specific use case.
- **Projector**: A projector is a component that subscribes to one or more event streams and updates
  a projection based on the events that it receives.
- **UseCase**: A use case is a component that coordinates the execution of on a command or query.
- **Handler**: A handler is a component that receives a message (command, query, event) from outside
  world and translates to UseCase or Projector.
- **Gateway**: A gateway is a component that encapsulates access to an external system or resource.

## TODO

- Add examples of side effects (listening on `Event` and executing `Command`)
- Add examples of Sagas (having operation spanning multiple `Command`s and `Event`s with revert
  mechanism)
- Add a `Command`, `Query`, `Event` parsing and validation (zod?)
- Add AggregateState snapshotting (serialize and deserialize).
This will relate to that `structuredClone` we are using for initial right now.
It would be great if it could handle stuff like `Date` and `Map` and `Set` etc.
Possible libs:
  - https://www.npmjs.com/package/@ungap/structured-clone
  - https://www.npmjs.com/package/@hyurl/structured-clone
