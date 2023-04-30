import { assertEquals } from "https://deno.land/std@0.178.0/testing/asserts.ts";
import { message } from "./message.ts";
import { on, reducer } from "./message-reducer.ts";
import { assertDefined } from "../utils/assert-defined.ts";

class FooMessage extends message<{ name: string }>("Foo") {}
class BarMessage extends message<{ age: number }>("Bar") {}

interface SampleState {
  name: string;
  age: number;
}

const sampleStateReducer = reducer<SampleState | undefined>([
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

Deno.test(function withSimpleCalls() {
  let result = undefined;
  result = sampleStateReducer(result, new FooMessage({ name: "Ned" }));
  result = sampleStateReducer(result, new BarMessage({ age: 123 }));

  assertEquals(result, { name: "Ned", age: 123 });
});

Deno.test(function withReduceFunction() {
  const result = [new FooMessage({ name: "Ned" }), new BarMessage({ age: 123 })]
    .reduce(
      sampleStateReducer,
      undefined,
    );

  assertEquals(result, { name: "Ned", age: 123 });
});
