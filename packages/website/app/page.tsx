import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SchemaConverter } from "@/components/schema-converter";

export default function Page() {
	return (
		<div className="min-h-screen bg-[#070F2B] text-slate-50">
			<Header />
			<div className="container mx-auto py-8 px-8">
				<SchemaConverter />
			</div>
			<Footer />
		</div>
	);
}
