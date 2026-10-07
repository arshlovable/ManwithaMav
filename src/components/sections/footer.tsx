import { Logo } from "@/components/logo";
import { siteConfig } from "@/config/site";
import { buildSmsUrl } from "@/lib/contact";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-mav-black pb-24 md:pb-0">
      <div className="container-mav flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <Logo />
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-white/80">
          {siteConfig.serviceAreas.map((area, i) => (
            <span key={area} className="flex items-center gap-3">
              {i > 0 ? <span aria-hidden="true" className="size-1 rounded-full bg-mav-yellow" /> : null}
              {area}
            </span>
          ))}
        </p>
        <nav aria-label="Footer" className="flex items-center gap-5 text-sm text-white/60">
          <a href="#privacy" className="hover:text-white">
            Privacy
          </a>
          <a href="#terms" className="hover:text-white">
            Terms
          </a>
          <a href={buildSmsUrl()} className="hover:text-white">
            Contact
          </a>
        </nav>
      </div>
      <div className="container-mav border-t border-white/10 py-5 text-xs text-white/50">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <p>
            © {year} {siteConfig.name}. Small-load and furniture delivery in{" "}
            {siteConfig.serviceAreas.join(", ")}.
          </p>
          <div className="max-w-xl space-y-2 md:text-right">
            <p id="privacy">
              <span className="font-semibold text-white/70">Privacy:</span> we only use the photos
              and addresses you send to quote and complete your delivery. They are never sold or
              shared.
            </p>
            <p id="terms">
              <span className="font-semibold text-white/70">Terms:</span> quotes are confirmed in
              writing before pickup. Final acceptance depends on item size, weight, access and safe
              loading.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
