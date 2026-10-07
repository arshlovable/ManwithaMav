"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { useQuote } from "@/components/quote-dialog";
import { navLinks, siteConfig } from "@/config/site";
import { WhatsAppIcon } from "@/components/icons";
import { buildSmsUrl, buildWhatsAppUrl } from "@/lib/contact";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { open: openQuote } = useQuote();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          className="text-white hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] border-white/10 bg-mav-ink p-6 text-white sm:max-w-sm">
        <SheetHeader className="p-0 text-left">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">Site navigation and quick contact</SheetDescription>
          <Logo compact />
        </SheetHeader>
        <nav aria-label="Mobile" className="mt-6 flex flex-col">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/10 py-4 font-heading text-2xl tracking-wide text-white transition-colors hover:text-mav-yellow"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-3">
          <Button
            type="button"
            size="lg"
            className="h-12 rounded-full bg-mav-yellow text-base font-semibold text-mav-black hover:bg-mav-yellow-dark"
            onClick={() => {
              setOpen(false);
              openQuote();
            }}
          >
            Get a Quote
          </Button>
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 text-base font-semibold text-white hover:bg-white/10"
          >
            <WhatsAppIcon className="size-5" /> WhatsApp a Photo
          </a>
          <a
            href={buildSmsUrl()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 text-base font-semibold text-white hover:bg-white/10"
          >
            Text {siteConfig.phoneDisplay}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
