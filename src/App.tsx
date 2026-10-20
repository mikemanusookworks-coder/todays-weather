import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { toPng } from "html-to-image";
import {
  aloneLine,
  buildForecast,
  clouds,
  durations,
  getTier,
  hotlines,
  reflections,
  ui,
  weathers,
  whoKnowsOptions,
  type Cloud,
  type Duration,
  type Lang,
  type Tier,
  type Weather,
  type WhoKnows,
} from "./content";
import { SkyArt, WeatherIcon } from "./components/Sky";
import { artSvg } from "./components/weatherArt";
import { Logo } from "./components/Logo";
import { initialLang, persistLang } from "./lang";

type Step =
  | "welcome"
  | "weather"
  | "duration"
  | "clouds"
  | "safety"
  | "reflection"
  | "card"
  | "next"
  | "handoff"
  | "close";

const progressSteps: Step[] = ["weather", "duration", "clouds", "reflection", "card", "next"];
type Exit = "keep" | "send" | "counsellor";
const suggestedExit: Record<Tier, Exit> = {
  clear: "keep",
  passing: "keep",
  lingering: "send",
  persistent: "counsellor",
};

export default function App() {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [step, setStep] = useState<Step>("welcome");
  const [history, setHistory] = useState<Step[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [duration, setDuration] = useState<Duration | null>(null);
  const [picked, setPicked] = useState<Cloud[]>([]);
  const [who, setWho] = useState<WhoKnows | null>(null);
  const [forecast, setForecast] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const t = (x: Record<Lang, string>) => x[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "th" ? "อากาศในใจวันนี้" : "Today's Weather · a 2-minute check-in";
  }, [lang]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const tier: Tier | null = weather && duration ? getTier(weather, duration) : null;

  // Regenerate the forecast text when answers or language change.
  useEffect(() => {
    if (weather && duration && who) setForecast(buildForecast(lang, weather, duration, picked, who));
  }, [lang, weather, duration, picked, who]);

  const go = (next: Step) => {
    setHistory((h) => [...h, step]);
    setStep(next);
    window.scrollTo({ top: 0 });
  };
  const back = () => {
    setHistory((h) => {
      const prev = h[h.length - 1];
      if (prev) setStep(prev);
      return h.slice(0, -1);
    });
  };
  const restart = () => {
    setWeather(null);
    setDuration(null);
    setPicked([]);
    setWho(null);
    setHistory([]);
    setStep("welcome");
  };

  // Single-choice answers advance on their own after a beat, so the sky's change registers.
  const advanceAfter = (next: Step) => setTimeout(() => go(next), reduce ? 120 : 520);

  const toggleCloud = (c: Cloud) =>
    setPicked((p) => {
      if (p.includes(c)) return p.filter((x) => x !== c);
      if (c === "unsure") return ["unsure"];
      const rest = p.filter((x) => x !== "unsure");
      return rest.length >= 3 ? rest : [...rest, c];
    });

  const afterClouds = () => go(weather === "storm" ? "safety" : "reflection");

  const saveCard = async () => {
    if (!cardRef.current) return;
    try {
      const url = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: "#ffffff" });
      const a = document.createElement("a");
      a.href = url;
      a.download = "todays-weather.png";
      a.click();
      setToast(t(ui.saved));
    } catch {
      setToast("—");
    }
  };

  const sendCard = async () => {
    const text = forecast;
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        /* cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setToast(t(ui.copied));
    } catch {
      setToast(text);
    }
  };

  const art: Weather = useMemo(() => {
    if (step === "welcome" || step === "next" || step === "handoff") return "partly";
    if (step === "close") return "clear";
    return weather ?? "partly";
  }, [step, weather]);

  const copyFirstMessage = async () => {
    try {
      await navigator.clipboard.writeText(forecast);
      setToast(t(ui.handoffCopied));
    } catch {
      setToast(forecast);
    }
  };

  const showWeatherFx = ["weather", "duration", "clouds", "safety"].includes(step);
  const stageSize = step === "welcome" || step === "weather" ? "lg" : step === "card" || step === "safety" ? "none" : "sm";
  const progressIndex = progressSteps.indexOf(step);
  const sky = step === "welcome" || step === "close" || step === "next" || step === "handoff" ? "calm" : (weather ?? "calm");

  return (
    <div className="app" data-sky={sky}>
      <header className="topbar">
        <Logo onDark={sky === "storm"} lang={lang} />
        <div className="topbar-actions">
          <button className="link-btn help-link" onClick={() => setHelpOpen(true)}>
            {t(ui.help)}
          </button>
          <button
            className="lang-btn"
            onClick={() => {
              const next = lang === "th" ? "en" : "th";
              setLang(next);
              persistLang(next);
            }}
            aria-label={lang === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
          >
            {lang === "th" ? "EN" : "TH"}
          </button>
        </div>
      </header>

      {progressIndex >= 0 && (
        <div className="progress progress-mobile" aria-hidden>
          {progressSteps.map((s, i) => (
            <span key={s} className={i <= progressIndex ? "on" : ""} />
          ))}
        </div>
      )}

      <div className="layout">
      <div className={`stage stage-${stageSize}`}>
        <SkyArt art={art} weather={showWeatherFx ? weather : null} size={stageSize === "lg" ? 280 : 190} />
      </div>

      <main className={`sheet ${stageSize === "none" ? "sheet-full" : ""}`}>
        {progressIndex >= 0 && (
          <div
            className="progress progress-desktop"
            role="progressbar"
            aria-label={lang === "th" ? "ความคืบหน้า" : "Progress"}
            aria-valuemin={1}
            aria-valuemax={progressSteps.length}
            aria-valuenow={progressIndex + 1}
          >
            {progressSteps.map((s, i) => (
              <span key={s} className={i <= progressIndex ? "on" : ""} />
            ))}
          </div>
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={step + lang}
            className="screen"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
            transition={{ duration: 0.22 }}
          >
            {step !== "welcome" && step !== "close" && history.length > 0 && (
              <button className="back" onClick={back}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M15 5l-7 7 7 7" />
                </svg>
                {t(ui.back)}
              </button>
            )}

            {step === "welcome" && (
              <>
                <h1 className="h-display">{t(ui.welcomeTitle)}</h1>
                <p className="body">{t(ui.welcomeBody)}</p>
                <button className="btn-primary" onClick={() => go("weather")}>
                  {t(ui.welcomeCta)}
                </button>
                <p className="fine">{t(ui.welcomePrivacy)}</p>
              </>
            )}

            {step === "weather" && (
              <>
                <h2 className="h-title">{t(ui.qWeather)}</h2>
                <div className="options" role="radiogroup">
                  {weathers.map((w) => (
                    <button
                      key={w.id}
                      role="radio"
                      aria-checked={weather === w.id}
                      className={`option ${weather === w.id ? "selected" : ""}`}
                      onClick={() => {
                        setWeather(w.id);
                        advanceAfter("duration");
                      }}
                    >
                      <span className={`wicon w-${w.id}`}>
                        <WeatherIcon id={w.id} />
                      </span>
                      <span className="option-text">
                        <span className="option-label">{t(w.label)}</span>
                        <span className="option-hint">{t(w.hint)}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === "duration" && (
              <>
                <h2 className="h-title">{t(ui.qDuration)}</h2>
                <div className="options" role="radiogroup">
                  {durations.map((d) => (
                    <button
                      key={d.id}
                      role="radio"
                      aria-checked={duration === d.id}
                      className={`option option-compact ${duration === d.id ? "selected" : ""}`}
                      onClick={() => {
                        setDuration(d.id);
                        advanceAfter("clouds");
                      }}
                    >
                      <span className="option-label">{t(d.label)}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === "clouds" && (
              <>
                <h2 className="h-title">{t(ui.qClouds)}</h2>
                <p className="caption">{t(ui.qCloudsHint)}</p>
                <div className="chips">
                  {clouds.map((c) => (
                    <button
                      key={c.id}
                      aria-pressed={picked.includes(c.id)}
                      className={`chip ${picked.includes(c.id) ? "selected" : ""}`}
                      onClick={() => toggleCloud(c.id)}
                    >
                      {t(c.label)}
                    </button>
                  ))}
                </div>
                <h3 className="h-sub">{t(ui.qWho)}</h3>
                <div className="segmented" role="radiogroup">
                  {whoKnowsOptions.map((o) => (
                    <button
                      key={o.id}
                      role="radio"
                      aria-checked={who === o.id}
                      className={`seg ${who === o.id ? "selected" : ""}`}
                      onClick={() => setWho(o.id)}
                    >
                      {t(o.label)}
                    </button>
                  ))}
                </div>
                <button className="btn-primary" disabled={!picked.length || !who} onClick={afterClouds}>
                  {t(ui.continue)}
                </button>
              </>
            )}

            {step === "safety" && (
              <>
                <div className="safety-mark" aria-hidden>
                  <WeatherIcon id="storm" />
                </div>
                <h2 className="h-title">{t(ui.safetyTitle)}</h2>
                <div className="options">
                  <button className="option option-compact" onClick={() => go("reflection")}>
                    <span className="option-label">{t(ui.safetyOk)}</span>
                  </button>
                  <button className="option option-compact" onClick={() => setHelpOpen(true)}>
                    <span className="option-label">{t(ui.safetyNo)}</span>
                  </button>
                </div>
              </>
            )}

            {step === "reflection" && tier && (
              <>
                <h2 className="h-display">{t(reflections[tier].title)}</h2>
                <p className="body">
                  {t(reflections[tier].body)}
                  {who === "nobody" && tier !== "clear" && (
                    <>
                      {" "}
                      {t(aloneLine)}
                    </>
                  )}
                </p>
                <button className="btn-primary" onClick={() => go("card")}>
                  {lang === "th" ? "ดูพยากรณ์ของฉัน" : "See my forecast"}
                </button>
              </>
            )}

            {step === "card" && weather && (
              <>
                <h2 className="h-title">{t(ui.cardTitle)}</h2>
                <p className="caption">{t(ui.cardHint)}</p>
                <div className="forecast-card" ref={cardRef} data-sky={weather}>
                  <div className="forecast-sky">
                    <span className={`wicon w-${weather}`}>
                      <WeatherIcon id={weather} />
                    </span>
                    <span className="forecast-label">{t(ui.cardLabel)}</span>
                    <span className="forecast-date">
                      {new Date().toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <div
                    className="forecast-text"
                    contentEditable
                    suppressContentEditableWarning
                    role="textbox"
                    aria-multiline
                    aria-label={t(ui.cardTitle)}
                    onBlur={(e) => setForecast(e.currentTarget.innerText)}
                  >
                    {forecast}
                  </div>
                  <div className="forecast-art" aria-hidden dangerouslySetInnerHTML={{ __html: artSvg(weather, "card") }} />
                </div>
                <button className="btn-primary" onClick={() => go("next")}>
                  {t(ui.continue)}
                </button>
              </>
            )}

            {step === "next" && tier && (
              <>
                <h2 className="h-title">{t(ui.nextTitle)}</h2>
                <div className="options">
                  {(
                    [
                      { id: "keep", label: ui.keep, sub: ui.keepSub, onClick: saveCard },
                      { id: "send", label: ui.send, sub: ui.sendSub, onClick: sendCard },
                      { id: "counsellor", label: ui.counsellor, sub: ui.counsellorSub, onClick: () => go("handoff") },
                    ] as const
                  ).map((o) => {
                    const isSuggested = suggestedExit[tier] === o.id;
                    return (
                      <button key={o.id} className={`option exit ${isSuggested ? "suggested" : ""}`} onClick={o.onClick}>
                        <span className="option-text">
                          <span className="option-label">
                            {t(o.label)}
                            {isSuggested && <span className="badge">{t(ui.suggested)}</span>}
                          </span>
                          <span className="option-hint">{t(o.sub)}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button className="btn-text" onClick={() => go("close")}>
                  {t(ui.done)}
                </button>
              </>
            )}

            {step === "handoff" && (
              <>
                <h2 className="h-title">{t(ui.handoffTitle)}</h2>
                <p className="caption">{t(ui.handoffBody)}</p>
                <div className="chat">
                  <div className="bubble">{forecast}</div>
                </div>
                <p className="note">{t(ui.handoffNote)}</p>
                <button className="btn-primary" onClick={copyFirstMessage}>
                  {t(ui.handoffCta)}
                </button>
                <button className="btn-text" onClick={() => go("close")}>
                  {t(ui.done)}
                </button>
              </>
            )}

            {step === "close" && (
              <>
                <h2 className="h-display">{t(ui.closeTitle)}</h2>
                <p className="body">{t(ui.closeBody)}</p>
                <button className="btn-secondary" onClick={restart}>
                  {t(ui.again)}
                </button>
              </>
            )}
          </motion.section>
        </AnimatePresence>
      </main>
      </div>

      <AnimatePresence>
        {helpOpen && (
          <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setHelpOpen(false)}>
            <motion.div
              className="help-sheet"
              role="dialog"
              aria-modal
              aria-labelledby="help-title"
              initial={{ y: reduce ? 0 : 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: reduce ? 0 : 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="help-title" className="h-title">
                {t(ui.helpTitle)}
              </h2>
              <p className="body">{t(ui.helpBody)}</p>
              <ul className="hotlines">
                {hotlines.map((h) => (
                  <li key={h.tel}>
                    <a href={`tel:${h.tel}`} className="hotline">
                      <span className="hotline-text">
                        <span className="option-label">{t(h.name)}</span>
                        <span className="option-hint">{t(h.note)}</span>
                      </span>
                      <span className="hotline-number">{h.number}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="note">{t(ui.danger)}</p>
              <button className="btn-secondary" onClick={() => setHelpOpen(false)} autoFocus>
                {t(ui.helpClose)}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div className="toast" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
