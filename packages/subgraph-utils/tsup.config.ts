import type { Options } from 'tsup';

// const env = process.env.NODE_ENV;

export const tsup: Options = {
  splitting: true,
  clean: true, // clean up the dist folder
  //dts: true, // generate dts files
  format: ['cjs', 'esm'], // generate cjs and esm files
  minify: false, // env === 'production',
  bundle: false, // env === 'production',
  skipNodeModulesBundle: true,
  entryPoints: ['src/index.ts'],
  watch: false, // env === 'development',
  target: 'es2022',
  outDir: 'dist',
  entry: ['src/**/*.ts'], // include all files under src
  silent: true
};