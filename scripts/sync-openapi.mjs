import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const frontendRoot = resolve(__dirname, '..')
const target = resolve(frontendRoot, 'openapi/openapi.json')

const candidates = [
  resolve(frontendRoot, '../docs/openapi/openapi.json'),
  resolve(process.env.OPENAPI_SCHEMA_PATH ?? ''),
].filter(Boolean)

const source = candidates.find((path) => existsSync(path))

if (!source) {
  console.error(
    'OpenAPI schema not found. Expected ../docs/openapi/openapi.json (submodule layout) or OPENAPI_SCHEMA_PATH.',
  )
  process.exit(1)
}

mkdirSync(dirname(target), { recursive: true })
copyFileSync(source, target)
console.log(`Synced OpenAPI schema from ${source}`)
