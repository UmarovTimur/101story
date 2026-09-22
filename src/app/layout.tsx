import type { Metadata, Viewport } from "next";
import { Bitter, Comfortaa, Nunito } from "next/font/google";
import { defaultLanguage } from "@/lib/languages";
import { t } from "@/lib/i18n";
import { PageSkeleton } from "@/components/page-skeleton";
import "./globals.css";

// Все три шрифта рисуют узбекские ʻ ’ и кириллицу.
const sans = Nunito({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-sans",
  display: "block",
});

const serif = Bitter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-serif",
  display: "block",
});

const display = Comfortaa({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-display",
  display: "block",
});

// Запасной заголовок (корень-редирект, 404): берём язык по умолчанию,
// страницы языка переопределяют его в [lang]/layout.tsx.
export const metadata: Metadata = {
  title: t(defaultLanguage.code).siteTitle,
  description: "Bible stories — audio and text",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f5eb" },
    { media: "(prefers-color-scheme: dark)", color: "#151515" },
  ],
};

// Ниже этой ширины макет не сжимаем (body в globals.css имеет min-width),
// а масштабируем страницу целиком через zoom — так ничего не ломается и не
// появляется горизонтальная прокрутка. Значение дублируется в globals.css.
const MIN_WIDTH = 375;

// Сколько максимум держим серый каркас, если шрифты почему-то не догрузились.
const SKELETON_TIMEOUT = 2500;

// Выставляем тему, размер текста, масштаб и серый каркас до первой отрисовки.
// Каркас снимаем, когда шрифты готовы — тогда текст сразу рисуется нужным
// шрифтом и не «мигает» подменой.
const bootScript = `(function () {
  var d = document.documentElement;
  var done = function () { try { delete d.dataset.loading; } catch (e) {} };
  try {
    var t = localStorage.getItem("bs:theme");
    if (t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches) d.classList.add("dark");
    var s = localStorage.getItem("bs:text");
    if (s) d.dataset.textSize = s;

    var fit = function () {
      d.style.zoom = "";
      var w = d.clientWidth || screen.width;
      if (w && w < ${MIN_WIDTH}) d.style.zoom = w / ${MIN_WIDTH};
    };
    fit();
    addEventListener("resize", fit);
    addEventListener("orientationchange", fit);

    d.dataset.loading = "1";
    // fonts.ready в <head> разрешается мгновенно: шрифты ещё не запрошены.
    // Ждём первой отрисовки, к этому моменту запросы уже ушли.
    var waitFonts = function () {
      requestAnimationFrame(function () {
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(done);
        else done();
      });
    };
    if (document.readyState === "loading") addEventListener("DOMContentLoaded", waitFonts);
    else waitFonts();
    setTimeout(done, ${SKELETON_TIMEOUT});
  } catch (e) {
    done();
  }
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body
        className={`${sans.variable} ${serif.variable} ${display.variable} font-sans antialiased`}
      >
        <PageSkeleton />
        {children}
      </body>
    </html>
  );
}
