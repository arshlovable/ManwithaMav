"use client";

import * as React from "react";
import { ownerLogin } from "@/app/owner/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function OwnerLogin() {
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-mav-black px-6 text-white">
      <form
        className="grid w-full max-w-sm gap-4 rounded-2xl border border-white/10 p-6"
        onSubmit={async (event) => {
          event.preventDefault();
          setPending(true);
          setError(null);
          const result = await ownerLogin(new FormData(event.currentTarget));
          if (result?.error) {
            setError(result.error);
            setPending(false);
          }
        }}
      >
        <h1 className="font-heading text-3xl">Owner access</h1>
        <p className="text-sm text-white/65">
          This calculator is for Man with a Mav only. The access key is checked on the server.
        </p>
        <div className="grid gap-2">
          <Label htmlFor="owner-password">Access key</Label>
          <Input
            id="owner-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="h-11 bg-white/5"
          />
        </div>
        {error ? <p className="text-sm text-red-200">{error}</p> : null}
        <Button type="submit" disabled={pending} className="h-11 rounded-full bg-mav-yellow text-mav-black">
          {pending ? "Checking…" : "Continue"}
        </Button>
      </form>
    </main>
  );
}
