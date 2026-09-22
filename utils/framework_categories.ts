export type FrameworkChoice = {
  value: string;
  title: string;
  description: string;
};

export type FrameworkCategory = {
  value: string;
  title: string;
  description: string;
  frameworks: FrameworkChoice[];
};

export const frameworkCategories: FrameworkCategory[] = [
  {
    value: "business-market",
    title: "事業・市場分析",
    description: "事業、市場、外部環境を整理します",
    frameworks: [
      {
        value: "swot",
        title: "SWOT分析（強み・弱み・機会・脅威）",
        description: "内部要因と外部要因を整理します",
      },
      {
        value: "3c",
        title: "3C分析（顧客・競合・自社）",
        description: "顧客・競合・自社の観点から整理します",
      },
      {
        value: "pest",
        title: "PEST分析（政治・経済・社会・技術）",
        description: "事業を取り巻く外部環境を整理します",
      },
    ],
  },
  {
    value: "marketing",
    title: "マーケティング分析",
    description: "提供価値やマーケティング施策を整理します",
    frameworks: [
      {
        value: "4p",
        title: "4P分析（製品・価格・流通・販促）",
        description: "提供者側のマーケティング施策を整理します",
      },
      {
        value: "4c",
        title: "4C分析（顧客価値・コスト・利便性・対話）",
        description: "顧客側から提供価値を整理します",
      },
    ],
  },
  {
    value: "resources-organization",
    title: "経営資源・組織分析",
    description: "競争優位や組織の状態を整理します",
    frameworks: [
      {
        value: "vrio",
        title: "VRIO分析（価値・希少性・模倣困難性・組織）",
        description: "経営資源の競争優位性を評価します",
      },
      {
        value: "7s",
        title: "マッキンゼーの7S（組織の7要素）",
        description: "戦略・組織構造・制度・人材などを整理します",
      },
    ],
  },
  {
    value: "goal-setting",
    title: "目標設定・実行",
    description: "目標を具体化し、達成条件と期限を整理します",
    frameworks: [
      {
        value: "smart",
        title: "SMARTフレームワーク（具体性・測定・達成可能性・関連性・期限）",
        description: "目標を5つの観点から具体化します",
      },
    ],
  },
  {
    value: "communication",
    title: "コミュニケーション分析",
    description: "対人行動と効果的な接し方を整理します",
    frameworks: [
      {
        value: "social-style",
        title: "ソーシャルスタイル分析（行動傾向・接し方）",
        description: "観察できる行動から効果的な接し方を整理します",
      },
    ],
  },
];

export const getFrameworkCategory = (
  categoryName: string,
): FrameworkCategory => {
  const category = frameworkCategories.find(({ value }) =>
    value === categoryName
  );

  if (!category) {
    throw new Error(`Unsupported framework category: ${categoryName}`);
  }

  return category;
};

export const getFrameworkChoice = (
  categoryName: string,
  frameworkName?: string,
): FrameworkChoice => {
  const category = getFrameworkCategory(categoryName);
  const selected = category.frameworks.find(({ value }) =>
    value === frameworkName
  );

  return selected ?? category.frameworks[0];
};
