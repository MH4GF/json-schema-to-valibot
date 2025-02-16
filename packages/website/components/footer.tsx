export function Footer() {
  return (
    <div className="border-t border-[#1B1A55] mt-8">
      <div className="container mx-auto py-4 px-8">
        <p className="text-center text-[#9290C3] text-sm">
          Built with Valibot. Check out the{' '}
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
  )
}
