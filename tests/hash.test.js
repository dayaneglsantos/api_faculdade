import { expect, test } from "vitest";
import { hashPassword } from "../src/services/hashPassword";

test("hashPassword should hash the password", async () => {
  const password = "mySecurePassword";
  const hashedPassword = await hashPassword(password);
  expect(hashedPassword).not.toBe(password);
});
