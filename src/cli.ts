#!/usr/bin/env node

import { mkdirSync, writeFileSync } from 'node:fs'
import { readFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { Command } from 'commander'
import type { JSONSchema4 } from 'json-schema'
import { jsonSchemaToValibot } from './jsonSchemaToValibot.ts'

const program = new Command()

async function readPipe(): Promise<string> {
  if (process.stdin.isTTY) {
    return ''
  }

  let result = ''
  for await (const chunk of process.stdin) {
    result += chunk
  }
  return result
}

function parseOrReadJSON(input: string) {
  try {
    return JSON.parse(input)
  } catch {
    return JSON.parse(readFileSync(input, 'utf-8'))
  }
}

async function main() {
  program
    .name('json-schema-to-valibot')
    .description('Convert JSON Schema to Valibot schema')
    .version('0.1.0')
    .option('-i, --input <path>', 'JSON or a source file path')
    .option('-o, --output <path>', 'A file path to write to')
    .option('-n, --name <name>', 'The name of the schema in the output')
    .option('-m, --module <type>', "Module syntax: 'esm', 'cjs' or 'none'", 'esm')
    .option('-t, --type <name>', 'Export a named type along with the schema')
    .option('--no-import', 'Removes the import statement from the output')
    .option('-j, --with-jsdocs', 'Generate jsdocs off of the description property')
    .parse()

  const options = program.opts()

  const input = options['input'] || (await readPipe())
  if (!input) {
    program.error('Input is required when no JSON or file path is piped')
  }

  const jsonSchema = parseOrReadJSON(input)

  const valibotSchema = jsonSchemaToValibot(jsonSchema as JSONSchema4, {
    name: options['name'],
    module: options['module'],
    noImport: !options['import'],
    type: options['type'],
    withJsdocs: options['withJsdocs'],
  })

  if (options['output']) {
    mkdirSync(dirname(options['output']), { recursive: true })
    writeFileSync(options['output'], valibotSchema)
  }
}

main().catch((error) => {
  // biome-ignore lint/suspicious/noConsole: CLI needs to output errors to console
  console.error(error)
  process.exit(1)
})
