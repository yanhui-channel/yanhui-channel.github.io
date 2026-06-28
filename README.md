# 衍辉 channel 个人主页

一个零依赖静态站 MVP，用于快速验证个人品牌主页的视觉方向和信息架构。

## 本地预览

直接用浏览器打开 `index.html` 即可。

也可以启动任意静态服务器：

```bash
python3 -m http.server 4173
```

然后访问 `http://localhost:4173`。

## 部署建议

推荐使用 GitHub + Cloudflare Pages：

1. 将本仓库推送到 GitHub。
2. 在 Cloudflare Pages 中连接该 GitHub 仓库。
3. 构建命令留空。
4. 输出目录填写 `/`。
5. 绑定自定义域名，并将 DNS 交给 Cloudflare 管理。

这个 MVP 也可以直接部署到 GitHub Pages。后续如果要接入文章、MDX、RSS、站点地图和更完整 SEO，建议迁移到 Astro。
