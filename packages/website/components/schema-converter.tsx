'use client'

import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import CodeMirror from '@uiw/react-codemirror'
import { Copy } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { type Options, jsonSchemaToValibot } from 'json-schema-to-valibot'

export function SchemaConverter() {
  const [schemaName, setSchemaName] = useState('')
  const [module, setModule] = useState<Options['module']>('esm')
  const [recursionDepth, setRecursionDepth] = useState('0')
  const [jsonSchema, setJsonSchema] = useState(`{
  "type": "object",
  "properties": {
    "name": { "type": "string" }
  }
}`)
  const [result, setResult] = useState('')

  const { toast } = useToast()

  const convertSchema = useCallback(() => {
    try {
      const schema = JSON.parse(jsonSchema)

      const options = {
        module,
        name: schemaName || undefined,
        recursionDepth: Number.parseInt(recursionDepth, 10),
      }

      const converted = jsonSchemaToValibot(schema, options)
      setResult(converted)
    } catch (error) {
      toast({
        title: 'Conversion Error',
        description: error instanceof Error ? error.message : 'Failed to convert schema',
        variant: 'destructive',
      })
    }
  }, [jsonSchema, module, schemaName, recursionDepth, toast])

  useEffect(() => {
    convertSchema()
  }, [convertSchema])

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    toast({
      title: 'Copied to clipboard',
      description: 'The Valibot schema has been copied to your clipboard.',
    })
  }

  return (
    <div className="px-8 h-full w-full py-6">
      <div className="grid grid-cols-[250px_minmax(0,1fr)_minmax(0,1fr)] gap-8 h-full w-full">
        {/* Settings Panel */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="schema-name" className="text-[#9290C3]">
              Schema name
            </Label>
            <Input
              id="schema-name"
              placeholder="schema"
              value={schemaName}
              onChange={(e) => setSchemaName(e.target.value)}
              className="bg-[#1B1A55] border-[#535C91] text-slate-50 focus:ring-[#1B1A55] focus:ring-offset-2 focus:ring-offset-[#070F2B] focus:border-[#535C91] placeholder-[#535C91]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="module" className="text-[#9290C3]">
              Module
            </Label>
            <Select value={module} onValueChange={(value) => setModule(value as Options['module'])}>
              <SelectTrigger
                id="module"
                className="bg-[#1B1A55] border-[#535C91] text-slate-50 focus:ring-[#1B1A55] focus:ring-offset-2 focus:ring-offset-[#070F2B] focus:border-[#535C91]"
              >
                <SelectValue placeholder="Select module type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1B1A55] border-[#535C91]">
                <SelectItem
                  value="esm"
                  className="text-slate-50 focus:bg-[#535C91] hover:bg-[#535C91]"
                >
                  ESM
                </SelectItem>
                <SelectItem
                  value="commonjs"
                  className="text-slate-50 focus:bg-[#535C91] hover:bg-[#535C91]"
                >
                  CommonJS
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="recursion" className="text-[#9290C3]">
              Recursion depth
            </Label>
            <Input
              id="recursion"
              type="number"
              min="0"
              value={recursionDepth}
              onChange={(e) => setRecursionDepth(e.target.value)}
              className="bg-[#1B1A55] border-[#535C91] text-slate-50 focus:ring-[#1B1A55] focus:ring-offset-2 focus:ring-offset-[#070F2B] focus:border-[#535C91]"
            />
          </div>
        </div>

        {/* JSON Schema Panel */}
        <div className="space-y-2 h-full flex flex-col">
          <Label htmlFor="json-schema" className="text-[#9290C3]">
            JSON Schema
          </Label>
          <div className="relative flex-grow">
            <CodeMirror
              value={jsonSchema}
              height="70vh"
              theme={vscodeDark}
              extensions={[json()]}
              onChange={(value) => setJsonSchema(value)}
              className="border border-[#535C91] rounded-md overflow-hidden h-full"
            />
          </div>
        </div>

        {/* Valibot Schema Panel */}
        <div className="space-y-2 h-full flex flex-col">
          <Label className="text-[#9290C3]">Valibot Schema</Label>
          <div className="relative flex-grow">
            <CodeMirror
              value={result}
              height="70vh"
              theme={vscodeDark}
              extensions={[javascript()]}
              editable={false}
              className="border border-[#535C91] rounded-md overflow-hidden h-full"
            />
            <Button
              onClick={handleCopy}
              size="sm"
              className="absolute bottom-4 right-4 bg-[#535C91] hover:bg-[#9290C3] text-white gap-2 transition-colors"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
