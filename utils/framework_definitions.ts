export type FrameworkPerspective = {
  key: string;
  label: string;
};

export type FrameworkDefinition = {
  label: string;
  perspectives: FrameworkPerspective[];
};

export type FrameworkAnalysisResults = Record<string, string>;

/**
 * {
 *  swot: { ... },   // OK
 *  "3c": { ... },   // クォート必須
 * }
 */
export const frameworkDefinitions: Record<string, FrameworkDefinition> = {
  swot: {
    label: "SWOT分析",
    perspectives: [
      { key: "strengths", label: "Strengths（強み）" },
      { key: "weaknesses", label: "Weaknesses（弱み）" },
      { key: "opportunities", label: "Opportunities（機会）" },
      { key: "threats", label: "Threats（脅威）" },
    ],
  },
  "3c": {
    label: "3C分析",
    perspectives: [
      { key: "customer", label: "Customer（顧客）" },
      { key: "competitor", label: "Competitor（競合）" },
      { key: "company", label: "Company（自社）" },
    ],
  },
  "4p": {
    label: "4P分析",
    perspectives: [
      { key: "product", label: "Product（製品）" },
      { key: "price", label: "Price（価格）" },
      { key: "place", label: "Place（流通）" },
      { key: "promotion", label: "Promotion（販促）" },
    ],
  },
  "4c": {
    label: "4C分析",
    perspectives: [
      { key: "customer_value", label: "Customer Value（顧客価値）" },
      { key: "cost", label: "Cost（顧客負担）" },
      { key: "convenience", label: "Convenience（利便性）" },
      { key: "communication", label: "Communication（対話）" },
    ],
  },
  vrio: {
    label: "VRIO分析",
    perspectives: [
      { key: "value", label: "Value（経済的価値）" },
      { key: "rarity", label: "Rarity（希少性）" },
      { key: "imitability", label: "Imitability（模倣困難性）" },
      { key: "organization", label: "Organization（組織）" },
    ],
  },
  pest: {
    label: "PEST分析",
    perspectives: [
      { key: "politics", label: "Politics（政治・法制度）" },
      { key: "economy", label: "Economy（経済）" },
      { key: "society", label: "Society（社会）" },
      { key: "technology", label: "Technology（技術）" },
    ],
  },
  "7s": {
    label: "マッキンゼーの7S",
    perspectives: [
      { key: "strategy", label: "Strategy（戦略）" },
      { key: "structure", label: "Structure（組織構造）" },
      { key: "systems", label: "Systems（制度・仕組み）" },
      { key: "shared_values", label: "Shared Values（共通価値観）" },
      { key: "skills", label: "Skills（能力）" },
      { key: "staff", label: "Staff（人材）" },
      { key: "style", label: "Style（組織風土・経営スタイル）" },
    ],
  },
  smart: {
    label: "SMARTフレームワーク",
    perspectives: [
      { key: "specific", label: "Specific（具体的に）" },
      { key: "measurable", label: "Measurable（測定可能に）" },
      { key: "achievable", label: "Achievable（達成可能か）" },
      { key: "realistic", label: "Realistic（関連性）" },
      { key: "time_bound", label: "Time-bound（期限）" },
    ],
  },
  "social-style": {
    label: "ソーシャルスタイル分析",
    perspectives: [
      { key: "observed_behavior", label: "観察できる行動" },
      { key: "assertiveness", label: "自己主張度" },
      { key: "responsiveness", label: "感情表現度" },
      { key: "estimated_style", label: "推定スタイル" },
      { key: "communication_tips", label: "効果的な接し方" },
      { key: "cautions", label: "判断上の注意" },
    ],
  },
};

/**
 * 指定されたフレームワーク名に対応する定義を取得します。
 *
 * `frameworkDefinitions` をフレームワーク名で参照し、
 * 対応する `label` と `perspectives` を返します。
 *
 * 未対応のフレームワークが指定された場合はエラーを送出します。
 *
 * @param framework - 取得するフレームワーク名。例: `"swot"`, `"3c"`, `"vrio"`
 * @returns 指定されたフレームワークの定義
 * @throws 未対応のフレームワークが指定された場合
 *
 * @example
 * const framework = getFrameworkDefinition("vrio");
 *
 * console.log(framework.label);
 * // => "VRIO分析"
 */

export const getFrameworkDefinition = (
  framework: string,
): FrameworkDefinition => {
  // frameworkDefinitions[vrio] labelとperspectivesを返す
  const definition = frameworkDefinitions[framework];

  if (!definition) {
    throw new Error(`Unsupported framework: ${framework}`);
  }

  return definition;
};
