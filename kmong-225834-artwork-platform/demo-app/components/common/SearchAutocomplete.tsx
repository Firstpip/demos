"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { jobs as allJobs } from "@/lib/data/jobs";
import { categories } from "@/lib/data/categories";
import { JOB_TYPE_OPTIONS } from "@/lib/jobType";

const LOCATIONS = [
  "서울",
  "경기",
  "인천",
  "부산",
  "성남",
  "강남",
  "마포",
  "성수",
  "종로",
  "홍대",
  "파주",
];

type SuggestionKind = "type" | "category" | "location" | "job";
type Suggestion = {
  kind: SuggestionKind;
  label: string;
  hint?: string;
  href: string;
};

const KIND_LABEL: Record<SuggestionKind, string> = {
  type: "타입",
  category: "장르",
  location: "지역",
  job: "공고",
};

export default function SearchAutocomplete({
  size = "md",
  placeholder = "장르·지역·공고 유형으로 검색",
  initialQuery = "",
  containerId,
  inputId,
}: {
  size?: "md" | "lg";
  placeholder?: string;
  initialQuery?: string;
  containerId?: string;
  inputId?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listboxId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);

  const suggestions: Suggestion[] = useMemo(() => {
    const trimmed = q.trim();
    const lower = trimmed.toLowerCase();
    const out: Suggestion[] = [];

    if (!trimmed) {
      JOB_TYPE_OPTIONS.forEach((o) =>
        out.push({
          kind: "type",
          label: `${o.label} 전체 공고`,
          hint: o.description,
          href: `/jobs?type=${o.id}`,
        }),
      );
      categories.slice(0, 3).forEach((c) =>
        out.push({ kind: "category", label: c.name, hint: "장르", href: `/jobs?cat=${c.id}` }),
      );
      return out.slice(0, 7);
    }

    JOB_TYPE_OPTIONS.forEach((o) => {
      if (o.label.toLowerCase().includes(lower) || o.description.toLowerCase().includes(lower)) {
        out.push({
          kind: "type",
          label: `${o.label} 공고 모아보기`,
          hint: o.description,
          href: `/jobs?type=${o.id}`,
        });
      }
    });

    categories.forEach((c) => {
      if (c.name.toLowerCase().includes(lower) || c.slug.includes(lower)) {
        out.push({ kind: "category", label: c.name, hint: "장르", href: `/jobs?cat=${c.id}` });
      }
    });

    LOCATIONS.forEach((l) => {
      if (l.includes(trimmed) || trimmed.includes(l)) {
        out.push({
          kind: "location",
          label: `${l} 지역 공고`,
          hint: "지역",
          href: `/jobs?q=${encodeURIComponent(l)}`,
        });
      }
    });

    allJobs
      .filter((j) => j.status === "approved")
      .forEach((j) => {
        if (j.title.toLowerCase().includes(lower)) {
          out.push({ kind: "job", label: j.title, hint: j.location, href: `/jobs/${j.id}` });
        }
      });

    return dedupe(out).slice(0, 8);
  }, [q]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const submitFreeform = () => {
    setOpen(false);
    if (q.trim()) router.push(`/jobs?q=${encodeURIComponent(q.trim())}`);
    else router.push("/jobs");
  };

  const goTo = (s: Suggestion) => {
    setOpen(false);
    router.push(s.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (open && suggestions[active]) {
        e.preventDefault();
        goTo(suggestions[active]);
        return;
      }
      e.preventDefault();
      submitFreeform();
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(suggestions.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const isLg = size === "lg";
  const inputClass = isLg
    ? "w-full h-14 pl-14 pr-32 rounded-2xl bg-white border border-[var(--color-line)] shadow-sm text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
    : "input pl-10";

  return (
    <div ref={wrapRef} id={containerId} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (open && suggestions[active]) goTo(suggestions[active]);
          else submitFreeform();
        }}
      >
        <Search
          className={`absolute ${isLg ? "left-5" : "left-3"} top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none`}
          size={isLg ? 18 : 16}
        />
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-controls={listboxId}
          aria-expanded={open}
          aria-autocomplete="list"
          aria-activedescendant={open && suggestions[active] ? `${listboxId}-${active}` : undefined}
          placeholder={placeholder}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          aria-label="공고 검색"
          className={inputClass}
        />
        {isLg && (
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-primary btn-md"
          >
            검색
          </button>
        )}
      </form>

      {open && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 bg-white border border-[var(--color-line)] rounded-2xl shadow-lg p-2 z-30 max-h-96 overflow-auto"
        >
          {suggestions.map((s, i) => (
            <li key={`${s.kind}-${s.href}-${i}`}>
              <button
                type="button"
                id={`${listboxId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  goTo(s);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between gap-3 text-sm focus-ring ${i === active ? "bg-[#FFEDE8]" : ""}`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="badge badge-neutral text-[10px] uppercase shrink-0">
                    {KIND_LABEL[s.kind]}
                  </span>
                  <span
                    className={`truncate ${i === active ? "text-[var(--color-primary)] font-semibold" : ""}`}
                  >
                    {s.label}
                  </span>
                </span>
                {s.hint && (
                  <span className="text-xs text-[var(--color-muted)] shrink-0">{s.hint}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function dedupe(items: Suggestion[]): Suggestion[] {
  const seen = new Set<string>();
  return items.filter((s) => {
    const key = `${s.kind}|${s.href}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
