import type { InlineConfig } from 'vite'
import type { Node as PosthtmlNode, Plugin as PosthtmlPlugin } from 'posthtml'
import posthtml from 'posthtml'
import type { Options } from '../src/index'
import viteHtmlResolveAliasPlugin from '../src/index'

export function createViteConfig(alias: Record<string, string>, options?: Options): InlineConfig {
  return {
    configFile: false,
    root: __dirname,
    resolve: {
      alias,
    },
    plugins: [
      viteHtmlResolveAliasPlugin(options),
    ],
  }
}

export function matchTag(html: string, tagName: string, callback: (node?: PosthtmlNode) => void) {
  const plugin: PosthtmlPlugin<any> = (tree) => {
    tree.match({ tag: tagName }, (node) => {
      callback(node)
      return node
    })
  }
  posthtml([plugin]).process(html)
}
