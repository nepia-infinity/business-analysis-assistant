import {
  buildBusinessAnalysisModal,
  CATEGORY_ACTION_ID,
  CATEGORY_BLOCK_ID,
  FRAMEWORK_ACTION_ID,
  FRAMEWORK_BLOCK_ID,
  getFrameworkBlockId,
  readModalState,
} from "./business_analysis_modal.ts";

const assertEquals = (actual: unknown, expected: unknown): void => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
};

const getFrameworkValues = (category: string): string[] => {
  const modal = buildBusinessAnalysisModal({ category });
  const block = modal.blocks.find(({ block_id }) =>
    block_id.startsWith(FRAMEWORK_BLOCK_ID)
  );

  return block?.element.options?.map(({ value }) => value) ?? [];
};

Deno.test("business and market category shows PEST", () => {
  assertEquals(
    getFrameworkValues("business-market"),
    ["swot", "3c", "pest"],
  );
});

Deno.test("resources and organization category shows 7S", () => {
  assertEquals(
    getFrameworkValues("resources-organization"),
    ["vrio", "7s"],
  );
});

Deno.test("goal setting category shows SMART", () => {
  assertEquals(
    getFrameworkValues("goal-setting"),
    ["smart"],
  );
});

Deno.test("communication category shows DESC and social style", () => {
  assertEquals(
    getFrameworkValues("communication"),
    ["desc", "social-style"],
  );
});

Deno.test("modal keeps the selected framework and entered values", () => {
  const modal = buildBusinessAnalysisModal({
    category: "resources-organization",
    framework: "7s",
    channel: "C12345",
    prompt: "組織の課題を分析する",
  });
  const frameworkBlock = modal.blocks.find(({ block_id }) =>
    block_id === getFrameworkBlockId("resources-organization")
  );
  const channelElement = modal.blocks.find(({ block_id }) =>
    block_id === "channel_block"
  )?.element as { initial_channel?: string };
  const promptElement = modal.blocks.find(({ block_id }) =>
    block_id === "prompt_block"
  )?.element as { initial_value?: string };

  assertEquals(frameworkBlock?.element.action_id, FRAMEWORK_ACTION_ID);
  assertEquals(frameworkBlock?.element.initial_option?.value, "7s");
  assertEquals(channelElement.initial_channel, "C12345");
  assertEquals(promptElement.initial_value, "組織の課題を分析する");
});

Deno.test("category change does not retain a framework from the old category", () => {
  const state = readModalState({
    state: {
      values: {
        [CATEGORY_BLOCK_ID]: {
          [CATEGORY_ACTION_ID]: {
            selected_option: { value: "resources-organization" },
          },
        },
        [getFrameworkBlockId("business-market")]: {
          [FRAMEWORK_ACTION_ID]: {
            selected_option: { value: "swot" },
          },
        },
      },
    },
  });

  assertEquals(state.category, "resources-organization");
  assertEquals(state.framework, undefined);
});
