import { generateBusinessAnalysis } from "./sakana_ai_client.ts";

const assertEquals = (actual: unknown, expected: unknown): void => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
};

Deno.test("generateBusinessAnalysis returns structured SWOT results", async () => {
  const expected = {
    strengths: "専門知識がある",
    weaknesses: "認知度が低い",
    opportunities: "市場が成長している",
    threats: "競合が増えている",
  };

  const actual = await generateBusinessAnalysis("swot", "新規サービス", {
    apiKey: "test-key",
    fetcher: () =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            choices: [{ message: { content: JSON.stringify(expected) } }],
          }),
          { status: 200 },
        ),
      ),
  });

  assertEquals(actual, expected);
});

Deno.test("generateBusinessAnalysis requests four DESC fields in order", async () => {
  const expected = {
    describe: "昨日の会議で、私の説明中に話が重なりました。",
    express: "説明を終えられず困りました。",
    specify: "次回は話し終えるまで待っていただけますか。",
    choose: "難しければ、発言の順番を先に決めたいです。",
  };
  let requestBody: Record<string, unknown> | undefined;

  const actual = await generateBusinessAnalysis("desc", "会議で話を遮られる", {
    apiKey: "test-key",
    fetcher: (_input, init) => {
      requestBody = JSON.parse(String(init?.body));
      return Promise.resolve(
        new Response(
          JSON.stringify({
            choices: [{ message: { content: JSON.stringify(expected) } }],
          }),
          { status: 200 },
        ),
      );
    },
  });

  const responseFormat = requestBody?.response_format as {
    json_schema: {
      schema: { required: string[] };
    };
  };
  assertEquals(
    responseFormat.json_schema.schema.required,
    ["describe", "express", "suggest", "consequence"],
  );
  assertEquals(actual, expected);
});

Deno.test("generateBusinessAnalysis rejects incomplete results", async () => {
  let errorMessage = "";

  try {
    await generateBusinessAnalysis("3c", "新規サービス", {
      apiKey: "test-key",
      fetcher: () =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              choices: [{
                message: { content: JSON.stringify({ customer: "顧客" }) },
              }],
            }),
            { status: 200 },
          ),
        ),
    });
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : String(error);
  }

  assertEquals(errorMessage, "Sakana AI response is missing: competitor");
});

Deno.test("generateBusinessAnalysis reports API errors", async () => {
  let errorMessage = "";

  try {
    await generateBusinessAnalysis("vrio", "経営資源", {
      apiKey: "test-key",
      fetcher: () =>
        Promise.resolve(
          new Response(
            JSON.stringify({ error: { message: "Unauthorized" } }),
            { status: 401 },
          ),
        ),
    });
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : String(error);
  }

  assertEquals(errorMessage, "Sakana AI request failed: Unauthorized");
});
