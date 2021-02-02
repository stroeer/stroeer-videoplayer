import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'

export default {
  input: 'src/StroeerVideoplayer.ts',
  output: {
    dir: 'dist',
    exports: 'default',
    format: 'umd',
    name: 'StroeerVideoplayer',
    sourcemap: true
  },
  plugins: [
    typescript(),
    json()
  ]
}
