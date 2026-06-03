# Full Width Tables

Quartz v5 的 Transformer 插件，让 Markdown 表格占满正文区域的可用宽度。

Quartz 默认会把表格包在 `.table-container` 里，表格本身带有内边距且不会自动撑满内容栏。本插件通过 rehype 处理与 CSS 注入，修正这一行为，无需手动修改 `custom.scss`。

仓库地址：[github.com/quartz-lib/full-width-tables](https://github.com/quartz-lib/full-width-tables)

## 功能

- 表格宽度设为 `100%`，占满正文内容区
- 保留 `.table-container` 的横向滚动，宽表格在小屏幕上仍可滚动查看
- 可选 `stretchToViewport` 模式，让表格突破内容栏，占满整个视口宽度
- 支持 `table-layout: auto | fixed`，控制列宽分配策略

## 要求

- [Quartz](https://quartz.jzhao.xyz/) v5.0.0 及以上
- Node.js >= 22

> [!note]
> 表格由 [GitHubFlavoredMarkdown](https://quartz.jzhao.xyz/plugins/GitHubFlavoredMarkdown) 插件渲染。请确保你的站点已启用 GFM，否则 Markdown 表格不会被解析。

## 安装

在你的 Quartz 站点根目录执行：

```bash
npx quartz plugin add github:quartz-lib/full-width-tables
```

CLI 会自动将插件写入 `quartz.config.yaml` 和 `quartz.lock.json`。

## 配置

安装后，`quartz.config.yaml` 中会出现类似配置：

```yaml
plugins:
  - source: github:quartz-lib/full-width-tables
    enabled: true
    options:
      tableLayout: auto
      stretchToViewport: false
```

### 选项说明

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `containerClass` | `string` | `"full-width-tables"` | 添加到表格容器和 `<table>` 元素的 CSS class |
| `tableLayout` | `"auto" \| "fixed"` | `"auto"` | 表格布局算法。`fixed` 时列宽按首行均分 |
| `stretchToViewport` | `boolean` | `false` | 为 `true` 时表格突破内容栏，横向占满整个视口 |

### 示例：固定列宽

```yaml
plugins:
  - source: github:quartz-lib/full-width-tables
    enabled: true
    options:
      tableLayout: fixed
```

### 示例：占满整个页面宽度

适用于希望表格与页面同宽、不受侧边栏内容区限制的场景：

```yaml
plugins:
  - source: github:quartz-lib/full-width-tables
    enabled: true
    options:
      stretchToViewport: true
```

> [!tip]
> 若页面使用了 `full-width` 或 `minimal` 页面框架，内容区本身已较宽，通常无需开启 `stretchToViewport`。

## 在 quartz.ts 中使用

如需在 TypeScript 配置中手动注册：

```ts
import * as Plugin from "./.quartz/plugins";

export default {
  plugins: {
    transformers: [
      Plugin.FullWidthTables({
        tableLayout: "auto",
        stretchToViewport: false,
      }),
    ],
  },
};
```

## 工作原理

插件做两件事：

1. **rehype 插件**：在 HTML AST 阶段，给 Markdown 渲染出的 `<table>` 添加 `full-width-tables` class。
2. **CSS 注入**：通过 Transformer 的 `externalResources()` 钩子，向页面注入内联样式，覆盖默认的表格宽度与边距。

> [!note]
> Quartz 会在 rehype 之后、JSX 转换阶段才用 `htmlToJsx` 把 `<table>` 包进 `<div class="table-container">`。因此 class 只会出现在 `<table>` 上，CSS 通过 `:has()` 选择器匹配外层容器。

默认模式下，表格占满 `article` 正文区域；开启 `stretchToViewport` 后，容器通过负边距技巧延伸至 `100vw`。

## 开发

```bash
git clone git@github.com:quartz-lib/full-width-tables.git
cd full-width-tables
npm install
npm run build
npm test
```

常用命令：

| 命令 | 说明 |
| --- | --- |
| `npm run build` | 构建并输出到 `dist/` |
| `npm run dev` | 监听模式构建 |
| `npm test` | 运行 Vitest 测试 |
| `npm run check` | 类型检查、Lint、格式与测试 |

> [!important]
> `dist/` 目录需要提交到仓库。Quartz 安装插件时优先使用预构建产物，可跳过本地编译，安装更快。

## 相关文档

- [Making your own plugins](https://quartz.jzhao.xyz/advanced/making-plugins) — Quartz 插件类型与生命周期
- [Creating Component Plugins](https://quartz.jzhao.xyz/advanced/creating-components) — Component 插件（本插件为 Transformer，与此不同）
- [GitHubFlavoredMarkdown](https://quartz.jzhao.xyz/plugins/GitHubFlavoredMarkdown) — Markdown 表格解析
