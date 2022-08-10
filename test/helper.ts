import { InlineConfig } from 'vite'
import posthtml, { Node as PosthtmlNode, Plugin as PosthtmlPlugin } from 'posthtml'
import viteHtmlResolveAliasPlugin, { Options } from '../src/index'

export const createViteConfig = (
  alias: Record<string, string>,
  options?: Options
): InlineConfig => ({
  configFile: false,
  root: __dirname,
  resolve: {
    alias
  },
  plugins: [
    viteHtmlResolveAliasPlugin(options)
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
