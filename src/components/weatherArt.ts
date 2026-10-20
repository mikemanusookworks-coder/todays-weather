// Original weather illustrations (no mascot). viewBox 0 0 320 240.
import type { Weather } from "../content";
const CLOUD = "M92 178h142c26 0 46-19 46-43 0-23-18-41-41-43-6-31-33-54-65-54-27 0-50 16-60 39-4-1-9-2-14-2-25 0-46 20-46 46 0 32 16 57 38 57z";
export const weatherArt: Record<Weather, string> = {
  clear: `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="sg" cx=".45" cy=".4" r=".6"><stop offset="0" stop-color="#FFE7A3"/><stop offset="1" stop-color="#FFC94D"/></radialGradient></defs>
    <circle cx="160" cy="120" r="92" fill="#FFF1C9" opacity=".7"/><circle cx="160" cy="120" r="62" fill="url(#sg)"/>
    <g stroke="#FFC94D" stroke-width="8" stroke-linecap="round" opacity=".9">${[0,45,90,135,180,225,270,315].map(a=>{const r=a*Math.PI/180;return `<line x1="${160+82*Math.cos(r)}" y1="${120+82*Math.sin(r)}" x2="${160+102*Math.cos(r)}" y2="${120+102*Math.sin(r)}"/>`}).join("")}</g></svg>`,
  partly: `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="ps" cx=".45" cy=".4" r=".6"><stop offset="0" stop-color="#FFE7A3"/><stop offset="1" stop-color="#FFC94D"/></radialGradient><linearGradient id="pc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E4EAF4"/></linearGradient></defs>
    <circle cx="118" cy="92" r="70" fill="#FFF1C9" opacity=".7"/><circle cx="118" cy="92" r="46" fill="url(#ps)"/>
    <path d="${CLOUD}" transform="translate(10 18)" fill="url(#pc)" stroke="#D5DEEC" stroke-width="3"/></svg>`,
  fog: `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="fc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E3E5EC"/></linearGradient></defs>
    <path d="${CLOUD}" transform="translate(0 -10)" fill="url(#fc)" stroke="#D9DCE5" stroke-width="3"/>
    <g stroke="#C4C9D6" stroke-width="12" stroke-linecap="round" opacity=".9"><line x1="46" y1="168" x2="210" y2="168"/><line x1="96" y1="196" x2="282" y2="196"/><line x1="60" y1="224" x2="186" y2="224"/></g></svg>`,
  drizzle: `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="dc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F7FC"/><stop offset="1" stop-color="#C9D6EE"/></linearGradient></defs>
    <path d="${CLOUD}" transform="translate(0 -24)" fill="url(#dc)" stroke="#BCCBE6" stroke-width="3"/>
    <g stroke="#6F93D8" stroke-width="7" stroke-linecap="round">${[[96,176],[150,186],[204,176],[123,214],[177,222],[231,212]].map(([x,y])=>`<line x1="${x}" y1="${y}" x2="${x-6}" y2="${y+16}"/>`).join("")}</g></svg>`,
  storm: `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="tc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AA5BA"/><stop offset="1" stop-color="#5E6A82"/></linearGradient></defs>
    <path d="${CLOUD}" transform="translate(0 -28)" fill="url(#tc)"/>
    <path d="M172 150l-26 42h26l-18 40 50-58h-28l18-24z" fill="#FFC94D"/>
    <g stroke="#7E8BA6" stroke-width="7" stroke-linecap="round">${[[92,172],[118,196],[230,170],[252,196]].map(([x,y])=>`<line x1="${x}" y1="${y}" x2="${x-8}" y2="${y+22}"/>`).join("")}</g></svg>`,
};

/** Gradient ids must be unique per instance: a duplicate id inside a hidden copy breaks url(#id) fills in Chrome. */
export function artSvg(w: Weather, suffix: string): string {
  return weatherArt[w].replace(/id="(\w+)"/g, `id="$1-${suffix}"`).replace(/url\(#(\w+)\)/g, `url(#$1-${suffix})`);
}
