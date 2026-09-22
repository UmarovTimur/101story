import { appLinks } from "@/lib/apps";
import { cn } from "@/lib/utils";

const GOOGLE_PLAY_PATH =
  "M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z";
const APPLE_PATH =
  "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701";

const SCREENS = ["/img/promo/1.webp", "/img/promo/2.webp", "/img/promo/3.webp"];

/** Белый бейдж магазина в привычном виде: логотип + «скачать в» + название магазина. */
function StoreBadge({
  href,
  icon,
  caption,
  store,
  compact,
}: {
  href: string;
  icon: string;
  caption: string;
  store: string;
  /** Узкий вариант на всю ширину — для баннера в сайдбаре. */
  compact?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${store}: ${caption}`}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-xl bg-white text-black shadow-[0_1px_2px_rgb(0_0_0/.08)] transition-shadow hover:shadow-[0_4px_14px_rgb(0_0_0/.22)]",
        compact ? "h-10 w-full px-3" : "h-12 w-[158px] px-3.5"
      )}
    >
      <svg viewBox="0 0 24 24" aria-hidden className={cn("flex-none fill-current", compact ? "size-[18px]" : "size-6")}>
        <path d={icon} />
      </svg>
      {/* Строки сидят вплотную, как на настоящих бейджах. Важно: leading-*
          идёт ПОСЛЕ text-[...], иначе tailwind-merge вырежет его как
          конфликтующий с размером шрифта, и вернётся межстрочный 1.5. */}
      <span className="flex min-w-0 flex-col items-start">
        <span className={cn("opacity-75", compact ? "text-[9.5px]" : "text-[10.5px]", "leading-none")}>{caption}</span>
        <span
          className={cn(
            "truncate font-bold tracking-[-.01em]",
            compact ? "text-[13.5px]" : "text-base",
            "leading-tight"
          )}
        >
          {store}
        </span>
      </span>
    </a>
  );
}

/** Скриншот приложения в «корпусе»: бледная рамка и скругления. */
function Screen({ src, alt, className }: { src: string; alt: string; className: string }) {
  return (
    <div
      className={`absolute aspect-[390/838] w-[92px] overflow-hidden rounded-[18px] border-[3px] border-white/70 bg-white/40 shadow-[0_10px_24px_-8px_rgb(80_10_10/.45)] lg:w-[104px] ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- уже нарезанный WebP, оптимизатор не нужен */}
      <img src={src} alt={alt} title={alt} loading="lazy" decoding="async" className="size-full object-cover" />
    </div>
  );
}

/**
 * Промо-баннер мобильных приложений над списком историй:
 * слева заголовок, в центре веер из трёх скриншотов, справа бейджи магазинов.
 * Телефоны «выходят» за нижний край и обрезаются им.
 */
export function AppPromo({
  labels,
}: {
  labels: { title: string; text: string; download: string; screenshot: string };
}) {
  return (
    <section
      aria-labelledby="app-promo-title"
      /* isolate — чтобы z-10/20/30 у телефонов оставались внутренним делом
         баннера и не спорили с прилипающими полосами страницы. */
      className="app-promo relative isolate grid overflow-hidden rounded-2xl lg:h-[216px] lg:grid-cols-[minmax(0,1fr)_236px_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_260px_minmax(0,1fr)]"
    >
      <div className="flex flex-col items-center justify-center gap-2 px-5 pt-6 text-center md:pt-8 lg:px-6 lg:pt-0">
        <h2 id="app-promo-title" className="font-display text-[28px] font-bold leading-[1.05] md:text-[34px]">
          {labels.title}
        </h2>
        <p className="max-w-[30ch] text-[13.5px] leading-snug opacity-85 md:text-sm">{labels.text}</p>
      </div>

      <div className="relative order-last mx-auto h-[172px] w-[236px] lg:order-none lg:h-full lg:w-full">
        <Screen src={SCREENS[0]} alt={`${labels.screenshot} 1`} className="left-[18px] top-[64px] z-30 lg:left-[14px] lg:top-[62px]" />
        <Screen src={SCREENS[1]} alt={`${labels.screenshot} 2`} className="left-[72px] top-[38px] z-20 lg:left-[78px] lg:top-[36px]" />
        <Screen src={SCREENS[2]} alt={`${labels.screenshot} 3`} className="left-[126px] top-[12px] z-10 lg:left-[142px] lg:top-[10px]" />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 px-5 pb-1 pt-4 lg:flex-col lg:gap-2.5 lg:p-0">
        <StoreBadge href={appLinks.googlePlay} icon={GOOGLE_PLAY_PATH} caption={labels.download} store="Google Play" />
        <StoreBadge href={appLinks.appStore} icon={APPLE_PATH} caption={labels.download} store="App Store" />
      </div>
    </section>
  );
}

/**
 * Узкий вариант баннера для сайдбара страницы истории: без веера скриншотов,
 * заголовок и два бейджа магазинов в столбик.
 */
export function AppPromoCompact({
  labels,
}: {
  labels: { title: string; text: string; download: string };
}) {
  return (
    <section aria-labelledby="app-promo-compact-title" className="app-promo flex flex-col gap-3 rounded-xl p-4">
      <div className="flex flex-col gap-1.5">
        <p id="app-promo-compact-title" className="font-display text-[19px] font-bold leading-[1.15]">
          {labels.title}
        </p>
        <p className="text-[12px] leading-snug opacity-85">{labels.text}</p>
      </div>
      <div className="flex flex-col gap-2">
        <StoreBadge href={appLinks.googlePlay} icon={GOOGLE_PLAY_PATH} caption={labels.download} store="Google Play" compact />
        <StoreBadge href={appLinks.appStore} icon={APPLE_PATH} caption={labels.download} store="App Store" compact />
      </div>
    </section>
  );
}
