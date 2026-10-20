/** Text wordmark: a sun dot and the product name. Switches to light ink on the storm sky. */
export function Logo({ onDark = false, lang }: { onDark?: boolean; lang: "th" | "en" }) {
  return (
    <span className={`logo ${onDark ? "logo-dark" : ""}`}>
      <span className="logo-dot" aria-hidden />
      <span className="logo-name">{lang === "th" ? "อากาศในใจวันนี้" : "Today's Weather"}</span>
    </span>
  );
}
