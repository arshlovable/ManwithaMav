"use client";

import * as React from "react";
import { MessageCircleMore, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";
import { pricingTiers, type TierId } from "@/content/pricing";
import { buildQuoteMessage, buildSmsUrl, buildWhatsAppUrl } from "@/lib/contact";

type QuoteContextValue = {
  open: (tier?: TierId) => void;
};

const QuoteContext = React.createContext<QuoteContextValue | null>(null);

export function useQuote(): QuoteContextValue {
  const ctx = React.useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used inside QuoteProvider");
  return ctx;
}

const accessOptions = [
  "Driveway / garage / curb",
  "Ground floor, no or minimal stairs",
  "Elevator building",
  "More than minimal stairs",
] as const;

const areaOptions = [...siteConfig.serviceAreas, "Other (GTA)"] as const;

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tier, setTier] = React.useState<TierId | "unsure">("unsure");
  const [pickup, setPickup] = React.useState<string>("");
  const [dropoff, setDropoff] = React.useState<string>("");
  const [access, setAccess] = React.useState<string>("");
  const [item, setItem] = React.useState("");
  const [when, setWhen] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const open = React.useCallback((preselect?: TierId) => {
    setTier(preselect ?? "unsure");
    setError(null);
    setIsOpen(true);
  }, []);

  const value = React.useMemo(() => ({ open }), [open]);

  function compose(): string | null {
    if (item.trim().length < 3) {
      setError("Tell us what the item is (or paste the listing link).");
      return null;
    }
    if (!pickup || !dropoff) {
      setError("Pick a pickup and drop-off area so we can confirm distance.");
      return null;
    }
    setError(null);
    const tierName =
      tier === "unsure" ? "Not sure yet" : pricingTiers.find((t) => t.id === tier)?.name;
    return buildQuoteMessage({
      tier: tierName,
      item: item.trim(),
      pickup,
      dropoff,
      access: access || undefined,
      when: when.trim() || undefined,
    });
  }

  function send(channel: "whatsapp" | "sms") {
    const message = compose();
    if (!message) return;
    const url = channel === "whatsapp" ? buildWhatsAppUrl(message) : buildSmsUrl(message);
    window.open(url, channel === "whatsapp" ? "_blank" : "_self", "noopener,noreferrer");
    setIsOpen(false);
  }

  return (
    <QuoteContext.Provider value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto border border-white/10 bg-mav-ink p-5 sm:max-w-lg sm:p-6">
          <DialogHeader>
            <p className="text-xs font-semibold tracking-[0.2em] text-mav-yellow uppercase">
              Get a quote
            </p>
            <DialogTitle className="font-heading text-3xl leading-none text-white">
              Tell us what needs moving
            </DialogTitle>
            <DialogDescription className="text-sm text-white/70">
              Fill in the basics and we&apos;ll open WhatsApp or your messaging app with
              everything pre-filled. Attach a photo there and we&apos;ll confirm fit, availability
              and price.
            </DialogDescription>
          </DialogHeader>

          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              send("whatsapp");
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="quote-tier" className="text-white/90">
                Service
              </Label>
              <Select value={tier} onValueChange={(v) => setTier(v as TierId | "unsure")}>
                <SelectTrigger id="quote-tier" className="h-10 w-full bg-white/5 text-white">
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {pricingTiers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} · ${t.price}
                    </SelectItem>
                  ))}
                  <SelectItem value="unsure">Not sure yet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quote-item" className="text-white/90">
                What&apos;s the item? <span className="text-mav-yellow">*</span>
              </Label>
              <Textarea
                id="quote-item"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="e.g. 3-seat sofa from Marketplace, about 84 inches wide. Link: ..."
                className="min-h-20 bg-white/5 text-white placeholder:text-white/40"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="quote-pickup" className="text-white/90">
                  Pickup area <span className="text-mav-yellow">*</span>
                </Label>
                <Select value={pickup} onValueChange={setPickup}>
                  <SelectTrigger id="quote-pickup" className="h-10 w-full bg-white/5 text-white">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {areaOptions.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quote-dropoff" className="text-white/90">
                  Drop-off area <span className="text-mav-yellow">*</span>
                </Label>
                <Select value={dropoff} onValueChange={setDropoff}>
                  <SelectTrigger id="quote-dropoff" className="h-10 w-full bg-white/5 text-white">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {areaOptions.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="quote-access" className="text-white/90">
                  Access
                </Label>
                <Select value={access} onValueChange={setAccess}>
                  <SelectTrigger id="quote-access" className="h-10 w-full bg-white/5 text-white">
                    <SelectValue placeholder="Access: stairs or elevator?" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {accessOptions.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quote-when" className="text-white/90">
                  Preferred date / time
                </Label>
                <Input
                  id="quote-when"
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  placeholder="e.g. Saturday afternoon"
                  className="h-10 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            {error ? (
              <p role="alert" className="rounded-md bg-mav-red/15 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            ) : null}

            <div className="mt-1 grid gap-2 sm:grid-cols-2">
              <Button
                type="submit"
                size="lg"
                className="h-12 bg-mav-yellow text-base font-semibold text-mav-black hover:bg-mav-yellow-dark"
              >
                <MessageCircleMore className="size-5" />
                Send via WhatsApp
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => send("sms")}
                className="h-12 border-white/30 bg-transparent text-base font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                <MessageSquareText className="size-5" />
                Send via Text
              </Button>
            </div>
            <p className="text-center text-xs text-white/50">
              No account, no forms to submit. The message opens in your own app.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </QuoteContext.Provider>
  );
}

export function QuoteButton({
  tier,
  children,
  className,
  variant = "default",
  size = "lg",
}: {
  tier?: TierId;
  children: React.ReactNode;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
}) {
  const { open } = useQuote();
  return (
    <Button type="button" variant={variant} size={size} className={className} onClick={() => open(tier)}>
      {children}
    </Button>
  );
}
