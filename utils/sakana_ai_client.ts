import {
  type FrameworkAnalysisResults,
  getFrameworkDefinition,
} from "./framework_definitions.ts";

const SAKANA_API_URL = "https://api.sakana.ai/v1/chat/completions";
const SAKANA_MODEL = "sakana-namazu";

type Fetcher = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

type SakanaClientOptions = {
  apiKey: string;
  fetcher?: Fetcher;
};

type SakanaChatCompletion = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

const parseAnalysisResults = (
  content: string,
  expectedKeys: string[],
): FrameworkAnalysisResults => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Sakana AI returned invalid JSON");
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Sakana AI returned an invalid analysis result");
  }

  const record = parsed as Record<string, unknown>;
  const results: FrameworkAnalysisResults = {};

  for (const key of expectedKeys) {
    const value = record[key];
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`Sakana AI response is missing: ${key}`);
    }
    results[key] = value.trim();
  }

  return results;
};

/**
 * Sakana Namazuに分析を依頼し、フレームワークの各観点をキーとする結果を返します。
 */
export const generateBusinessAnalysis = async (
  frameworkName: string,
  userPrompt: string,
  options: SakanaClientOptions,
): Promise<FrameworkAnalysisResults> => {
  const framework = getFrameworkDefinition(frameworkName);
  const apiKey = options.apiKey;

  if (!apiKey?.trim()) {
    throw new Error("SAKANA_AI_API_KEY is not configured");
  }

  const properties = Object.fromEntries(
    framework.perspectives.map(({ key, label }) => [
      key,
      {
        type: "string",
        description: `${label}の分析結果。簡潔な日本語で記述する`,
      },
    ]),
  );
  const required = framework.perspectives.map(({ key }) => key);
  const fetcher = options.fetcher ?? fetch;

  const response = await fetcher(SAKANA_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: SAKANA_MODEL,
      messages: [
        {
          role: "system",
          content:
            "あなたは慎重なビジネスアナリストです。入力された情報だけを根拠に分析し、事実と推測を区別してください。情報が不足している観点では、不足している情報と確認すべき事項を明示してください。各観点は日本語で200文字以内を目安に簡潔に記述してください。",
        },
        {
          role: "user",
          content:
            `${framework.label}を実施してください。\n\n分析対象:\n${userPrompt.trim()}`,
        },
      ],
      max_completion_tokens: 1600,
      temperature: 0.2,
      chat_template_kwargs: {
        thinking: false,
      },
      response_format: {
        type: "json_schema",
        json_schema: {
          name: `${frameworkName}_analysis`,
          strict: true,
          schema: {
            type: "object",
            properties,
            required,
            additionalProperties: false,
          },
        },
      },
    }),
    signal: AbortSignal.timeout(120_000),
  });

  const body = await response.json() as SakanaChatCompletion;

  if (!response.ok) {
    const detail = body.error?.message ?? `HTTP ${response.status}`;
    throw new Error(`Sakana AI request failed: ${detail}`);
  }

  const content = body.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Sakana AI returned an empty response");
  }

  return parseAnalysisResults(content, required);
};
