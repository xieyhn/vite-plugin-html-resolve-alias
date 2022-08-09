import { InlineConfig } from 'vite'
import posthtml, { Node as PosthtmlNode, Plugin as PosthtmlPlugin } from 'posthtml'
import viteHtmlResolveAliasPlugin from '../src/index'

export const createViteConfig = (alias: Record<string, string>): InlineConfig => ({
  configFile: false,
  root: __dirname,
  resolve: {
    alias
  },
  plugins: [
    viteHtmlResolveAliasPlugin()
  ]
})

export const matchTag = (
  html: string,
  tagName: string,
  callback: (node?: PosthtmlNode) => void
) => {
  const plguin: PosthtmlPlugin<any> = (tree) => {
    tree.match({ tag: tagName }, (node) => {
      callback(node)
      return node
    })
  }
  posthtml([plguin]).process(html)
}
