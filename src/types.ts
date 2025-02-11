export type Options = {
  module?: 'esm' | 'cjs' | 'none'
  name?: string
  type?: boolean | string
  noImport?: boolean
  withJsdocs?: boolean
  withoutDefaults?: boolean
  withoutDescriptions?: boolean
}
