import type { Lang } from "./content";

const KEY = "todays-weather-lang";
const isLang = (v: unknown): v is Lang => v === "th" || v === "en";

/**
 * Pick the starting language, in priority order:
 * 1. ?lang=th|en in the link (so HR / LINE can send the right version)
 * 2. the visitor's last choice on this device
 * 3. the browser / LINE in-app language (Thai if it starts with "th", otherwise English)
 */
export function initialLang(): Lang {
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (isLang(q)) return q;
  } catch {
    /* ignore */
  }
  try {
    const saved = window.localStorage.getItem(KEY);
    if (isLang(saved)) return saved;
  } catch {
    /* storage can be blocked — fall through */
  }
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  return langs.some((l) => l?.toLowerCase().startsWith("th")) ? "th" : "en";
}

/** Remember the choice and keep the URL shareable in the chosen language. */
export function persistLang(lang: Lang) {
  try {
    window.localStorage.setItem(KEY, lang);
  } catch {
    /* ignore */
  }
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState(null, "", url);
  } catch {
    /* ignore */
  }
}
