import {
  describe, it, expect, beforeEach, afterEach
} from 'vitest'
import { createServer, ViteDevServer } from 'vite'
import path from 'path'
import { createViteConfig, matchTag } from './helper'

describe('vite server transform', () => {
  let server: ViteDevServer

  beforeEach(async () => {
    server = await createServer(createViteConfig({
      '@': path.resolve(__dirname),
      '@foo': path.resolve(__dirname, 'foo'),
      '@nested': path.resolve(__dirname, 'foo/bar')
    }))
  })

  afterEach(() => {
    if (server) {
      server.close()
      server = null
    }
  })

  it('transform html', async () => {
    const html = '<img id="img1" src="@/a.png" /><img id="img2" src="@nested/a.png" />'
    const result = await server.transformIndexHtml('/index.html', html)
    matchTag(result, 'img', (node) => {
      const { id, src } = node.attrs as Record<string, string>
      if (id === 'img1') expect(src).toBe('a.png')
      if (id === 'img2') expect(src).toBe('foo/bar/a.png')
    })
  })

  it('transform nested html', async () => {
    const html = '<img id="img1" src="@/a.png" /><img id="img2" src="@nested/a.png" />'
    const result = await server.transformIndexHtml('/foo/index.html', html)
    matchTag(result, 'img', (node) => {
      const { id, src } = node.attrs as Record<string, string>
      if (id === 'img1') expect(src).toBe('../a.png')
      if (id === 'img2') expect(src).toBe('bar/a.png')
    })
  })

  it('defalut tags', async () => {
    const html = `<img src="@foo/a.ext" />
    <video src="@foo/b.ext" poster="@foo/c.ext">
      <source src="@foo/d.ext">
    </video>
    <svg>
      <image xlink:href="@foo/e.ext" href="@foo/f.ext"></image>
      <use xlink:href="@foo/g.ext" href="@foo/h.ext"></use>
    </svg>`
    const result = await server.transformIndexHtml('/index.html', html)

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
  })
})
