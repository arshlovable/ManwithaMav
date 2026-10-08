"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddressField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);

  const visible = value.trim().length >= 3 ? suggestions : [];

  React.useEffect(() => {
    if (value.trim().length < 3) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: value }),
        signal: controller.signal,
      })
        .then((response) => (response.ok ? response.json() : { suggestions: [] }))
        .then((payload: { suggestions?: string[] }) => {
          setSuggestions(payload.suggestions ?? []);
          setOpen((payload.suggestions ?? []).length > 0);
        })
        .catch(() => {
          setSuggestions([]);
        });
    }, 300);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [value]);

  return (
    <div className="relative grid gap-2">
      <Label htmlFor={id} className="text-sm font-semibold text-inherit">
        {label}
        {required ? <span className="text-mav-yellow"> *</span> : null}
      </Label>
      <Input
        id={id}
        value={value}
        required={required}
        autoComplete="off"
        placeholder={placeholder}
        className="h-11 bg-white/5 text-inherit placeholder:text-current/40"
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => visible.length > 0 && setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
      />
      {open && visible.length > 0 ? (
        <ul className="absolute top-full z-20 mt-1 w-full overflow-hidden rounded-lg border border-white/15 bg-mav-ink shadow-lg">
          {visible.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10"
                onMouseDown={(event) => {
                  event.preventDefault();
                  onChange(suggestion);
                  setOpen(false);
                }}
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
