export type Options = {
  module?: 'esm' | 'cjs' | 'none'
  name?: string | undefined
  type?: boolean | string | undefined
  noImport?: boolean | undefined
  withJsdocs?: boolean | undefined
  withoutDefaults?: boolean | undefined
  withoutDescriptions?: boolean | undefined
  depth?: number | undefined
}
