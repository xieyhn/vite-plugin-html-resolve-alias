# vite-plugin-html-resolve-alias

## 安装

```bash
npm install vite-plugin-html-resolve-alias -D
```

```bash
yarn add vite-plugin-html-resolve-alias -D
```

```bash
pnpm install vite-plugin-html-resolve-alias -D
```

## 使用

在 Vite 配置中添加插件：

```ts
import path from 'node:path'
import { defineConfig } from 'vite'
import viteHtmlResolveAlias from 'vite-plugin-html-resolve-alias'

export default defineConfig({
  resolve: {
    // https://vitejs.cn/config/#resolve-alias
    alias: {
      '@': path.resolve(__dirname, 'src/')
    }
  },
  plugins: [
    viteHtmlResolveAlias(/* Options */)
  ]
})
```

接下来，你可以在 HTML 中使用别名：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="@/main.css">
</head>
<body>
  <img src="@/foo.png" />
  <script src="@/main.js"></script>
</body>
</html>
```

## 选项

### tags

指定要解析的标签和标签属性名称。

```ts
type Tags = Record<string, string[]>
```

Default

```ts
const defaultTags: Tags = {
  video: ['src', 'poster'],
  source: ['src'],
  img: ['src'],
  image: ['xlink:href', 'href'],
  use: ['xlink:href', 'href'],
  link: ['href'],
  script: ['src']
}
```

## License

[MIT](https://github.com/haiya6/vite-plugin-html-resolve-alias/blob/main/LICENSE)
