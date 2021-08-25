import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import pkg from './package.json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default [{
  input: 'src/StroeerVideoplayer.ts',
  output: {
    file: 'dist/StroeerVideoplayer.umd.js',
    exports: 'default',
    format: 'umd',
    name: 'StroeerVideoplayer',
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    json()
  ]
},
{
  input: 'src/StroeerVideoplayer.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    json()
  ]
},
{
  input: 'src/StroeerVideoplayer.ts',
  output: [
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    json()
  ]
}]
