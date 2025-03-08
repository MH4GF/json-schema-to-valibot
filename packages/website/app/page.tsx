import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import dynamic from 'next/dynamic'

const SchemaConverter = dynamic(() => import('@/components/schema-converter'), {
  ssr: false,
})

export default function Page() {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#070F2B] text-slate-50">
      <Header />
      <main className="flex-1 w-full py-4 px-4">
        <SchemaConverter />
      </main>
      <Footer />
    </div>
  )
}
