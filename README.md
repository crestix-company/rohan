# 串揚げと魚 ろはん

静的4ページ構成の店舗サイトです。公開するファイルは `dist/` にあります。

- トップ: `index.html`
- お品書き: `menu.html`
- 店内: `space.html`
- 店舗案内: `access.html`

## 制作・確認

- `npm run build`: 共通ヘッダー・フッターと各ページを出力。
- `npm run dev`: ローカル表示。
- `npm run verify`: ページ・画像・リンクを検証。
- `npm run verify:pages`: GitHub Pagesと同じ `/rohan/` 配下で全ページ・使用素材を検証。
- `node scripts/verify.mjs http://127.0.0.1:4198/`: 実際の配信内容が出力ファイルと一致するか確認。

## 配信

HTML、CSS、JavaScript、画像のみで動作します。サイト本体を配信する際は `dist/` を出力ディレクトリに指定してください。リポジトリ直下のREADMEはサイト本体ではありません。

### GitHub Pages

- サイトURL: https://crestix-company.github.io/rohan/
- Settings → Pages → Source は **GitHub Actions** を使用します。
- `.github/workflows/pages.yml` が `main` の変更ごとにビルド・検証し、`dist/` のみを公開します。
- **Deploy from a branch / main / root は使用しません。** ルートにはサイトの `index.html` がないため、説明書が表示されます。
- 公開完了はActionsの成功だけでなく、上記URLの本文・下層ページ・画像を確認してください。

Cloudflare Pagesを別途使う場合も、ビルドは `npm run build`、出力ディレクトリは `dist` です。これはCloudflare側の設定を自動変更するものではありません。

予約やInstagramは既存の店舗ページにリンクし、架空の受付フォームや自動更新は設置していません。店舗情報の根拠は `SOURCES.md` に記録しています。
