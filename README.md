# Bible Stories

Мультиязычный статический (SSG) сайт с аудио-историями и текстами.
Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui.

## Стек

- **Next.js 15** в режиме `output: "export"` — на выходе полностью статический
  сайт в папке `out/` (можно хостить где угодно: Nginx, GitHub Pages, S3, …).
- **TypeScript** (strict).
- **Tailwind CSS** + **shadcn/ui** (`button`, `card` — сгенерированы вручную).
- **i18n** через сегмент маршрута `[lang]` и словарь UI-строк.

## Структура

```
data/
  languages.json     # список доступных языков (метаданные)
  uz.json            # истории на узбекском (id, title, reference, paragraphs, questions, audio, image)
public/
  audio/<lang>/*.mp3 # аудио по языкам (напр. audio/uz/uz85.mp3)
  images/*.jpg       # картинки — ОБЩИЕ для всех языков (по номеру истории)
src/
  app/
    page.tsx             # редирект на язык по умолчанию
    [lang]/layout.tsx    # шапка + переключатель языка
    [lang]/page.tsx      # сетка историй
    [lang]/[id]/page.tsx # страница истории: плеер + текст + вопросы
  components/
    audio-player.tsx     # клиентский аудиоплеер
    language-switcher.tsx
    ui/                  # shadcn-компоненты
  lib/
    types.ts             # Story, Language
    stories.ts           # загрузка/поиск историй, пути к медиа
    languages.ts         # реестр языков
    i18n.ts              # строки интерфейса
```

## Команды

```bash
npm install      # установка зависимостей
npm run dev      # разработка -> http://localhost:3000
npm run build    # статическая сборка -> ./out
npm run serve    # локально отдать собранный ./out
```

## Как добавить новый язык

1. Положить `data/<code>.json` в том же формате, что `data/uz.json`.
2. Добавить запись о языке в `data/languages.json`.
3. Добавить загрузчик в `src/lib/stories.ts` (объект `loaders`).
4. Добавить перевод UI-строк в `src/lib/i18n.ts`.
5. Положить аудио в `public/audio/<code>/`. Картинки переиспользуются —
   они общие для всех языков.

Маршруты, списки и статические страницы соберутся автоматически
(`generateStaticParams`).

## Данные

Данные и медиа извлечены из мобильного приложения (Firebase Firestore +
CDN) и разложены в чистый формат. `audiolink` в исходной базе местами
содержал опечатки (напр. история `uz66` ссылалась на файл `uz65.mp3`) —
при переупаковке имена аудио приведены к `id` истории.

Контент принадлежит Bible Mission. Используйте в рамках их условий.

## Про размер и Git

Папка `public/audio` весит ~500 МБ. Хранить это прямо в git-репозитории
не стоит — используйте **Git LFS**:

```bash
git lfs install
git lfs track "public/audio/**/*.mp3"
git add .gitattributes
```

либо раскомментируйте соответствующие строки в `.gitignore`, чтобы не
коммитить медиа вовсе (тогда держите его отдельно).
```
