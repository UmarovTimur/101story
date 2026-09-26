# Bible Stories

Мультиязычный статический (SSG) сайт с аудио-историями и текстами.
Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui.

## Стек

- **Next.js 15** в режиме `output: "export"` — на выходе полностью статический
  сайт в папке `out/` (можно хостить где угодно: Nginx, S3, …).
- **TypeScript** (strict).
- **Tailwind CSS** + **shadcn/ui**.
- **i18n** через сегмент маршрута `[lang]` и словарь UI-строк.

## Структура

```
data/
  languages.json     # список языков: code (ISO 639, он же URL), hreflang (если отличается), dir, flag
  <code>.json        # истории языка (id, number, title, reference, paragraphs, questions, audio, image)
assets/
  images/*.jpg       # исходные картинки — ОБЩИЕ для всех языков (в out/ не попадают)
public/
  audio/<code>/*.mp3 # аудио по языкам, 64 kbps моно (не в git)
  img/<w>/*.webp     # WebP, нарезанные из assets/images (генерируются, не в git)
audio-original/      # исходное аудио 192 kbps (не в git, не в out/)
src/
  app/
    [lang]/layout.tsx        # корневой layout языка: <html lang dir>
    [lang]/page.tsx          # список историй
    [lang]/[id]/page.tsx     # история: плеер + текст + вопросы + JSON-LD
    [lang]/llms.txt/         # список историй языка для ИИ-ассистентов
    (root)/                  # «/» — язык по умолчанию со своим layout
    global-not-found.tsx     # единая 404
    sitemap.ts robots.ts manifest.ts llms.txt/
  components/root-document.tsx  # общая оболочка <html>: шрифты, тема, мета
  lib/
    site.ts          # SITE_URL, абсолютные адреса, BCP-47 теги
    seo.ts           # hreflang, описания, Open Graph
    stories.ts       # загрузка историй, пути к медиа
    i18n.ts          # строки интерфейса
```

## Команды

```bash
npm install
npm run dev                                   # разработка -> http://localhost:3000
npm run build                                 # статическая сборка для https://101story.org -> ./out
SITE_URL=http://localhost:3000 npm run build  # сборка для локальной проверки
npm run serve                                 # отдать собранный ./out
npm run audio                                 # пережать новое аудио в 64 kbps моно
npm run images                                # нарезать WebP (запускается перед build сам)
```

Домен сайта — `https://101story.org` (`src/lib/site.ts`): от него строятся canonical,
hreflang, sitemap, robots, Open Graph и JSON-LD. Переменная `SITE_URL` переопределяет его.

## Как добавить новый язык

1. Положить `data/<code>.json` в том же формате (code — настоящий ISO 639 код языка).
2. Добавить запись в `data/languages.json`; если для поисковиков нужен уточнённый
   тег (например письменность), указать `hreflang` (`"ug-Cyrl"`).
3. Добавить загрузчик в `src/lib/stories.ts` (объект `loaders`).
4. Добавить перевод UI-строк в `src/lib/i18n.ts` и баннер в `src/lib/side-banner.ts`.
5. Положить аудио в `public/audio/<code>/` и запустить `npm run audio`.

Маршруты, sitemap, hreflang и llms.txt соберутся автоматически.

## Данные

Данные и медиа извлечены из мобильного приложения (Firebase Firestore +
CDN) и разложены в чистый формат. `audiolink` в исходной базе местами
содержал опечатки (напр. история `uz66` ссылалась на файл `uz65.mp3`) —
при переупаковке имена аудио приведены к `id` истории. Коды девяти языков
в исходной базе были чужими (hz, ms, eu, ty, ba, kr, tl, gv, gl) — они
заменены на настоящие (`scripts/rename-langs.mjs`).

Контент принадлежит Bible Mission. Используйте в рамках их условий.

## Про размер

Аудио после `npm run audio` — около 5 ГБ (исходники 192 kbps — 16 ГБ, лежат в
`audio-original/`). Всё содержимое `public/` копируется в `out/` при каждой
сборке, поэтому хостинг должен принимать гигабайты статики (свой сервер/VPS,
объектное хранилище). В git аудио не хранится.
