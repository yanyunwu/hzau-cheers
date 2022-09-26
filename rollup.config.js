// rollup.config.js
// import conmmon from 'rollup-plugin-commonjs'
// import resolve from 'rollup-plugin-node-resolve';
import json from '@rollup/plugin-json';
// import { terser } from 'rollup-plugin-terser';
// import livereload from 'rollup-plugin-livereload';
export default {
  // 核心选项
  input: "app.js",     // 必须
  // external,
  // plugins,

  // 额外选项
  // onwarn,

  // danger zone
  // acorn,
  // context,
  // moduleContext,
  // legacy

  output: {  // 必须 (如果要输出多个，可以是一个数组)
    // 核心选项
    file: "dist/boundle.js",    // 必须
    format: "cjs",  // 必须
    // name,
    // globals,

    // 额外选项
    // paths,
    // banner,
    // footer,
    // intro,
    // outro,
    // sourcemap,
    // sourcemapFile,
    // interop,

    // 高危选项
    // exports,
    // amd,
    // indent
    // strict
  },
  plugins: [
    json()
  ]
};