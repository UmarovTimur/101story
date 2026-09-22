"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** «Номера вместо поиска»: переход к истории по её номеру. */
export function JumpToNumber({
  id,
  lang,
  ids,
  min,
  max,
  variant = "compact",
  labels,
  labelClassName,
}: {
  id: string;
  lang: string;
  /** номер истории → её id */
  ids: Record<number, string>;
  min: number;
  max: number;
  variant?: "compact" | "wide";
  labels: { input: string; go: string; error: string; hint?: string };
  labelClassName?: string;
}) {
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const [invalid, setInvalid] = React.useState(false);
  const hintId = `${id}-hint`;
  const message = invalid ? labels.error : labels.hint;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(value);
    const target = value && n >= min && n <= max ? ids[n] : undefined;
    if (!target) {
      setInvalid(true);
      return;
    }
    router.push(`/${lang}/${target}/`);
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-2.5">
      <label htmlFor={id} className={labelClassName}>
        {labels.input}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          value={value}
          onChange={(e) => {
            setValue(e.target.value.replace(/\D/g, ""));
            setInvalid(false);
          }}
          inputMode="numeric"
          autoComplete="off"
          placeholder={`${min}–${max}`}
          aria-invalid={invalid || undefined}
          aria-describedby={message ? hintId : undefined}
          className={cn(
            "min-w-0 rounded-lg border border-input bg-card tabular-nums text-sm text-foreground placeholder:text-muted-foreground/80 aria-[invalid]:border-destructive",
            // pt > pb: цифры Nunito сидят выше середины строки
            variant === "compact" ? "flex-1 px-3 pb-2 pt-2.5" : "w-28 px-3.5 pt-0.5"
          )}
        />
        {variant === "compact" ? (
          <button
            type="submit"
            aria-label={labels.go}
            className="grid w-10 flex-none place-items-center rounded-lg border border-input bg-card text-primary transition-colors hover:bg-muted"
          >
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </button>
        ) : (
          <Button type="submit" size="sm" className="h-auto min-h-10">
            <span className="text-optical">{labels.go}</span>
          </Button>
        )}
      </div>
      {message && (
        <p
          id={hintId}
          aria-live="polite"
          className={cn(
            "font-serif text-[12.5px] leading-normal",
            invalid ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {message}
        </p>
      )}
    </form>
  );
}
