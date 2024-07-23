import fs from 'node:fs'
import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

export default defineConfig([
  {
    input: 'src/index.ts',
    external: [
      /node:.+/,
      ...Object.keys(pkg.dependencies),
      ...Object.keys(pkg.peerDependencies),
    ],
    output: {
      format: 'esm',
      dir: 'dist',
    },
    plugins: [
      typescript(),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
    },
    plugins: [
      dts(),
    ],
  },
])
