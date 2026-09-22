export interface Story {
  /** Стабильный id истории, напр. "uz85" */
  id: string;
  /** Порядковый номер истории */
  number: number;
  /** Заголовок */
  title: string;
  /** Ссылка на место в Библии, напр. "Luqo ... 22-bob" */
  reference: string;
  /** Текст истории, разбитый на абзацы */
  paragraphs: string[];
  /** Вопросы для размышления */
  questions: string[];
  /** Имя аудиофайла в /public/audio/<lang>/ */
  audio: string;
  /** Имя картинки в /public/images/ (общая для всех языков) */
  image: string;
}

export interface Language {
  /** ISO-код языка, напр. "uz" */
  code: string;
  /** Название на самом языке */
  name: string;
  /** Название по-английски */
  englishName: string;
  /** Направление письма */
  dir: "ltr" | "rtl";
  /** Язык по умолчанию */
  default?: boolean;
}
