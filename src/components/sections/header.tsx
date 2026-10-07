import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { QuoteButton } from "@/components/quote-dialog";
import { navLinks } from "@/config/site";

export function Header() {
  return (
    <header
      id="top"
      className="sticky top-0 z-40 border-b border-white/10 bg-mav-black/90 backdrop-blur supports-[backdrop-filter]:bg-mav-black/80"
    >
      <div className="container-mav flex h-20 items-center justify-between gap-4 sm:h-[5.5rem] md:h-24">
        <Logo />
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base font-medium text-white/80 transition-colors hover:text-mav-yellow"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <QuoteButton
            size="default"
            className="hidden h-11 rounded-full bg-mav-yellow px-6 text-sm font-semibold text-mav-black hover:bg-mav-yellow-dark md:inline-flex"
          >
            Get a Quote
          </QuoteButton>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
