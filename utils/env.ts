/**
 * Slackの実行環境（`env`）またはローカル環境変数（`Deno.env`）から値を取得します。
 * 空文字や空白のみの値は `undefined` として扱います。
 */
export const getEnvValue = (
  env: Record<string, string | undefined>,
  key: string,
): string | undefined => {
  const value = env[key] ?? Deno.env.get(key);
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
};
