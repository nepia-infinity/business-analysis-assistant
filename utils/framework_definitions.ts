export type FrameworkPerspective = {
  key: string;
  label: string;
};

export type FrameworkDefinition = {
  label: string;
  perspectives: FrameworkPerspective[];
};

export type FrameworkAnalysisResults = Record<string, string>;

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
};

export const getFrameworkDefinition = (
  framework: string,
): FrameworkDefinition => {
  const definition = frameworkDefinitions[framework];

  if (!definition) {
    throw new Error(`Unsupported framework: ${framework}`);
  }

  return definition;
};
