# Business Analysis Assistant

Slack上で入力した商品・事業・アイデアを、Sakana AIの日本語特化LLM 「Sakana
Namazu」で分析するSlackアプリです。

## 対応フレームワーク

- SWOT分析
- 3C分析
- 4P分析
- 4C分析
- VRIO分析
- PEST分析
- マッキンゼーの7S
- SMARTフレームワーク
- ソーシャルスタイル分析

分析結果は、選択したフレームワークの観点ごとにSlackの表として投稿されます。

## 必要なもの

- Slack有料プランの開発用ワークスペース
- [Slack CLI](https://docs.slack.dev/tools/slack-cli/)
- [Sakana AI API](https://console.sakana.ai/)のAPIキー

## セットアップ

リポジトリをクローンし、ディレクトリへ移動します。

```shell
git clone https://github.com/nepia-infinity/business-analysis-assistant.git
cd business-analysis-assistant
```

ローカル開発では、プロジェクト直下に `.env` を作成してSakana AIのAPIキーを
設定します。

```dotenv
SAKANA_AI_API_KEY=fish_...
BUSINESS_ANALYSIS_DEFAULT_CHANNEL_ID=C0123456789
```

`.env` はGitの管理対象外です。APIキーをソースコードへ直接記載しないでください。
`BUSINESS_ANALYSIS_DEFAULT_CHANNEL_ID`には、分析フォームで最初に選択される
投稿先チャンネルのIDを設定します。フォーム上で別のチャンネルへ変更することもできます。
ファイルを変更した場合は `slack run` を再起動します。

## ローカル実行

```shell
slack run
```

初回実行時は、表示される案内に従って開発用ワークスペースへアプリを作成します。

## トリガーの作成

```shell
slack trigger create \
  --trigger-def triggers/business_analysis_framework_trigger.ts
```

生成されたShortcut URLをSlackチャンネルへ投稿するか、ブックマークへ追加します。

## デプロイ

デプロイ版では `.env` は使用されません。APIキーをSlackへ登録してから
デプロイします。

```shell
slack env set SAKANA_AI_API_KEY "fish_..."
slack env set BUSINESS_ANALYSIS_DEFAULT_CHANNEL_ID "C0123456789"
slack deploy
slack trigger create \
  --trigger-def triggers/business_analysis_framework_trigger.ts
```

ローカル版とデプロイ版は別のアプリとして扱われるため、環境変数とトリガーも
利用する環境ごとに設定してください。

## デプロイ時につまずきやすいポイント

デプロイ版を実行する前に、次の2つの環境変数をSlackへ登録してください。

- `SAKANA_AI_API_KEY`: Sakana AIのAPIキー
- `BUSINESS_ANALYSIS_DEFAULT_CHANNEL_ID`: 分析結果の投稿先として最初に選択する
  SlackチャンネルのID

ローカル実行時の `.env` はデプロイ版には引き継がれません。次のコマンドで、
デプロイ版に両方の環境変数が登録されていることを確認できます。

```shell
slack env list
```

環境変数が不足している場合は、`slack env set`で登録してから実行してください。
チャンネルIDには、チャンネルURLなどで確認できる `C` から始まる値を指定します。

### デプロイ版で動作しない場合

デプロイ後にフォームが開かない、または分析結果が投稿されない場合は、
次のコマンドでデプロイ版の実行ログを表示します。

```shell
slack activity --tail
```

コマンドを起動したままSlack上で問題を再現すると、Function名、Trace ID、
エラーメッセージ、失敗した処理が表示されます。該当する実行の開始からエラーまでを
コピーしてAIへ入力すると、失敗箇所や原因の調査に役立ちます。

ログを外部へ共有する場合は、APIキー、アクセストークン、入力内容などの
機密情報が含まれていないことを確認してください。

## テスト

```shell
deno task test
```

テストではSakana AI APIをモック化しているため、APIキーや通信料金は不要です。

## 処理の流れ

1. Shortcutからワークフローを開始する
2. 中カテゴリーを選ぶと、対応するフレームワーク候補へ切り替わる
3. フレームワーク、投稿先、分析対象を入力する
4. Sakana NamazuがフレームワークごとのJSONを生成する
5. アプリがJSONを検証し、Slackへ表形式で投稿する

Sakana NamazuのWeb検索・コード実行機能は現在使用していません。分析はフォームへ
入力された情報だけを根拠として行います。

## 主なディレクトリ

| パス         | 内容                                      |
| ------------ | ----------------------------------------- |
| `blocks/`    | 分析結果のSlack Block Kit表示             |
| `functions/` | Sakana AI呼び出しとSlack投稿              |
| `triggers/`  | Shortcutトリガー                          |
| `utils/`     | フレームワーク定義とSakana AIクライアント |
| `workflows/` | 入力フォームと処理手順                    |
