import path from 'node:path'
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from 'vitest'
import type { ViteDevServer } from 'vite'
import { createServer } from 'vite'
import type { NodeAttributes } from 'posthtml'
import { createViteConfig, matchTag } from './helper'

const alias: Record<string, string> = {
  '@': path.resolve(__dirname),
  '@foo': path.resolve(__dirname, 'foo'),
  '@nested': path.resolve(__dirname, 'foo/bar'),
}

describe('transform', () => {
  let server: ViteDevServer

  beforeAll(async () => {
    server = await createServer(createViteConfig(alias))
  })

  afterAll(async () => {
    if (server)
      await server.close()
  })

  it('transform html', async () => {
    const html = '<img id="img1" src="@/a.png" /><img id="img2" src="@nested/a.png" />'
    const result = await server.transformIndexHtml('/index.html', html)

    matchTag(result, 'img', (node) => {
      const { id, src } = node.attrs as NodeAttributes
      if (id === 'img1')
        expect(src).toBe('a.png')
      if (id === 'img2')
        expect(src).toBe('foo/bar/a.png')
    })
  })

  it('transform nested html', async () => {
    const html = '<img id="img1" src="@/a.png" /><img id="img2" src="@nested/a.png" />'
    const result = await server.transformIndexHtml('/foo/index.html', html)

    matchTag(result, 'img', (node) => {
      const { id, src } = node.attrs as NodeAttributes
      if (id === 'img1')
        expect(src).toBe('../a.png')
      if (id === 'img2')
        expect(src).toBe('bar/a.png')
    })
  })

  it('default tags', async () => {
    const html = `<img src="@foo/a.ext" />
    <video src="@foo/b.ext" poster="@foo/c.ext">
      <source src="@foo/d.ext">
    </video>
    <svg>
      <image xlink:href="@foo/e.ext" href="@foo/f.ext"></image>
      <use xlink:href="@foo/g.ext" href="@foo/h.ext"></use>
    </svg>
    <link href="@foo/i.ext" />
    <script src="@foo/j.ext" />`
    const result = await server.transformIndexHtml('/index.html', html)

    expect(result).matchSnapshot()
  })
})
