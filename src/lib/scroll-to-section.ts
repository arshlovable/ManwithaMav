/** Smooth-scroll to an in-page section, clearing the sticky header. */
export function scrollToSection(hash: string) {
  if (typeof window === "undefined") return;
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!id) return;

  const el = document.getElementById(id);
  if (!el) return;

  const header = document.querySelector("header");
  const offset = (header?.getBoundingClientRect().height ?? 96) + 8;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  window.history.replaceState(null, "", `#${id}`);
}
