import {
  describe, it, expect, beforeEach, afterEach
} from 'vitest'
import { createServer, ViteDevServer, Plugin as VitePlugin } from 'vite'
import path from 'path'
import { createViteConfig, matchTag } from './helper'

const alias: Record<string, string> = {
  '@': path.resolve(__dirname),
  '@foo': path.resolve(__dirname, 'foo'),
  '@nested': path.resolve(__dirname, 'foo/bar')
}

describe('transform', () => {
  let server: ViteDevServer
  let handler: (result: string) => void

  beforeEach(async () => {
    const plguin: VitePlugin = {
      name: 'vite-plugin-html-resolve-alias-test',
      transformIndexHtml: {
        enforce: 'pre',
        async transform(html) {
          if (handler) handler(html)
        }
      }
    }
    const config = createViteConfig(alias)
    config.plugins.push(plguin)
    server = await createServer(config)
  })

  afterEach(() => {
    if (server) server.close()
    handler = undefined
  })

  it('transform html', () => {
    const html = '<img id="img1" src="@/a.png" /><img id="img2" src="@nested/a.png" />'

    handler = (result) => {
      matchTag(result, 'img', (node) => {
        const { id, src } = node.attrs as Record<string, string>
        if (id === 'img1') expect(src).toBe('a.png')
        if (id === 'img2') expect(src).toBe('foo/bar/a.png')
      })
    }

    server.transformIndexHtml('/index.html', html)
  })

  it('transform nested html', () => {
    const html = '<img id="img1" src="@/a.png" /><img id="img2" src="@nested/a.png" />'

    handler = (result) => {
      matchTag(result, 'img', (node) => {
        const { id, src } = node.attrs as Record<string, string>
        if (id === 'img1') expect(src).toBe('../a.png')
        if (id === 'img2') expect(src).toBe('bar/a.png')
      })
    }

    server.transformIndexHtml('/foo/index.html', html)
  })

  it('defalut tags', () => {
    const html = `<img src="@foo/a.ext" />
    <video src="@foo/b.ext" poster="@foo/c.ext">
      <source src="@foo/d.ext">
    </video>
    <svg>
      <image xlink:href="@foo/e.ext" href="@foo/f.ext"></image>
      <use xlink:href="@foo/g.ext" href="@foo/h.ext"></use>
    </svg>`

    handler = (result) => {
      matchTag(result, 'img', (node) => expect(node.attrs['src']).toBe('foo/a.ext'))

      matchTag(result, 'video', (node) => {
        expect(node.attrs['src']).toBe('foo/b.ext')
        expect(node.attrs['poster']).toBe('foo/c.ext')
      })

      matchTag(result, 'image', (node) => {
        expect(node.attrs['xlink:href']).toBe('foo/e.ext')
        expect(node.attrs['href']).toBe('foo/f.ext')
      })

      matchTag(result, 'use', (node) => {
        expect(node.attrs['xlink:href']).toBe('foo/g.ext')
        expect(node.attrs['href']).toBe('foo/h.ext')
      })
    }

    server.transformIndexHtml('/index.html', html)
  })
})
