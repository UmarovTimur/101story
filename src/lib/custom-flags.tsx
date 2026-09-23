import type { ReactNode } from "react";

/**
 * Флаги для языков без юникод-эмодзи страны — цвета сверены с флагами,
 * которые показывает мобильное приложение Bible Mission (источник наших
 * данных) в выборе языка: региональные/этнические флаги вместо гадания.
 */
export const customFlags: Record<string, ReactNode> = {
  // Курдский — флаг Курдистана: красный/белый/зелёный, золотое солнце.
  kmr: (
    <svg viewBox="0 0 20 14" className="size-full">
      <rect width="20" height="14" fill="#ED1C24" />
      <rect y="4.67" width="20" height="4.67" fill="#fff" />
      <rect y="9.33" width="20" height="4.67" fill="#00A651" />
      <circle cx="10" cy="7" r="2.1" fill="#FDB913" />
    </svg>
  ),
  // Якутский — флаг Республики Саха: голубой, белый диск, триколор снизу.
  sah: (
    <svg viewBox="0 0 20 14" className="size-full">
      <rect width="20" height="14" fill="#5CB8E4" />
      <circle cx="7" cy="6" r="3" fill="#fff" />
      <rect y="11" width="20" height="1" fill="#1E3F8B" />
      <rect y="12" width="20" height="1" fill="#fff" />
      <rect y="13" width="20" height="1" fill="#D52B1E" />
    </svg>
  ),
  // Тувинский — флаг Республики Тыва: голубой с жёлтым клином от края.
  tyv: (
    <svg viewBox="0 0 20 14" className="size-full">
      <rect width="20" height="14" fill="#4EA9E0" />
      <polygon points="0,14 9,14 0,4" fill="#fff" />
      <polygon points="0,14 8,14 0,5.5" fill="#F5C518" />
    </svg>
  ),
  // Уйгурский — флаг Кёк-байрак: голубой, белый полумесяц и звезда.
  ug: (
    <svg viewBox="0 0 20 14" className="size-full">
      <rect width="20" height="14" fill="#8FC1E8" />
      <circle cx="7" cy="7" r="4" fill="#fff" />
      <circle cx="8.5" cy="7" r="3.4" fill="#8FC1E8" />
      <polygon
        points="12,5 12.8,7 15,7 13.2,8.2 13.9,10.3 12,9 10.1,10.3 10.8,8.2 9,7 11.2,7"
        fill="#fff"
      />
    </svg>
  ),
  // Калмыцкий — флаг Калмыкии: жёлтый с лотосом.
  xal: (
    <svg viewBox="0 0 20 14" className="size-full">
      <rect width="20" height="14" fill="#FFD100" />
      <circle cx="10" cy="7" r="4" fill="#fff" />
      <circle cx="10" cy="7" r="3" fill="#0072CE" />
    </svg>
  ),
  // Каракалпакский — флаг Каракалпакстана: голубой/жёлтый/зелёный, полумесяц.
  kaa: (
    <svg viewBox="0 0 20 14" className="size-full">
      <rect width="20" height="4.67" fill="#4EA9E0" />
      <rect y="4.67" width="20" height="4.67" fill="#F5C518" />
      <rect y="9.33" width="20" height="4.67" fill="#3CB043" />
      <circle cx="5" cy="2.3" r="1.5" fill="#fff" />
      <circle cx="5.7" cy="2.3" r="1.2" fill="#4EA9E0" />
    </svg>
  ),
  // Platt (меннонитский нижненемецкий) — зелёный с золотисто-синим крестом.
  pdt: (
    <svg viewBox="0 0 20 14" className="size-full">
      <rect width="20" height="14" fill="#3CA23C" />
      <line x1="0" y1="0" x2="20" y2="14" stroke="#FFD100" strokeWidth="3.4" />
      <line x1="0" y1="14" x2="20" y2="0" stroke="#FFD100" strokeWidth="3.4" />
      <line x1="0" y1="0" x2="20" y2="14" stroke="#3B4CA3" strokeWidth="2" />
      <line x1="0" y1="14" x2="20" y2="0" stroke="#3B4CA3" strokeWidth="2" />
    </svg>
  ),
};
