# vite-plugin-html-resolve-alias

在 html 内容中使用 vite 配置的别名

## 安装

```shell
npm install vite-plugin-html-resolve-alias -D
```

## 使用

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

在你的 html 文件中：

```html
<!DOCTYPE html>
<html lang="en">
<body>
  <img src="@/images/a.png" />
</body>
</html>
```

等效于：

```html
<!DOCTYPE html>
<html lang="en">
<body>
  <!-- 相对于当前 html 文件的相对目录 -->
  <img src="src/images/a.png" />
</body>
</html>
```

## 选项

### tags

指定要解析的标签和标签属性名

```ts
type Tags = Record<string, string[]>
```

默认值
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
