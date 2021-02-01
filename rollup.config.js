import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

export default {
	input: 'src/stroeervideoplayer.ts',
	output: {
		dir: 'dist',
		exports: 'default',
		format: 'umd',
		name: 'stroeervideoplayer',
		sourcemap: true
	},
	plugins: [
		typescript(),
		json()
	]
};
