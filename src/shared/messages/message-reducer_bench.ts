import { number, object, string } from "zod";
import { assertDefined } from "../utils/assert-defined.ts";
import { makeReducer, on, state } from "./message-reducer.ts";
import { message } from "./message.ts";

class FooMessage extends message("Foo", object({ name: string() })) {}
class BarMessage extends message("Bar", object({ age: number() })) {}

interface SampleState {
  name: string;
  age: number;
}

const sampleStateReducer = makeReducer(state<SampleState | null>(null), [
  on(FooMessage, (_, message) => {
    const a: SampleState = {
      name: message.payload.name,
      age: 0,
    };
    return a;
  }),
  on(BarMessage, (state, message) => {
    assertDefined(state);
    state.age = message.payload.age;
  }),
]);

Deno.bench(function createReducer() {
  makeReducer(state<SampleState | null>(null), [
    on(FooMessage, (_, message) => {
      const a: SampleState = {
        name: message.payload.name,
        age: 0,
      };
      return a;
    }),
    on(BarMessage, (state, message) => {
      assertDefined(state);
      state.age = message.payload.age;
    }),
  ]);
});

Deno.bench(function reducerMultipleMessages() {
  [
    new FooMessage({ name: "Ned" }),
    new BarMessage({ age: 123 }),
    new BarMessage({ age: 13 }),
    new BarMessage({ age: 123 }),
    new FooMessage({ name: "Ned Start" }),
    new BarMessage({ age: 1232 }),
    new BarMessage({ age: 12321 }),
    new BarMessage({ age: 974 }),
  ].reduce(sampleStateReducer, null);
});
