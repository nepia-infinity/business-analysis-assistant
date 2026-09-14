import { Manifest } from "deno-slack-sdk/mod.ts";
import BusinessAnalysisFrameworkWorkflow from "./workflows/business_analysis_framework_workflow.ts";
import { GenerateBusinessAnalysisFunctionDefinition } from "./functions/generate_business_analysis_function.ts";

/**
 * The app manifest contains the app's configuration.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "Business Analysis Assistant",
  description:
    "質問に答えるだけでビジネスフレームワークを使った分析を始められるSlackアプリ",
  icon: "assets/default_new_app_icon.png",
  functions: [GenerateBusinessAnalysisFunctionDefinition],
  workflows: [BusinessAnalysisFrameworkWorkflow],
  outgoingDomains: ["api.sakana.ai"],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
