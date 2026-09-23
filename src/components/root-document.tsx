import type { Metadata, Viewport } from "next";
import { Bitter, Comfortaa, Nunito } from "next/font/google";
import type { Language } from "@/lib/types";
import { siteUrl, langTag } from "@/lib/site";
import "@/app/globals.css";

// Корневых layout-ов несколько (по языку, корень «/», 404), чтобы у каждой
// страницы был свой <html lang dir>. Общая оболочка документа — здесь.

// Все три шрифта рисуют узбекские ʻ ’ и кириллицу. swap: текст виден сразу
// запасным шрифтом, а next/font подгоняет его метрики, так что при подмене
// строки почти не сдвигаются.
const sans = Nunito({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Bitter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-serif",
  display: "swap",
});

const display = Comfortaa({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-display",
  display: "swap",
});

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
};

export const rootViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f5eb" },
    { media: "(prefers-color-scheme: dark)", color: "#151515" },
  ],
};

// Ниже этой ширины макет не сжимаем (body в globals.css имеет min-width),
// а масштабируем страницу целиком через zoom — так ничего не ломается и не
// появляется горизонтальная прокрутка. Значение дублируется в globals.css.
const MIN_WIDTH = 375;

// Выставляем тему, размер текста и масштаб до первой отрисовки, чтобы не мигало.
const bootScript = `(function () {
  var d = document.documentElement;
  try {
    var t = localStorage.getItem("bs:theme");
    if (t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches) d.classList.add("dark");
    var s = localStorage.getItem("bs:text");
    if (s) d.dataset.textSize = s;
  } catch (e) {}
  var fit = function () {
    d.style.zoom = "";
    var w = d.clientWidth || screen.width;
    if (w && w < ${MIN_WIDTH}) d.style.zoom = w / ${MIN_WIDTH};
  };
  fit();
  addEventListener("resize", fit);
  addEventListener("orientationchange", fit);
})();`;

export function RootDocument({ language, children }: { language: Language; children: React.ReactNode }) {
  return (
    <html lang={langTag(language)} dir={language.dir} suppressHydrationWarning>
      {/* Это app/-layout, а не pages/: обычный <head> здесь корректен. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className={`${sans.variable} ${serif.variable} ${display.variable} min-h-screen font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
