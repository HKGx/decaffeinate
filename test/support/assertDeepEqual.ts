import { fail } from 'assert';

/**
 * Variant on assert.deepStrictEqual that does not do prototype checking so that
 * it can be used on values originating from different V8 contexts.
 */
export default function assertDeepEqual(actual: unknown, expected: unknown, message: string): void {
  if (!isDeepEqual(actual, expected)) {
    fail(actual, expected, message, 'assertDeepEqual');
  }
}

function isDeepEqual(actual: unknown, expected: unknown): boolean {
  if (actual === expected) {
    return true;
  }
  if (actual === null || actual === undefined || expected === null || expected === undefined) {
    return false;
  }
  if (Array.isArray(actual) && Array.isArray(expected)) {
    return actual.length === expected.length && actual.every((val, i) => isDeepEqual(val, expected[i]));
  }
  if (typeof actual === 'object' && actual && typeof expected === 'object' && expected) {
    const actualKeys = Object.keys(actual) as Array<keyof typeof actual>;
    const expectedKeys = Object.keys(expected) as Array<keyof typeof expected>;
    if (!isDeepEqual(actualKeys.sort(), expectedKeys.sort())) {
      return false;
    }
    return actualKeys.every((key) => isDeepEqual(actual[key], expected[key]));
  }
  return false;
}
