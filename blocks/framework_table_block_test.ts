import {
  buildAnalysisResultMessage,
  buildFrameworkTableBlock,
  escapeMrkdwn,
} from "./framework_table_block.ts";

const assertEquals = (actual: unknown, expected: unknown): void => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
};

Deno.test("escapeMrkdwn trims and escapes special characters", () => {
  assertEquals(
    escapeMrkdwn("  A & B <C>  "),
    "A &amp; B &lt;C&gt;",
  );
});

Deno.test("buildFrameworkTableBlock builds rows for each perspective", () => {
  const block = buildFrameworkTableBlock("3c", {
    customer: "顧客の課題",
    competitor: "競合の動向",
    company: "自社の強み",
  });

  assertEquals(block.caption, "3C分析");
  assertEquals(block.rows.length, 4);
  assertEquals(block.rows[1][1].text, "顧客の課題");
});

Deno.test("buildAnalysisResultMessage constructs message payload with blocks", () => {
  const message = buildAnalysisResultMessage({
    framework: "3c",
    prompt: "A & B <test>",
    user: "U12345",
    results: {
      customer: "顧客",
      competitor: "競合",
      company: "自社",
    },
  });

  assertEquals(message.text, "3C分析: A & B <test>");
  assertEquals(message.blocks.length, 3);
  assertEquals(message.blocks[0], {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*入力内容*\nA &amp; B &lt;test&gt;",
    },
  });
});
