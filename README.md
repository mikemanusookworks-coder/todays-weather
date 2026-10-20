# Today's Weather · อากาศในใจวันนี้

A 2-minute emotional check-in that uses weather as a shared language. People pick how the weather feels inside them, how long it has lasted and what is in the clouds. The app turns those answers into a short forecast card: words they can keep, send to someone they trust, or use as a first message to a counsellor.

**Live:** https://todays-weather-mike.vercel.app

## Flow

Welcome → weather → duration → clouds + who knows → safety check (storm only) → reflection → forecast card → next step → close.

- **Tiered by duration.** The two-week line decides whether the reflection suggests keeping the card, sharing it, or talking to a counsellor.
- **Storm path** adds a safety question before anything else and opens the help sheet if the person isn't sure they're safe.
- **Thai first, English second.** Language follows `?lang=th|en`, then a saved choice, then the browser language. The toggle keeps the URL in sync.
- **Nothing is stored.** No sign-up, no backend; the card is saved or shared from the device.

## Design

- One original family of weather illustrations carries the emotion (no mascot); the sky gradient changes with each answer.
- Palette: Night ink `#22263A`, Mist `#F6F7FA`, Sun `#FFC94D`, Sunlit `#FFF6DA`, Dusk `#4A4F66`. Primary actions are ink pills (15:1 contrast).
- Type: [Anuphan](https://fonts.google.com/specimen/Anuphan) by Cadson Demak (OFL), one family for Thai and Latin.
- Responsive: single column on mobile, framed column on tablet, two columns from 1024px.
- Respects `prefers-reduced-motion`.

## Stack

Vite · React · TypeScript · Motion · html-to-image · @fontsource/anuphan

```bash
npm install
npm run dev
npm run build
```

## Crisis lines (Thailand, checked Oct 2026)

- 1323, Mental Health Hotline, Department of Mental Health (24h, free)
- 02-713-6793, Samaritans of Thailand, Thai (12:00–22:00)
- 02-713-6791, Samaritans of Thailand, English (24/7)
- 1669, emergency medical services

## Credits

Design and build by Sobhonwit (Mike) Manusook. A portfolio piece and white-label concept; not a medical tool.
