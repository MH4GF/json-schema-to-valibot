import { spawnSync } from 'node:child_process'
import { readFileSync, readdirSync } from 'node:fs'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('CLI', () => {
  it('should display help message', () => {
    const { stdout } = spawnSync('node', ['src/cli.ts', '--help'], {
      encoding: 'utf8',
    })

    expect(stdout).toMatchInlineSnapshot(`
      "Usage: json-schema-to-valibot [options]

      Convert JSON Schema to Valibot schema

      Options:
        -V, --version        output the version number
        -i, --input <path>   JSON or a source file path
        -o, --output <path>  A file path to write to
        -n, --name <name>    The name of the schema in the output
        -m, --module <type>  Module syntax: 'esm', 'cjs' or 'none' (default: "esm")
        -t, --type <name>    Export a named type along with the schema
        --no-import          Removes the import statement from the output
        -j, --with-jsdocs    Generate jsdocs off of the description property
        -h, --help           display help for command
      "
    `)
  })

  it('should run with input file only', () => {
    const { stderr } = spawnSync(
      'node',
      [
        '--no-warnings',
        'src/cli.ts',
        '-i',
        'src/test/JSON-Schema-Test-Suite/tests/latest/default.json',
      ],
      {
        encoding: 'utf8',
      },
    )

    expect(stderr).toBeFalsy()
  })

  it('should read from stdin', () => {
    const { stderr } = spawnSync('node', ['--no-warnings', 'src/cli.ts'], {
      input: '{"type": "string"}',
      encoding: 'utf8',
    })

    expect(stderr).toBeFalsy()
  })

  it('should write to output file', () => {
    const outputPath = 'src/test/output/default.js'
    mkdirSync(dirname(outputPath), { recursive: true })

    const { stderr } = spawnSync(
      'node',
      [
        '--no-warnings',
        'src/cli.ts',
        '-i',
        'src/test/JSON-Schema-Test-Suite/tests/latest/default.json',
        '--output',
        outputPath,
      ],
      {
        encoding: 'utf8',
      },
    )

    expect(stderr).toBeFalsy()

    const output = readFileSync(outputPath, 'utf8')
    expect(output).toMatchSnapshot()
  })

  it('should write to output file without import', () => {
    const outputPath = 'src/test/output/default-no-import.js'
    mkdirSync(dirname(outputPath), { recursive: true })

    const { stderr } = spawnSync(
      'node',
      [
        '--no-warnings',
        'src/cli.ts',
        '-i',
        'src/test/JSON-Schema-Test-Suite/tests/latest/default.json',
        '--output',
        outputPath,
        '--no-import',
      ],
      {
        encoding: 'utf8',
      },
    )

    expect(stderr).toBeFalsy()

    const output = readFileSync(outputPath, 'utf8')
    expect(output).toMatchSnapshot()
  })

  it('should write to output file with JSDoc comments', () => {
    const outputPath = 'src/test/output/default-with-jsdoc.js'
    mkdirSync(dirname(outputPath), { recursive: true })

    const { stderr } = spawnSync(
      'node',
      [
        '--no-warnings',
        'src/cli.ts',
        '-i',
        'src/test/JSON-Schema-Test-Suite/tests/latest/default.json',
        '--output',
        outputPath,
        '--with-jsdocs',
      ],
      {
        encoding: 'utf8',
      },
    )

    expect(stderr).toBeFalsy()

    const output = readFileSync(outputPath, 'utf8')
    expect(output).toMatchSnapshot()
  })

  it('should error when no input is provided', () => {
    const { stderr } = spawnSync('node', ['--no-warnings', 'src/cli.ts'], {
      encoding: 'utf8',
    })

    expect(stderr).toMatchInlineSnapshot(`
      "Input is required when no JSON or file path is piped
      "
    `)
  })

  // biome-ignore lint/suspicious/noSkippedTests: <explanation>
  it.skip('should error on invalid module syntax', () => {
    const { stderr } = spawnSync(
      'node',
      [
        '--no-warnings',
        'src/cli.ts',
        '-i',
        'src/test/JSON-Schema-Test-Suite/tests/latest/default.json',
        '-m',
        'invalid',
      ],
      {
        encoding: 'utf8',
      },
    )

    expect(stderr).toMatchInlineSnapshot(`
      "Invalid module syntax: invalid
      "
    `)
  })

  describe('JSON Schema Test Suite', () => {
    const testDir = 'src/test/JSON-Schema-Test-Suite/tests/latest'
    const testFiles = readdirSync(testDir).filter((file) => file.endsWith('.json'))

    for (const testFile of testFiles) {
      it(testFile, () => {
        const outputPath = `src/test/output/${testFile}.ts`
        mkdirSync(dirname(outputPath), { recursive: true })

        const { stderr } = spawnSync(
          'node',
          ['--no-warnings', 'src/cli.ts', '-i', join(testDir, testFile), '--output', outputPath],
          {
            encoding: 'utf8',
          },
        )

        expect(stderr).toBeFalsy()
        const output = readFileSync(outputPath, 'utf8')
        expect(output).toMatchSnapshot()
      })
    }
  })
})
