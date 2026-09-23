/**
 * Баннер-ссылка в сайдбаре списка историй: сайт, где Библию можно почитать
 * полностью, на языке текущей страницы.
 *
 * title — слово «Библия» на языке страницы. Для большинства языков это то
 * же слово, которым сама Библейские-истории-приложение называет книгу в
 * своём интерфейсе (извлечено из его же переводов — см. apps.title в
 * i18n.ts); для остальных — стандартный перевод. subtitle — домен ресурса,
 * по той же логике, что и непереводимые «Google Play» / «App Store» в
 * промо-баннере приложения.
 *
 * Ссылки: для русского, азербайджанского и узбекского — отдельные ресурсы
 * (bible.by, incilaz.com, kitobook.com). Для 19 остальных — YouVersion
 * (bible.com/languages/<код>), у него есть страница на каждый язык. Для
 * шугнанского (sgh) на YouVersion перевода нет — ссылка ведёт на Институт
 * перевода Библии (ibtrussia.org), который его публикует.
 */
export interface SideBanner {
  href: string;
  title: string;
  subtitle: string;
}

const YOUVERSION = "bible.com";
const bv = (code: string) => `https://www.bible.com/languages/${code}`;

export const sideBanners: Record<string, SideBanner> = {
  uz: { href: "https://www.kitobook.com", title: "Muqaddas Kitob", subtitle: "kitobook.com" },
  ru: { href: "https://bible.by", title: "Библия", subtitle: "bible.by" },
  az: { href: "https://incilaz.com", title: "Müqəddəs Kitab", subtitle: "incilaz.com" },
  kk: { href: bv("kaz"), title: "Киелі Жазба", subtitle: YOUVERSION },
  ky: { href: bv("kir"), title: "Ыйык Китеп", subtitle: YOUVERSION },
  tg: { href: bv("tgk"), title: "Библия", subtitle: YOUVERSION },
  uk: { href: bv("ukr"), title: "Біблія", subtitle: YOUVERSION },
  hy: { href: bv("hye"), title: "Աստվածաշունչ", subtitle: YOUVERSION },
  ka: { href: bv("kat"), title: "ბიბლია", subtitle: YOUVERSION },
  tr: { href: bv("tur"), title: "Kutsal Kitap", subtitle: YOUVERSION },
  de: { href: bv("deu"), title: "Bibel", subtitle: YOUVERSION },
  es: { href: bv("spa"), title: "Biblia", subtitle: YOUVERSION },
  fa: { href: bv("pes"), title: "کتاب مقدس", subtitle: YOUVERSION },
  ro: { href: bv("ron"), title: "Biblia", subtitle: YOUVERSION },
  kmr: { href: bv("kmr"), title: "Pirtûka Pîroz", subtitle: YOUVERSION },
  mn: { href: bv("khk"), title: "Библи", subtitle: YOUVERSION },
  sah: { href: bv("sah"), title: "Библия", subtitle: YOUVERSION },
  tyv: { href: bv("tyv"), title: "Библия", subtitle: YOUVERSION },
  ug: { href: bv("uig_cyr"), title: "Муқәддәс Китап", subtitle: YOUVERSION },
  xal: { href: bv("xal"), title: "Библь", subtitle: YOUVERSION },
  kaa: { href: bv("kaa"), title: "Мухаддес Китап", subtitle: YOUVERSION },
  sgh: { href: "https://ibtrussia.org/Shugni/bible", title: "Китоби Муқаддас", subtitle: "ibtrussia.org" },
  pdt: { href: bv("pdt"), title: "Bibel", subtitle: YOUVERSION },
};

export function getSideBanner(lang: string): SideBanner | undefined {
  return sideBanners[lang];
}
