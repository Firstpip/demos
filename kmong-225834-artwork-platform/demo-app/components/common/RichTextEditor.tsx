"use client";

import { useEffect, useRef, useState } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Quote, Link as LinkIcon, Heading2, Heading3, Undo, Redo } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  minHeight?: number;
}

const TOOLBAR: { cmd: string; icon: React.ElementType; title: string; arg?: string }[] = [
  { cmd: "formatBlock", arg: "<h2>", icon: Heading2, title: "제목" },
  { cmd: "formatBlock", arg: "<h3>", icon: Heading3, title: "부제목" },
  { cmd: "bold", icon: Bold, title: "굵게" },
  { cmd: "italic", icon: Italic, title: "기울임" },
  { cmd: "underline", icon: Underline, title: "밑줄" },
  { cmd: "insertUnorderedList", icon: List, title: "글머리 기호" },
  { cmd: "insertOrderedList", icon: ListOrdered, title: "번호 매기기" },
  { cmd: "formatBlock", arg: "<blockquote>", icon: Quote, title: "인용" },
  { cmd: "undo", icon: Undo, title: "실행 취소" },
  { cmd: "redo", icon: Redo, title: "다시 실행" },
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "내용을 입력하세요",
  id = "rte-editor",
  minHeight = 200,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [activeMap, setActiveMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  const exec = (cmd: string, arg?: string) => {
    try {
      document.execCommand(cmd, false, arg);
      handleInput();
      setTimeout(updateActive, 0);
      ref.current?.focus();
    } catch {
      // ignore
    }
  };

  const insertLink = () => {
    const url = window.prompt("링크 주소 (https://)");
    if (!url) return;
    exec("createLink", url);
  };

  const updateActive = () => {
    const next: Record<string, boolean> = {};
    TOOLBAR.forEach((t) => {
      if (t.cmd === "formatBlock" || t.cmd === "undo" || t.cmd === "redo") return;
      try {
        next[t.cmd] = document.queryCommandState(t.cmd);
      } catch {
        // ignore
      }
    });
    setActiveMap(next);
  };

  const handleInput = () => {
    if (!ref.current) return;
    onChange(ref.current.innerHTML);
  };

  return (
    <div>
      <div className="rte-toolbar" role="toolbar" aria-label="서식 도구">
        {TOOLBAR.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={`${t.cmd}-${t.arg ?? ""}`}
              type="button"
              className={`rte-btn ${activeMap[t.cmd] ? "active" : ""}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec(t.cmd, t.arg)}
              title={t.title}
              aria-label={t.title}
            >
              <Icon size={14} />
            </button>
          );
        })}
        <button
          type="button"
          className="rte-btn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={insertLink}
          title="링크"
          aria-label="링크 삽입"
        >
          <LinkIcon size={14} />
        </button>
      </div>
      <div
        ref={ref}
        id={id}
        className="rte-body rich-content"
        style={{ minHeight }}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={handleInput}
        onKeyUp={updateActive}
        onMouseUp={updateActive}
        aria-label="상세 설명 입력"
      />
    </div>
  );
}
