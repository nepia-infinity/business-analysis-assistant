export type FrameworkDefinition = {
  label: string;
  perspectives: string[];
};

export const frameworkDefinitions: Record<string, FrameworkDefinition> = {
  swot: {
    label: "SWOT分析",
    perspectives: [
      "Strengths（強み）",
      "Weaknesses（弱み）",
      "Opportunities（機会）",
      "Threats（脅威）",
    ],
  },
  "3c": {
    label: "3C分析",
    perspectives: [
      "Customer（顧客）",
      "Competitor（競合）",
      "Company（自社）",
    ],
  },
  "4p": {
    label: "4P分析",
    perspectives: [
      "Product（製品）",
      "Price（価格）",
      "Place（流通）",
      "Promotion（販促）",
    ],
  },
  "4c": {
    label: "4C分析",
    perspectives: [
      "Customer Value（顧客価値）",
      "Cost（顧客負担）",
      "Convenience（利便性）",
      "Communication（対話）",
    ],
  },
  vrio: {
    label: "VRIO分析",
    perspectives: [
      "Value（経済的価値）",
      "Rarity（希少性）",
      "Imitability（模倣困難性）",
      "Organization（組織）",
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
