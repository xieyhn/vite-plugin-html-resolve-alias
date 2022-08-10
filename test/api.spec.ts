import path from 'path'
import { createServer } from 'vite'
import { describe, expect, it } from 'vitest'
import { createViteConfig, matchTag } from './helper'

const alias: Record<string, string> = {
  '@': path.resolve(__dirname)
}

describe('api', () => {
  it('custom tags', async () => {
    const html = `<img src="@/a.ext" />
    <video src="@/b.ext"></video>`

    const config = createViteConfig(alias, {
      tags: {
        img: ['src']
      }
    })

    config.plugins.push({
      name: 'vite-plugin-html-resolve-alias-test-api',
      transformIndexHtml: {
        enforce: 'pre',
        transform(result) {
          matchTag(result, 'img', (node) => expect(node.attrs['src']).toBe('a.ext'))
          matchTag(result, 'video', (node) => expect(node.attrs['src']).toBe('@/b.ext'))
        }
      }
    })

    const server = await createServer(config)
    server.transformIndexHtml('/index.html', html)
  })
})
