import { availableLanguages, getStories } from "./stories";
import { eras } from "./eras";
import { t } from "./i18n";
import { absoluteUrl, langTag } from "./site";
import { describe, listPath, storyPath } from "./seo";

// llms.txt (https://llmstxt.org): короткая карта сайта в Markdown для ИИ-ассистентов —
// что здесь есть и по каким ссылкам. Общий файл перечисляет языки, у каждого языка
// свой файл со всеми историями.

const text = (body: string) =>
  new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });

export async function rootLlms(): Promise<Response> {
  const lines = [
    "# Bible Stories",
    "",
    "> Illustrated Bible stories for children and families with full text, discussion questions " +
      "and a narrated audio version of every story. The same ~100 stories (from Creation to Revelation) " +
      `are available in ${availableLanguages().length} languages.`,
    "",
    "Each story page contains the story text, the Bible reference it retells, questions for discussion and an MP3 narration.",
    "",
    "## Languages",
    "",
  ];
  for (const l of availableLanguages()) {
    lines.push(
      `- [${l.englishName} — ${t(l.code).siteTitle}](${absoluteUrl(listPath(l.code))}) ` +
        `(${langTag(l)}): story index in [llms.txt](${absoluteUrl(`/${l.code}/llms.txt`)})`
    );
  }
  return text(lines.join("\n") + "\n");
}

export async function langLlms(lang: string): Promise<Response> {
  const ui = t(lang);
  const stories = await getStories(lang);
  const line = (s: (typeof stories)[number]) =>
    `- [${s.number > 0 ? `${s.number}. ` : ""}${s.title}](${absoluteUrl(storyPath(lang, s))})` +
    `${s.reference ? ` — ${s.reference}` : ""}: ${describe(s.paragraphs, 200)}`;

  const lines = [`# ${ui.siteTitle}`, "", `> ${ui.apps.text}`, ""];
  const preface = stories.find((s) => s.number === 0);
  if (preface) lines.push(`## ${ui.preface}`, "", line(preface), "");
  for (const era of eras) {
    const group = stories.filter((s) => s.number >= era.from && s.number <= era.to);
    if (!group.length) continue;
    lines.push(`## ${ui.eras[era.key].title}`, "", ...group.map(line), "");
  }
  return text(lines.join("\n"));
}
