import { frameworkDefinitions } from "./framework_definitions.ts";
import {
  frameworkCategories,
  getFrameworkCategory,
  getFrameworkChoice,
} from "./framework_categories.ts";

const assertEquals = (actual: unknown, expected: unknown): void => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
};

Deno.test("all categorized frameworks have an analysis definition", () => {
  for (const category of frameworkCategories) {
    for (const framework of category.frameworks) {
      if (!frameworkDefinitions[framework.value]) {
        throw new Error(`Missing framework definition: ${framework.value}`);
      }
    }
  }
});

Deno.test("getFrameworkChoice returns the first choice for a category", () => {
  assertEquals(
    getFrameworkChoice("resources-organization").value,
    "vrio",
  );
});

Deno.test("getFrameworkChoice keeps a choice in the selected category", () => {
  assertEquals(
    getFrameworkChoice("resources-organization", "7s").value,
    "7s",
  );
});

Deno.test("getFrameworkCategory rejects an unsupported category", () => {
  let errorMessage = "";

  try {
    getFrameworkCategory("unknown");
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : String(error);
  }

  assertEquals(
    errorMessage,
    "Unsupported framework category: unknown",
  );
});
