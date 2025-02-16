import prettierPluginEstree from 'prettier/plugins/estree'
import prettierPluginTypeScript from 'prettier/plugins/typescript'
import { format } from 'prettier/standalone'

export const prettierFormat = (code: string) => {
  return format(code, {
    parser: 'typescript',
    plugins: [prettierPluginTypeScript, prettierPluginEstree],
  })
}
