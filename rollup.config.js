import path from 'path'
import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'

export default defineConfig([
  {
    input: path.resolve(__dirname, 'src/index.ts'),
    output: [
      {
        file: 'dist/index.mjs',
        format: 'esm'
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        exports: 'default'
      }
    ],
    plugins: [
      typescript()
    ]
  },
  {
    input: path.resolve(__dirname, 'src/index.ts'),
    output: {
      file: 'dist/index.d.ts',
      format: 'esm'
    },
    plugins: [
      dts()
    ]
  }
])
