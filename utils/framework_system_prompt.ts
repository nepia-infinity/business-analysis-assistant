const BASE_SYSTEM_PROMPT =
  "あなたは慎重なビジネスアナリストです。入力された情報だけを根拠に分析し、事実と推測を区別してください。情報が不足している観点では、不足している情報と確認すべき事項を明示してください。各観点は日本語で200文字以内を目安に簡潔に記述してください。";

const FRAMEWORK_INSTRUCTIONS: Record<string, string> = {
  "SWOT分析":
    "SWOT分析では、分析対象の内部要因をStrengths（強み）とWeaknesses（弱み）、外部環境の要因をOpportunities（機会）とThreats（脅威）に分類してください。分類の根拠を示し、同じ内容を複数の観点へ安易に重複させないでください。",
  "3C分析":
    "3C分析では、Customer（顧客・市場）、Competitor（競合）、Company（自社）の順に整理してください。顧客のニーズ、競合との比較、自社の能力を区別し、入力にない市場情報や競合情報を事実として補わないでください。",
  "4P分析":
    "4P分析では、提供者の視点からProduct（製品・サービス）、Price（価格）、Place（流通・提供経路）、Promotion（販促）を整理してください。各施策の整合性を意識し、入力にない施策は提案または仮説であることを明示してください。",
  "4C分析":
    "4C分析では、顧客の視点からCustomer Value（顧客価値）、Cost（顧客負担）、Convenience（利便性）、Communication（対話）を整理してください。提供者側の都合ではなく、顧客が得る価値や負担を基準に分析してください。",
  "VRIO分析":
    "VRIO分析では、対象となる経営資源をValue（経済的価値）、Rarity（希少性）、Imitability（模倣困難性）、Organization（組織）の順に評価してください。各要件を満たす根拠が不足する場合は、競争優位があると断定しないでください。",
  "ソーシャルスタイル分析":
    "ソーシャルスタイル分析では、入力に記載された観察可能な言動を根拠に、自己主張度と感情表現度を推定してください。自己主張度・感情表現度がともに高い場合はエクスプレッシブ、自己主張度が高く感情表現度が低い場合はドライビング、自己主張度が低く感情表現度が高い場合はエミアブル、ともに低い場合はアナリティカルとして整理します。性格や医学的特性を診断せず、推定の不確実性と別の解釈の可能性を明示してください。",
};

/**
 * フレームワークの表示名に対応するSystem Promptを返します。
 *
 * @param frameworkLabel フレームワークの表示名。例: `"SWOT分析"`
 * @returns 共通ルールとフレームワーク固有の指示を組み合わせたプロンプト
 * @throws 対応するフレームワーク固有の指示が定義されていない場合
 */
export const getFrameworkSystemPrompt = (frameworkLabel: string): string => {
  const frameworkInstruction = FRAMEWORK_INSTRUCTIONS[frameworkLabel];

  if (!frameworkInstruction) {
    throw new Error(`Unsupported framework label: ${frameworkLabel}`);
  }

  return `${BASE_SYSTEM_PROMPT}\n\n${frameworkInstruction}`;
};
