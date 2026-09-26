# Деплой 101story.org

Сайт — статический экспорт Next.js (`out/`). Собираем **локально**, на сервер
заливаем только готовый `out/`. На сервере не собираем: там мало памяти
(7.6 ГБ на все проекты, уходит в swap).

## Как устроено на сервере

- Сервер: `ssh ubuntu@57.129.62.155`. Полный инвентарь сервера (порты, nginx,
  другие проекты, правила) — в `~/SERVER_INFO.md` на самом сервере.
  Прочитай его, прежде чем трогать что-то кроме `out/`.
- Папка проекта: `/home/ubuntu/srv/bible-stories`, отдаётся папка `out/`.
- Процесс: pm2 `bible-stories-dev` = `npx serve out -l 2001`
  (cwd `/home/ubuntu/srv/bible-stories`).
- nginx: `/etc/nginx/sites-available/101story.org` проксирует
  `101story.org` и `www` (80 и 443) на `127.0.0.1:2001`.
- Снаружи — Cloudflare (proxied, SSL mode Full; на origin самоподписанный
  сертификат `/etc/ssl/cloudflare/101story.org.{pem,key}`).
- Заголовки кэша задаёт `public/serve.json` (попадает в `out/serve.json`):
  `_next/static` — год, `img`/`audio` — 30 дней, иконки — неделя.
  `serve` читает его **только при старте**, поэтому после изменения
  `serve.json` нужен `pm2 restart bible-stories-dev`.

## Деплой

```bash
# 1. Сборка. Домен по умолчанию https://101story.org (src/lib/site.ts),
#    SITE_URL задавать не нужно.
npm run build
grep Sitemap out/robots.txt   # должно быть https://101story.org/sitemap.xml

# 2. Заливка. -c (по контрольным суммам), иначе rsync заново перешлёт все
#    ~5 ГБ аудио из-за новых дат файлов после сборки.
#    --delete убирает старые чанки прошлой сборки.
rsync -azc --delete --stats out/ ubuntu@57.129.62.155:/home/ubuntu/srv/bible-stories/out/

# 3. Права (nginx/serve читают как world-readable) и перезапуск serve.
#    Рестарт обязателен, только если менялся serve.json, но он дешёвый.
ssh ubuntu@57.129.62.155 'chmod -R a+rX ~/srv/bible-stories/out && pm2 restart bible-stories-dev'
```

Перед первой заливкой полезно посмотреть, что изменится:
`rsync -anc --delete --itemize-changes out/ ubuntu@57.129.62.155:/home/ubuntu/srv/bible-stories/out/`

## Проверка

```bash
# на сервере, мимо Cloudflare
ssh ubuntu@57.129.62.155 'curl -sI http://127.0.0.1:2001/ru/ | head -1'

# снаружи
curl -s https://101story.org/ru/ | grep -o 'rel="canonical" href="[^"]*"'
curl -s https://101story.org/robots.txt | tail -1
```

Cloudflare держит статику на своём edge до 4 часов, поэтому старые файлы
(с прежними заголовками) могут отдаваться ещё какое-то время. HTML не кэшируется
(`cf-cache-status: DYNAMIC`), поэтому новая версия видна сразу. Если нужно
сбросить всё немедленно: Cloudflare → Caching → Configuration → Purge Everything.

## Подводные камни

- В `/home/ubuntu/srv/bible-stories` на сервере лежит старая копия исходников
  с `.env`, где `SITE_URL=http://57.129.62.155:2001`. Если когда-нибудь собирать
  прямо на сервере, этот `.env` подставит IP в sitemap/canonical: сначала
  удалите из него `SITE_URL`.
- Аудио (`public/audio`, ~5 ГБ) нет в git: заливается вместе с `out/audio`.
  Новое аудио — `npm run audio` локально перед сборкой.
- Не трогай nginx и чужие pm2-процессы без нужды: сервер общий
  (incilaz.com, rentent.uz, camping-rent.uz и др.), правила — в `~/SERVER_INFO.md`.
