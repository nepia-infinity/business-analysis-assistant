import { frameworkDefinitions } from "./framework_definitions.ts";
import { getFrameworkSystemPrompt } from "./framework_system_prompt.ts";

const assertIncludes = (actual: string, expected: string): void => {
  if (!actual.includes(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(actual)} to include ${expected}`,
    );
  }
};

Deno.test("getFrameworkSystemPrompt returns a framework-specific prompt", () => {
  const prompt = getFrameworkSystemPrompt("SWOT分析");

  assertIncludes(prompt, "慎重なビジネスアナリスト");
  assertIncludes(prompt, "内部要因");
  assertIncludes(prompt, "外部環境の要因");
});

Deno.test("DESC prompt asks for feelings, an alternative, and its consequence", () => {
  const prompt = getFrameworkSystemPrompt("DESC法");

  assertIncludes(prompt, "今抱えている気持ちとその理由");
  assertIncludes(prompt, "代わりの具体的な提案");
  assertIncludes(prompt, "提案を実行するとどうなるか");
});

Deno.test("all framework labels have a system prompt", () => {
  for (const framework of Object.values(frameworkDefinitions)) {
    const prompt = getFrameworkSystemPrompt(framework.label);

    assertIncludes(prompt, framework.label);
  }
});

Deno.test("getFrameworkSystemPrompt rejects an unsupported label", () => {
  let errorMessage = "";

  try {
    getFrameworkSystemPrompt("未対応の分析");
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : String(error);
  }

  if (errorMessage !== "Unsupported framework label: 未対応の分析") {
    throw new Error(`Unexpected error: ${errorMessage}`);
  }
});
