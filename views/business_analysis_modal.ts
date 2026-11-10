import {
  DEFAULT_CATEGORY,
  frameworkCategories,
  type FrameworkCategory,
  type FrameworkChoice,
  getFrameworkCategory,
  getFrameworkChoice,
} from "../utils/framework_categories.ts";

export const VIEW_CALLBACK_ID = "business_analysis_form";
export const CATEGORY_BLOCK_ID = "category_block";
export const CATEGORY_ACTION_ID = "category_select";
export const FRAMEWORK_BLOCK_ID = "framework_block";
export const FRAMEWORK_ACTION_ID = "framework_select";
export const CHANNEL_BLOCK_ID = "channel_block";
export const CHANNEL_ACTION_ID = "channel_select";
export const PROMPT_BLOCK_ID = "prompt_block";
export const PROMPT_ACTION_ID = "prompt_input";

export const getFrameworkBlockId = (category: string) =>
  `${FRAMEWORK_BLOCK_ID}_${category}`;

export type ModalState = {
  category?: string;
  framework?: string;
  channel?: string;
  prompt?: string;
};

export type ValidatedModalSubmission = {
  framework: string;
  channel: string;
  prompt: string;
};

export type ModalValidationResult =
  | { ok: true; values: ValidatedModalSubmission }
  | { ok: false; errors: Record<string, string> };

type ViewState = {
  state?: {
    values?: Record<
      string,
      Record<string, {
        value?: string;
        selected_channel?: string;
        selected_option?: { value?: string };
      }>
    >;
  };
};

const plainText = (text: string) => ({ type: "plain_text", text });

const categoryOption = (category: FrameworkCategory) => ({
  text: plainText(category.title),
  value: category.value,
  description: plainText(category.description),
});

const frameworkOption = (framework: FrameworkChoice) => ({
  text: plainText(framework.title),
  value: framework.value,
  description: plainText(framework.description),
});

/** 中カテゴリーと入力済みの値から、ビジネス分析用モーダルを構築します。 */
export const buildBusinessAnalysisModal = (state: ModalState = {}) => {
  const categoryName = state.category ?? DEFAULT_CATEGORY;
  const category = getFrameworkCategory(categoryName);
  const framework = getFrameworkChoice(categoryName, state.framework);

  return {
    type: "modal",
    callback_id: VIEW_CALLBACK_ID,
    notify_on_close: true,
    title: plainText("ビジネス分析を作成"),
    submit: plainText("分析を開始"),
    close: plainText("閉じる"),
    blocks: [
      {
        type: "input",
        block_id: CATEGORY_BLOCK_ID,
        dispatch_action: true,
        label: plainText("中カテゴリー"),
        element: {
          type: "static_select",
          action_id: CATEGORY_ACTION_ID,
          placeholder: plainText("分析の目的を選択"),
          options: frameworkCategories.map(categoryOption),
          initial_option: categoryOption(category),
        },
      },
      {
        type: "input",
        // Change the block ID with the category so Slack does not retain a
        // framework selection that is absent from the updated options.
        block_id: getFrameworkBlockId(category.value),
        label: plainText("分析フレームワーク"),
        element: {
          type: "static_select",
          action_id: FRAMEWORK_ACTION_ID,
          placeholder: plainText("フレームワークを選択"),
          options: category.frameworks.map(frameworkOption),
          initial_option: frameworkOption(framework),
        },
      },
      {
        type: "input",
        block_id: CHANNEL_BLOCK_ID,
        label: plainText("結果の投稿先"),
        element: {
          type: "channels_select",
          action_id: CHANNEL_ACTION_ID,
          placeholder: plainText("投稿先を選択"),
          ...(state.channel ? { initial_channel: state.channel } : {}),
        },
      },
      {
        type: "input",
        block_id: PROMPT_BLOCK_ID,
        label: plainText("分析したい内容"),
        element: {
          type: "plain_text_input",
          action_id: PROMPT_ACTION_ID,
          multiline: true,
          placeholder: plainText("商品・事業・アイデアなどを入力"),
          ...(state.prompt ? { initial_value: state.prompt } : {}),
        },
      },
    ],
  };
};

const getStateValue = (
  view: ViewState,
  blockId: string,
  actionId: string,
) => view.state?.values?.[blockId]?.[actionId];

export const readModalState = (view: ViewState): ModalState => {
  const category = getStateValue(view, CATEGORY_BLOCK_ID, CATEGORY_ACTION_ID)
    ?.selected_option?.value;
  const framework = category
    ? getStateValue(
      view,
      getFrameworkBlockId(category),
      FRAMEWORK_ACTION_ID,
    )?.selected_option?.value
    : undefined;

  return {
    category,
    framework,
    channel: getStateValue(view, CHANNEL_BLOCK_ID, CHANNEL_ACTION_ID)
      ?.selected_channel,
    prompt: getStateValue(view, PROMPT_BLOCK_ID, PROMPT_ACTION_ID)?.value,
  };
};

/**
 * モーダル送信時の入力値を検証し、有効な出力値またはブロック単位のエラーを返します。
 */
export const validateModalState = (
  state: ModalState,
): ModalValidationResult => {
  const errors: Record<string, string> = {};
  const trimmedPrompt = state.prompt?.trim();

  if (!state.framework) {
    errors[getFrameworkBlockId(state.category ?? "unknown")] =
      "分析フレームワークを選択してください";
  }
  if (!state.channel) {
    errors[CHANNEL_BLOCK_ID] = "投稿先を選択してください";
  }
  if (!trimmedPrompt) {
    errors[PROMPT_BLOCK_ID] = "分析したい内容を入力してください";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    values: {
      framework: state.framework!,
      channel: state.channel!,
      prompt: trimmedPrompt!,
    },
  };
};
