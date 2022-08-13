# vite-plugin-html-resolve-alias

[中文](https://github.com/haiya6/vite-plugin-html-resolve-alias/blob/main/docs/zh-CN.md)

## Install

```bash
npm install vite-plugin-html-resolve-alias -D
```

```bash
yarn add vite-plugin-html-resolve-alias -D
```

```bash
pnpm install vite-plugin-html-resolve-alias -D
```

## Usage

Add the plugin to your Vite config as follows:

```ts
import path from 'path'
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

Next, you can use aliases in HTML:

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

## Options

### tags

Specify the tag and tag attribute name to be resolved.

```ts
type Tags = Record<string, string[]>
```

Default

```ts
{
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
