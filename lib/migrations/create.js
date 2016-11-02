#!/usr/bin/env node
const fs = require('fs')

if (process.argv.length !== 3) {
  throw new Error('usage: npm run create-migration your-name')
}

const finalPath = __dirname + '/' + Date.now() + '-' + process.argv[2] + '.js'

fs.createReadStream(__dirname + '/_template.js')
  .pipe(fs.createWriteStream(finalPath))

console.log('New migration file created: ', finalPath)
