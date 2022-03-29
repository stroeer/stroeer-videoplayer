import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import pkg from './package.json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const isDevMode = Boolean(process.env.ROLLUP_WATCH)
console.log('is dev mode', isDevMode)

export default [{
  input: 'src/StroeerVideoplayer.ts',
  output: {
    file: 'dist/StroeerVideoplayer.umd.js',
    exports: 'default',
    format: 'umd',
    name: 'StroeerVideoplayer',
    sourcemap: isDevMode
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      sourceMap: isDevMode
    }),
    json()
  ]
},
{
  input: 'src/StroeerVideoplayer.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'default',
      sourcemap: isDevMode
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      sourceMap: isDevMode
    }),
    json()
  ]
},
{
  input: 'src/StroeerVideoplayer.ts',
  output: [
    {
      file: pkg.module,
      format: 'es',
      exports: 'default',
      sourcemap: isDevMode
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      sourceMap: isDevMode
    }),
    json()
  ]
}]
