import { assertEquals, assertNotEquals } from 'https://deno.land/std@0.178.0/testing/asserts.ts';
import { number, object, string } from 'zod';
import { message, safeParseMessage } from './message.ts';

class AlphaMessage extends message("Alpha", object({ name: string() })) {}
class BetaMessage extends message("Beta", object({ age: number() })) {}
class GammaMessage extends message("Gamma", object({ version: number() })) {}

Deno.test("safeParseMessage", () => {
  const ogMessage = new AlphaMessage({ name: "john" });

  const [newMessage, error] = safeParseMessage(
    JSON.stringify(ogMessage),
    [
      AlphaMessage,
      BetaMessage,
      GammaMessage,
    ],
  );

  assertEquals(error, undefined);
  assertEquals({ ...newMessage }, { ...ogMessage });
  assertNotEquals(newMessage, ogMessage);

  // Test types
  // if (newMessage) {
  //   newMessage satisfies (AlphaMessage | BetaMessage);
  //   newMessage.payload;
  // }
});
