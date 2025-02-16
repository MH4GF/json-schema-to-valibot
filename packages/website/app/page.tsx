import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { SchemaConverter } from '@/components/schema-converter'

export default function Page() {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#070F2B] text-slate-50">
      <Header />
      <main className="flex-1 w-full py-8 px-8">
        <SchemaConverter />
      </main>
      <Footer />
    </div>
  )
}
