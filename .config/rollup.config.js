import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import materialSymbols from 'rollup-plugin-material-symbols'
import { glob } from 'glob'
import { mkdir, opendir, readFile, writeFile, cp } from 'fs/promises'

try {
  await opendir('./www')
} catch (error) {
  await mkdir('./www')
}

try {
  await opendir('./www/themes')
} catch (error) {
  await cp('node_modules/@vandeurenglenn/lit-elements/exports/themes', './www/themes', { recursive: true })
}

const views = await glob(['./src/views/**/*'])

let index = await readFile('./src/index.html', 'utf-8')
if (!process.env.production) {
  index = index.replace(
    '<body>',
    `
  <body>
  <script>
    const ws = new WebSocket('ws://localhost:8080', 'reload-app')
    ws.addEventListener('open', () => {
      ws.addEventListener('message', () => location.reload())
    })
    
  </script>
  `
  )
}

writeFile('./www/index.html', index)

export default [
  {
    input: ['./src/shell.ts', ...views],
    output: {
      format: 'es',
      dir: 'www'
    },
    plugins: [
      materialSymbols({
        placeholderPrefix: 'symbol'
      }),
      resolve(),
      typescript()
    ]
  }
]
