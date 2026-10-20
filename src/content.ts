export type Lang = "th" | "en";
export type Weather = "clear" | "partly" | "fog" | "drizzle" | "storm";
export type Duration = "days" | "weeks" | "long" | "forever";
export type Cloud =
  | "work"
  | "money"
  | "family"
  | "relationship"
  | "sleep"
  | "health"
  | "lonely"
  | "future"
  | "unsure";
export type WhoKnows = "nobody" | "little" | "trusted";
export type Tier = "clear" | "passing" | "lingering" | "persistent";

type T = Record<Lang, string>;

export const weathers: { id: Weather; label: T; hint: T }[] = [
  { id: "clear", label: { th: "แจ่มใส", en: "Clear" }, hint: { th: "เบาสบาย ใจนิ่ง", en: "Light and steady" } },
  { id: "partly", label: { th: "มีเมฆบ้าง", en: "Partly cloudy" }, hint: { th: "โดยรวมโอเค มีบางช่วงที่หนักใจ", en: "Mostly okay, with some heavy moments" } },
  { id: "fog", label: { th: "หมอกลง", en: "Foggy" }, hint: { th: "ว่างเปล่า ชาๆ ไม่ค่อยรู้สึกอะไร", en: "Blank, numb, hard to feel much" } },
  { id: "drizzle", label: { th: "ฝนปรอย", en: "Drizzle" }, hint: { th: "หม่นๆ เศร้าๆ เป็นพักๆ", en: "Low and grey, on and off" } },
  { id: "storm", label: { th: "พายุเข้า", en: "Storm" }, hint: { th: "หนักมาก แต่ละวันผ่านไปได้ยาก", en: "Heavy, each day is hard to get through" } },
];

export const durations: { id: Duration; label: T }[] = [
  { id: "days", label: { th: "ไม่กี่วัน", en: "A few days" } },
  { id: "weeks", label: { th: "ราว 1–2 สัปดาห์", en: "A week or two" } },
  { id: "long", label: { th: "นานกว่า 2 สัปดาห์", en: "More than two weeks" } },
  { id: "forever", label: { th: "จำไม่ได้แล้วว่าฟ้าใสครั้งล่าสุดเมื่อไหร่", en: "I can't remember the last clear day" } },
];

export const clouds: { id: Cloud; label: T }[] = [
  { id: "work", label: { th: "งาน", en: "Work" } },
  { id: "money", label: { th: "เงิน", en: "Money" } },
  { id: "family", label: { th: "ครอบครัว", en: "Family" } },
  { id: "relationship", label: { th: "ความรัก", en: "Relationship" } },
  { id: "sleep", label: { th: "การนอน", en: "Sleep" } },
  { id: "health", label: { th: "สุขภาพ", en: "Health" } },
  { id: "lonely", label: { th: "ความเหงา", en: "Loneliness" } },
  { id: "future", label: { th: "อนาคต", en: "The future" } },
  { id: "unsure", label: { th: "ไม่แน่ใจ", en: "Not sure" } },
];

export const whoKnowsOptions: { id: WhoKnows; label: T }[] = [
  { id: "nobody", label: { th: "ยังไม่มีใครรู้", en: "Nobody yet" } },
  { id: "little", label: { th: "มีคนรู้บ้างนิดหน่อย", en: "Somebody knows a little" } },
  { id: "trusted", label: { th: "มีคนที่ไว้ใจรู้อยู่", en: "Someone I trust knows" } },
];

/** Duration matters more than intensity: two weeks is the line clinical screening uses. */
export function getTier(w: Weather, d: Duration): Tier {
  if (w === "clear") return "clear";
  if (w === "storm") return "persistent";
  if (d === "days") return "passing";
  if (d === "weeks") return w === "partly" ? "passing" : "lingering";
  return w === "partly" ? "lingering" : "persistent";
}

export const reflections: Record<Tier, { title: T; body: T }> = {
  clear: {
    title: { th: "ฟ้าใสดีนะ", en: "Clear skies. That's good to notice." },
    body: {
      th: "การแวะเช็กใจตอนที่ทุกอย่างโอเค ช่วยให้เรารู้ตัวเร็วขึ้นเวลาที่ฟ้าเริ่มเปลี่ยน",
      en: "Checking in when things are okay helps you notice sooner when the sky starts to change.",
    },
  },
  passing: {
    title: { th: "อากาศเปลี่ยนได้เสมอ", en: "Weather passes." },
    body: {
      th: "วันที่มีเมฆเป็นเรื่องปกติของทุกคน แค่สังเกตเห็นก็ถือว่าดูแลตัวเองแล้ว ถ้าเมฆยังอยู่เกิน 2 สัปดาห์ นั่นคือสัญญาณว่าควรเล่าให้ใครสักคนฟัง",
      en: "Cloudy days are part of being human, and noticing them is already looking after yourself. If the clouds stay past two weeks, that's a sign to tell someone.",
    },
  },
  lingering: {
    title: { th: "ไม่ต้องรอให้พายุเข้า ก็คุยกับใครสักคนได้", en: "You don't need a storm to talk to someone." },
    body: {
      th: "เมฆที่อยู่นานเป็นสัปดาห์ควรได้พูดออกมา ไม่ใช่เพราะเราผิดปกติ แต่เพราะเรื่องหนักๆ จะเบาลงเมื่อมีคนช่วยถือ",
      en: "Clouds that stay for a week or two are worth saying out loud. Not because something is wrong with you, but because heavy things get lighter with two.",
    },
  },
  persistent: {
    title: { th: "เรื่องนี้หนักมานานแล้ว", en: "This has been heavy for a while." },
    body: {
      th: "เมื่อฟ้าหม่นนานเกิน 2 สัปดาห์ การได้คุยกับนักจิตวิทยาช่วยได้จริง ไม่จำเป็นต้องรอให้เป็นเรื่องใหญ่",
      en: "When the sky stays grey for more than two weeks, talking with a counsellor really helps. It doesn't have to be a crisis to count.",
    },
  },
};

export const aloneLine: T = {
  th: "และที่ผ่านมาเราถือมันไว้คนเดียว",
  en: "And you've been holding it on your own.",
};

const weatherPhrase: Record<Weather, T> = {
  clear: { th: "ฟ้าใส", en: "clear" },
  partly: { th: "มีเมฆบ้าง", en: "partly cloudy" },
  fog: { th: "เหมือนมีหมอกลง", en: "foggy" },
  drizzle: { th: "เหมือนฝนปรอยๆ", en: "drizzly" },
  storm: { th: "เหมือนมีพายุ", en: "stormy" },
};

const durationPhrase: Record<Duration, T> = {
  days: { th: "มาไม่กี่วัน", en: "for a few days" },
  weeks: { th: "มาราว 1–2 สัปดาห์", en: "for a week or two" },
  long: { th: "มานานกว่า 2 สัปดาห์แล้ว", en: "for more than two weeks" },
  forever: { th: "มานานจนจำไม่ได้แล้ว", en: "for longer than I can remember" },
};

const whoPhrase: Record<WhoKnows, T> = {
  nobody: { th: "ยังไม่มีใครรู้เรื่องนี้เลย", en: "Nobody really knows yet." },
  little: { th: "มีคนรู้บ้างนิดหน่อย", en: "A few people know a little." },
  trusted: { th: "มีคนที่ไว้ใจรู้อยู่", en: "Someone I trust knows." },
};

function joinList(items: string[], lang: Lang) {
  if (items.length <= 1) return items[0] ?? "";
  const and = lang === "th" ? " กับ" : " and ";
  return items.slice(0, -1).join(lang === "th" ? " " : ", ") + and + items[items.length - 1];
}

export function buildForecast(
  lang: Lang,
  w: Weather,
  d: Duration,
  picked: Cloud[],
  who: WhoKnows,
): string {
  const named = picked.filter((c) => c !== "unsure").map((c) => {
    const l = clouds.find((x) => x.id === c)!.label[lang];
    return lang === "en" ? l.toLowerCase() : l;
  });
  if (lang === "th") {
    const cause = named.length ? `ส่วนใหญ่เป็นเรื่อง${joinList(named, lang)}` : "ยังไม่แน่ใจว่าเพราะอะไร";
    return `ช่วงนี้ในใจ${weatherPhrase[w].th} ${durationPhrase[d].th}\n${cause}\n${whoPhrase[who].th}`;
  }
  const cause = named.length ? `Mostly ${joinList(named, lang)}.` : "I'm not sure why.";
  return `Lately it's been ${weatherPhrase[w].en} inside, ${durationPhrase[d].en}.\n${cause}\n${whoPhrase[who].en}`;
}

export const ui = {
  help: { th: "ขอความช่วยเหลือ", en: "Need help now?" },
  back: { th: "ย้อนกลับ", en: "Back" },
  continue: { th: "ต่อไป", en: "Continue" },
  welcomeTitle: { th: "วันนี้อากาศในใจเป็นยังไงบ้าง", en: "How's your weather today?" },
  welcomeBody: {
    th: "รู้สึกไม่ค่อยโอเคแต่บอกไม่ถูกว่าเพราะอะไร ลองเช็กดู ใช้เวลา 2 นาที",
    en: "Feeling off but can't say why? Take 2 minutes to check in.",
  },
  welcomeCta: { th: "เช็กอากาศในใจ", en: "Check my weather" },
  welcomePrivacy: {
    th: "ไม่ต้องสมัคร ไม่เก็บข้อมูล ไม่ใช่แบบประเมินทางการแพทย์",
    en: "No sign-up. Nothing is saved. This isn't a medical assessment.",
  },
  qWeather: { th: "ช่วงนี้ในใจเป็นอากาศแบบไหน", en: "What's the weather been like inside you?" },
  qDuration: { th: "อากาศแบบนี้อยู่มานานแค่ไหนแล้ว", en: "How long has it been like this?" },
  qClouds: { th: "เมฆก้อนไหนที่หนักที่สุด", en: "What's in the clouds?" },
  qCloudsHint: { th: "เลือกได้สูงสุด 3 อย่าง", en: "Pick up to 3" },
  qWho: { th: "มีใครรู้เรื่องนี้บ้างไหม", en: "Who knows about this weather?" },
  safetyTitle: { th: "พายุทำให้ทุกอย่างรู้สึกหนัก ตอนนี้คุณปลอดภัยไหม", en: "Storms can feel heavy. Are you safe right now?" },
  safetyOk: { th: "หนัก แต่ปลอดภัยดี", en: "It's heavy, but I'm safe" },
  safetyNo: { th: "ไม่แน่ใจ หรือเคยคิดทำร้ายตัวเอง", en: "I'm not sure, or I've thought about hurting myself" },
  cardTitle: { th: "พยากรณ์อากาศของคุณ", en: "Your forecast" },
  cardHint: {
    th: "นี่คือคำที่ใช้เริ่มเล่าให้ใครสักคนฟังได้ แก้ไขให้เป็นคำของคุณได้เลย",
    en: "These are words you can use to start the conversation. Edit them so they sound like you.",
  },
  cardLabel: { th: "อากาศในใจวันนี้", en: "Today's weather" },
  nextTitle: { th: "จะทำอะไรกับพยากรณ์นี้ดี", en: "What would you like to do with it?" },
  suggested: { th: "แนะนำ", en: "Suggested" },
  keep: { th: "เก็บไว้ดูเอง", en: "Keep it for myself" },
  keepSub: { th: "บันทึกการ์ดเป็นรูปภาพ", en: "Save the card as an image" },
  saved: { th: "บันทึกแล้ว", en: "Saved" },
  send: { th: "ส่งให้คนที่ไว้ใจ", en: "Send to someone I trust" },
  sendSub: { th: "แชร์ผ่าน LINE หรือคัดลอกข้อความ", en: "Share on LINE or copy the text" },
  copied: { th: "คัดลอกข้อความแล้ว", en: "Text copied" },
  counsellor: { th: "คุยกับนักจิตวิทยา", en: "Talk it through with a counsellor" },
  counsellorSub: {
    th: "การ์ดนี้จะเป็นข้อความแรกของคุณ ไม่ต้องเริ่มจากศูนย์",
    en: "Your card becomes your first message, so you don't start from zero.",
  },
  handoffTitle: { th: "ข้อความแรกพร้อมแล้ว", en: "Your first message is ready" },
  handoffBody: {
    th: "นักจิตวิทยาจะได้อ่านก่อนเริ่มคุย คุณจะได้ไม่ต้องอธิบายตั้งแต่ต้น",
    en: "Your counsellor reads it before the session, so you don't have to explain from the start.",
  },
  handoffNote: {
    th: "หลายบริษัทมีสวัสดิการปรึกษานักจิตวิทยาให้พนักงาน (EAP) ลองสอบถาม HR ของคุณ",
    en: "Many employers offer free counselling through an Employee Assistance Programme (EAP). Check with your HR.",
  },
  handoffCta: { th: "คัดลอกข้อความแรก", en: "Copy my first message" },
  handoffCopied: { th: "คัดลอกแล้ว วางในแชตกับนักจิตวิทยาได้เลย", en: "Copied. Paste it into your counsellor chat." },
  done: { th: "เสร็จแล้ว", en: "I'm done" },
  closeTitle: { th: "ขอบคุณที่แวะมาเช็กใจนะ", en: "Thanks for checking in." },
  closeBody: { th: "อากาศเปลี่ยนได้เสมอ กลับมาเช็กได้ทุกเมื่อ", en: "Weather changes. Come back any time." },
  again: { th: "เช็กอีกครั้ง", en: "Check again" },
  helpTitle: { th: "คุณไม่ต้องผ่านเรื่องนี้คนเดียว", en: "You don't have to get through this alone." },
  helpBody: {
    th: "คุยกับคนที่พร้อมรับฟังได้ตอนนี้ ฟรีและเป็นความลับ",
    en: "Talk to someone who is ready to listen right now. Free and confidential.",
  },
  helpClose: { th: "กลับไปที่เดิม", en: "Go back" },
  danger: {
    th: "หากอยู่ในอันตรายเร่งด่วน โทร 1669",
    en: "If you're in immediate danger, call 1669.",
  },
} satisfies Record<string, T>;

export const hotlines: { name: T; number: string; tel: string; note: T }[] = [
  {
    name: { th: "สายด่วนสุขภาพจิต กรมสุขภาพจิต", en: "Mental Health Hotline (Dept. of Mental Health)" },
    number: "1323",
    tel: "1323",
    note: { th: "ตลอด 24 ชั่วโมง ไม่มีค่าใช้จ่าย", en: "24 hours, free, Thai language" },
  },
  {
    name: { th: "สะมาริตันส์ แห่งประเทศไทย", en: "Samaritans of Thailand" },
    number: "02-713-6793",
    tel: "027136793",
    note: { th: "ภาษาไทย ทุกวัน 12:00–22:00", en: "Thai line, daily 12:00–22:00" },
  },
  {
    name: { th: "Samaritans (English)", en: "Samaritans (English)" },
    number: "02-713-6791",
    tel: "027136791",
    note: { th: "ภาษาอังกฤษ ตลอด 24 ชั่วโมง", en: "English line, 24/7" },
  },
];
