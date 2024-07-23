import path from 'node:path'
import type { Plugin as PosthtmlPlugin } from 'posthtml'
import posthtml from 'posthtml'
import type { ResolvedConfig, Plugin as VitePlugin } from 'vite'
import { normalizePath } from 'vite'

type Tags = Record<string, string[]>

export interface Options {
  tags?: Tags
}

const defaultTags: Tags = {
  video: ['src', 'poster'],
  source: ['src'],
  img: ['src'],
  image: ['xlink:href', 'href'],
  use: ['xlink:href', 'href'],
  link: ['href'],
  script: ['src'],
}

// rollup-alias matches
function matches(pattern: string | RegExp, importee: string) {
  if (pattern instanceof RegExp) {
    return pattern.test(importee)
  }
  if (importee.length < pattern.length) {
    return false
  }
  if (importee === pattern) {
    return true
  }
  return importee.startsWith(`${pattern}/`)
}

function viteHtmlResolveAliasPlugin(options?: Options): VitePlugin {
  const tags = options?.tags ?? defaultTags
  let config: ResolvedConfig

  return {
    name: 'vite-plugin-html-resolve-alias',

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    transformIndexHtml: {
      order: 'pre',

      async handler(html, { filename }) {
        const { resolve: { alias } } = config

        const posthtmlTransformPlugin: PosthtmlPlugin<void> = (tree) => {
          tree.match(
            Object.keys(tags).map(tag => ({ tag })),
            (node) => {
              Object.entries(node.attrs || {}).forEach(([key, value = '']) => {
                if (tags[node.tag].includes(key)) {
                  const matched = alias.find(entry => matches(entry.find, value))

                  if (!matched) {
                    return
                  }

                  node.attrs[key] = normalizePath(
                    path.relative(
                      path.dirname(filename),
                      value.replace(matched.find, matched.replacement),
                    ),
                  )
                }
              })
              return node
            },
          )
        }

        try {
          const result = await posthtml([posthtmlTransformPlugin]).process(html)
          return result.html
        }
        catch (e) {
          console.error(
            `Transform Html error: ${e.message}`,
          )
        }

        return null
      },
    },
  }
}

export default viteHtmlResolveAliasPlugin
