import { nodeResolve } from '@rollup/plugin-node-resolve'
const htmlTemplate = require('rollup-plugin-generate-html-template')
const typescript = require('@rollup/plugin-typescript')

export default {
  input: 'src/main.ts',
  output: [
    { format: 'iife', name: 'Space', dir: 'dist' }
  ],
  plugins: [
    nodeResolve(),
    typescript(),
    htmlTemplate({
      template: 'src/index.html',
      target: 'index.html'
    }),
  ]
}


