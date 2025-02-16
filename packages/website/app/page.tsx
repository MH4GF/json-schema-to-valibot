"use client";

import * as React from "react";
import { Copy, Github } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function SchemaConverter() {
	const [schemaName, setSchemaName] = React.useState("");
	const [module, setModule] = React.useState("esm");
	const [recursionDepth, setRecursionDepth] = React.useState("0");
	const [jsonSchema, setJsonSchema] = React.useState(`{
  "type": "array",
  "items": { "type": "string" },
  "anyOf": [{ "minItems": 1 }, { "maxItems": 3 }]
}`);
	const [result, setResult] = React.useState(`import { z } from "zod";

export default z.array(z.string());`);

	const { toast } = useToast();

	const handleFormat = () => {
		try {
			const formatted = JSON.stringify(JSON.parse(jsonSchema), null, 2);
			setJsonSchema(formatted);
			toast({
				title: "Schema formatted successfully",
				description: "Your JSON Schema has been properly formatted.",
			});
		} catch (error) {
			toast({
				title: "Invalid JSON",
				description: "Please check your JSON Schema syntax.",
				variant: "destructive",
			});
		}
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(result);
		toast({
			title: "Copied to clipboard",
			description: "The Valibot schema has been copied to your clipboard.",
		});
	};

	return (
		<div className="min-h-screen bg-[#070F2B] text-slate-50">
			{/* Header */}
			<div className="border-b border-[#1B1A55]">
				<div className="container mx-auto py-4 px-8">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold bg-gradient-to-r from-[#535C91] to-[#9290C3] bg-clip-text text-transparent">
							JSON Schema to Valibot
						</h1>
						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="sm"
								className="text-[#9290C3] hover:text-[#9290C3] hover:bg-[#1B1A55]"
								asChild
							>
								<a
									href="https://www.npmjs.com/package/json-schema-to-valibot"
									target="_blank"
									rel="noopener noreferrer"
								>
									NPM Package
								</a>
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="text-[#9290C3] hover:text-[#9290C3] hover:bg-[#1B1A55]"
								asChild
							>
								<a
									href="https://github.com/fabian-hiller/valibot/issues"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Github className="w-4 h-4 mr-2" />
									GitHub
								</a>
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto py-8 px-8">
				<div className="grid md:grid-cols-2 gap-8">
					{/* Input Panel */}
					<div className="space-y-6">
						<div className="grid grid-cols-3 gap-4">
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
								<Select value={module} onValueChange={setModule}>
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

						<div className="space-y-2">
							<Label htmlFor="json-schema" className="text-[#9290C3]">
								JSON Schema
							</Label>
							<div className="relative">
								<CodeMirror
									value={jsonSchema}
									height="400px"
									theme={vscodeDark}
									extensions={[json()]}
									onChange={(value) => setJsonSchema(value)}
									className="border border-[#535C91] rounded-md overflow-hidden"
								/>
								<Button
									onClick={handleFormat}
									size="sm"
									className="absolute bottom-4 right-4 bg-[#535C91] hover:bg-[#9290C3] text-white transition-colors"
								>
									Format
								</Button>
							</div>
						</div>
					</div>

					{/* Output Panel */}
					<div className="space-y-2">
						<Label className="text-[#9290C3]">Valibot Schema</Label>
						<div className="relative">
							<CodeMirror
								value={result}
								height="485px"
								theme={vscodeDark}
								extensions={[javascript()]}
								editable={false}
								className="border border-[#535C91] rounded-md overflow-hidden"
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

			{/* Footer */}
			<div className="border-t border-[#1B1A55] mt-8">
				<div className="container mx-auto py-4 px-8">
					<p className="text-center text-[#9290C3] text-sm">
						Built with Valibot. Check out the{" "}
						<a
							href="https://valibot.dev"
							target="_blank"
							rel="noopener noreferrer"
							className="text-[#535C91] hover:text-[#9290C3] transition-colors"
						>
							official documentation
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
