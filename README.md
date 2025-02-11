# Json-Schema-to-Valibot

[![NPM Version](https://img.shields.io/npm/v/json-schema-to-valibot.svg)](https://npmjs.org/package/json-schema-to-valibot)
[![NPM Downloads](https://img.shields.io/npm/dw/json-schema-to-valibot.svg)](https://npmjs.org/package/json-schema-to-valibot)

This is a Valibot version of [json-schema-to-zod](https://github.com/StefanTerdell/json-schema-to-zod), which converts JSON Schema to Valibot schemas instead of Zod schemas.

_Looking for the exact opposite? Check out the [official Valibot to JSON Schema support](https://valibot.dev/guides/json-schema/) in the Valibot documentation._

## Summary

A runtime package and CLI tool to convert JSON schema (draft 4+) objects or files into Valibot schemas in the form of JavaScript code.

Before v2 it used [`prettier`](https://www.npmjs.com/package/prettier) for formatting and [`json-refs`](https://www.npmjs.com/package/json-refs) to resolve schemas. To replicate the previous behaviour, please use their respective CLI tools.

Since v2 the CLI supports piped JSON.

## Usage

### Online

[Just paste your JSON schemas here!](https://stefanterdell.github.io/json-schema-to-valibot-react/)

### CLI

#### Simplest example

```console
npm i -g json-schema-to-valibot
```

```console
json-schema-to-valibot -i mySchema.json -o mySchema.ts
```

#### Example with `$refs` resolved and output formatted

```console
npm i -g json-schema-to-valibot json-refs prettier
```

```console
json-refs resolve mySchema.json | json-schema-to-valibot | prettier --parser typescript > mySchema.ts
```

#### Options

| Flag           | Shorthand | Function                                                                                       |
| -------------- | --------- | ---------------------------------------------------------------------------------------------- |
| `--input`      | `-i`      | JSON or a source file path. Required if no data is piped.                                      |
| `--output`     | `-o`      | A file path to write to. If not supplied stdout will be used.                                  |
| `--name`       | `-n`      | The name of the schema in the output                                                           |
| `--depth`      | `-d`      | Maximum depth of recursion in schema before falling back to `z.any()`. Defaults to 0.          |
| `--module`     | `-m`      | Module syntax; `esm`, `cjs` or none. Defaults to `esm` in the CLI and `none` programmaticly.   |
| `--type`       | `-t`      | Export a named type along with the schema. Requires `name` to be set and `module` to be `esm`. |
| `--noImport`   | `-ni`     | Removes the `import { z } from 'valibot';` or equivalent from the output.                      |
| `--withJsdocs` | `-wj`     | Generate jsdocs off of the description property.                                               |

### Programmatic

#### Simple example

```typescript
import { jsonSchemaToValibot } from "json-schema-to-valibot";

const myObject = {
  type: "object",
  properties: {
    hello: {
      type: "string",
    },
  },
};

const module = jsonSchemaToValibot(myObject, { module: "esm" });

// `type` can be either a string or - outside of the CLI - a boolean. If its `true`, the name of the type will be the name of the schema with a capitalized first letter.
const moduleWithType = jsonSchemaToValibot(myObject, {
  name: "mySchema",
  module: "esm",
  type: true,
});

const cjs = jsonSchemaToValibot(myObject, { module: "cjs", name: "mySchema" });

const justTheSchema = jsonSchemaToValibot(myObject);
```

##### `module`

```typescript
import * as v from "valibot";

export default v.object({ hello: v.optional(v.string()) });
```

##### `moduleWithType`

```typescript
import * as v from "valibot";

export const mySchema = v.object({ hello: v.optional(v.string()) });
export type MySchema = v.InferOutput<typeof mySchema>;
```

##### `cjs`

```typescript
const v = require("valibot");

module.exports = { mySchema: v.object({ hello: v.optional(v.string()) }) };
```

##### `justTheSchema`

```typescript
v.object({ hello: v.optional(v.string()) });
```

#### Example with `$refs` resolved and output formatted

```typescript
import { v } from "valibot";
import { resolveRefs } from "json-refs";
import { format } from "prettier";
import jsonSchemaToValibot from "json-schema-to-valibot";

async function example(jsonSchema: Record<string, unknown>): Promise<string> {
  const { resolved } = await resolveRefs(jsonSchema);
  const code = jsonSchemaToValibot(resolved);
  const formatted = await format(code, { parser: "typescript" });

  return formatted;
}
```

#### Overriding a parser

You can pass a function to the `overrideParser` option, which represents a function that receives the current schema node and the reference object, and should return a string when it wants to replace a default output. If the default output should be used for the node just return void.

#### Use at Runtime

The output of this package is not meant to be used at runtime. JSON Schema and valibot does not overlap 100% and the scope of the parsers are purposefully limited in order to help the author avoid a permanent state of chaotic insanity. As this may cause some details of the original schema to be lost in translation, it is instead recommended to use tools such as [Ajv](https://ajv.js.org/) to validate your runtime values directly against the original JSON Schema.

That said, it's possible in most cases to use `eval`. Here's an example that you shouldn't use:

```typescript
const valibotSchema = eval(
  jsonSchemaToValibot({ type: "string" }, { module: "cjs" })
);

valibotSchema.safeParse("Please just use Ajv instead");
```
