import { services, site } from "../config/site";
export type Choices = {
  stage: string;
  service: string;
  quantity: number;
  language: string;
  deadline: string;
  difficulty: string;
  extras: string[];
};
export const defaults: Choices = {
  stage: "university",
  service: "homework",
  quantity: 1,
  language: "ar",
  deadline: "standard",
  difficulty: "normal",
  extras: [],
};
export function estimate(c: Choices) {
  const service = services.find((s) => s.id === c.service);
  if (!service || service.price === 0) return null;
  const quantity = Math.max(1, Math.min(100000, Number(c.quantity) || 1));
  const count = service.unit === "words" ? Math.ceil(quantity / 250) : quantity;
  const urgency = site.urgency[c.deadline as keyof typeof site.urgency] || 1;
  const difficulty =
    site.difficulty[c.difficulty as keyof typeof site.difficulty] || 1;
  const extra = [...new Set(c.extras)].reduce(
    (a, x) => a + (site.extras[x as keyof typeof site.extras] || 0),
    0,
  );
  const base = (service.price * count + extra) * urgency * difficulty;
  const specialized = c.language === "specialized";
  return {
    low: Math.max(
      site.minimum,
      Math.ceil(base * (specialized ? site.specializedEnglish[0] : 1) - 1e-9),
    ),
    high: Math.max(
      site.minimum,
      Math.ceil(
        base * (specialized ? site.specializedEnglish[1] : 1.15) - 1e-9,
      ),
    ),
  };
}
export function choicesToQuery(c: Choices) {
  return new URLSearchParams({
    ...c,
    quantity: String(c.quantity),
    extras: c.extras.join(","),
  }).toString();
}
export function choicesFromQuery(q: URLSearchParams): Choices {
  return {
    stage: q.get("stage") || defaults.stage,
    service: services.some((s) => s.id === q.get("service"))
      ? q.get("service")!
      : defaults.service,
    quantity: Math.max(1, Math.min(100000, Number(q.get("quantity")) || 1)),
    language: q.get("language") || defaults.language,
    deadline: q.get("deadline") || defaults.deadline,
    difficulty: q.get("difficulty") || defaults.difficulty,
    extras: (q.get("extras") || "").split(",").filter((x) => x in site.extras),
  };
}
