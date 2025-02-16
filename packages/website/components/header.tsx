import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
	return (
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
	);
}
