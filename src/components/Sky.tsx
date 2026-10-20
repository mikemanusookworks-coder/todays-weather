import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Weather } from "../content";
import { weatherArt } from "./weatherArt";

/** The stage illustration: one original weather drawing, with light motion overlays for fog and rain. */
export function SkyArt({ art, weather, size = 240 }: { art: Weather; weather?: Weather | null; size?: number }) {
  return (
    <div className="art" style={{ "--art-w": `${size}px` } as CSSProperties} data-weather={weather ?? undefined}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={art}
          className="art-img"
          initial={{ opacity: 0, scale: 0.94, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
          dangerouslySetInnerHTML={{ __html: weatherArt[art] }}
        />
      </AnimatePresence>
      {weather === "fog" && (
        <div className="fx fog" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      )}
      {(weather === "drizzle" || weather === "storm") && (
        <div className={`fx rain ${weather === "storm" ? "heavy" : ""}`} aria-hidden>
          {Array.from({ length: weather === "storm" ? 18 : 9 }).map((_, i) => (
            <i key={i} style={{ left: `${(i * 97) % 100}%`, animationDelay: `${(i * 0.37) % 1.4}s` }} />
          ))}
        </div>
      )}
      {weather === "storm" && <div className="fx flash" aria-hidden />}
    </div>
  );
}

const cloud = "M7.2 18.5h9.6a3.6 3.6 0 0 0 .5-7.17 5.2 5.2 0 0 0-10-.6A3.9 3.9 0 0 0 7.2 18.5z";

export function WeatherIcon({ id }: { id: Weather }) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {id === "clear" && (
        <>
          <circle cx="12" cy="12" r="4.2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="12" y1="3" x2="12" y2="4.8" transform={`rotate(${a} 12 12)`} />
          ))}
        </>
      )}
      {id === "partly" && (
        <>
          <circle cx="9" cy="8" r="3" />
          <path d="M9 2.6v.9M3.6 8h.9M5.2 4.2l.6.6M12.8 4.2l-.6.6" />
          <path d={cloud} transform="translate(2 1)" fill="var(--white)" />
        </>
      )}
      {id === "fog" && (
        <>
          <path d={cloud} transform="translate(0 -4)" />
          <path d="M4 17.5h11M7 20.5h13" />
        </>
      )}
      {id === "drizzle" && (
        <>
          <path d={cloud} transform="translate(0 -3)" />
          <path d="M8 18.5l-.8 2M12 18.5l-.8 2M16 18.5l-.8 2" />
        </>
      )}
      {id === "storm" && (
        <>
          <path d={cloud} transform="translate(0 -3)" />
          <path d="M12.5 15.5l-2 3.2h3l-2 3.3" />
        </>
      )}
    </svg>
  );
}
