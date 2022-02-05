const htmlTemplate = require('rollup-plugin-generate-html-template')
const typescript = require('@rollup/plugin-typescript')

export default {
  input: 'src/main.ts',
  output: [
    { format: 'iife', name: 'Space', dir: 'dist' }
  ],
  plugins: [
    typescript(),
    htmlTemplate({
      template: 'src/index.html',
      target: 'index.html'
    }),
  ]
}


