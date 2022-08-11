# vite-plugin-html-resolve-alias

[中文](https://github.com/haiya6/vite-plugin-html-resolve-alias/blob/main/docs/zh-CN.md)

Allows you to use vite-configured aliases in html content

## Install

```shell
npm install vite-plugin-html-resolve-alias -D
```

## How to use

vite.config.ts
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
    viteHtmlResolveAlias()
  ]
})
```

in your html file:

```html
<!DOCTYPE html>
<html lang="en">
<body>
  <img src="@/images/a.png" />
</body>
</html>
```

equal to:

```html
<!DOCTYPE html>
<html lang="en">
<body>
  <!-- relative directory relative to the current html file -->
  <img src="src/images/a.png" />
</body>
</html>
```

## Options

### tags

Specify the tag and tag attribute name to be resolved

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
