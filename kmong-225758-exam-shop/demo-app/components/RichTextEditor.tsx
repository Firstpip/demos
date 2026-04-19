'use client';

import { useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading2,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Quote,
} from 'lucide-react';

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
};

function isHtml(text: string) {
  return /<[a-z][\s\S]*>/i.test(text);
}

function textToHtml(text: string) {
  if (!text) return '';
  return text
    .split(/\n{2,}/)
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

export default function RichTextEditor({ value, onChange, placeholder, minHeight = 200 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const initial = isHtml(value) ? value : textToHtml(value);
    if (ref.current.innerHTML !== initial) {
      ref.current.innerHTML = initial;
    }
  }, [value]);

  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const onInput = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const insertLink = () => {
    const url = prompt('링크 URL을 입력하세요 (예: https://...)');
    if (url) exec('createLink', url);
  };

  const insertImage = () => {
    const url = prompt('이미지 URL을 입력하세요');
    if (url) exec('insertImage', url);
  };

  const toolbar = [
    { icon: Undo2, label: '실행 취소', onClick: () => exec('undo') },
    { icon: Redo2, label: '다시 실행', onClick: () => exec('redo') },
    { separator: true },
    { icon: Heading2, label: '제목', onClick: () => exec('formatBlock', 'H3') },
    { icon: Bold, label: '굵게', onClick: () => exec('bold') },
    { icon: Italic, label: '기울임', onClick: () => exec('italic') },
    { icon: UnderlineIcon, label: '밑줄', onClick: () => exec('underline') },
    { separator: true },
    { icon: List, label: '글머리 기호', onClick: () => exec('insertUnorderedList') },
    { icon: ListOrdered, label: '번호 매기기', onClick: () => exec('insertOrderedList') },
    { icon: Quote, label: '인용', onClick: () => exec('formatBlock', 'BLOCKQUOTE') },
    { separator: true },
    { icon: LinkIcon, label: '링크', onClick: insertLink },
    { icon: ImageIcon, label: '이미지', onClick: insertImage },
  ];

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden bg-white focus-within:border-[#1B2A4A]">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
        {toolbar.map((t, i) =>
          'separator' in t && t.separator ? (
            <span key={`sep-${i}`} className="mx-1 w-px h-4 bg-gray-300" />
          ) : (
            (() => {
              const Icon = t.icon!;
              return (
                <button
                  key={t.label}
                  type="button"
                  title={t.label}
                  aria-label={t.label}
                  onClick={t.onClick}
                  className="w-7 h-7 flex items-center justify-center rounded text-gray-600 hover:bg-gray-200 hover:text-[#1B2A4A]"
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })()
          )
        )}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={onInput}
        onBlur={onInput}
        data-placeholder={placeholder ?? '내용을 입력하세요...'}
        className="rich-editor px-3 py-2 text-sm leading-relaxed focus:outline-none whitespace-pre-wrap"
        style={{ minHeight }}
      />
      <style jsx>{`
        .rich-editor[contenteditable='true']:empty::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
        .rich-editor :global(h3) {
          font-size: 1.05rem;
          font-weight: 700;
          margin: 0.6em 0 0.3em;
        }
        .rich-editor :global(ul) {
          list-style: disc;
          padding-left: 1.25rem;
          margin: 0.4em 0;
        }
        .rich-editor :global(ol) {
          list-style: decimal;
          padding-left: 1.25rem;
          margin: 0.4em 0;
        }
        .rich-editor :global(blockquote) {
          border-left: 3px solid #cbd5e1;
          padding: 0.2em 0.75em;
          color: #475569;
          margin: 0.4em 0;
        }
        .rich-editor :global(a) {
          color: #1b2a4a;
          text-decoration: underline;
        }
        .rich-editor :global(img) {
          max-width: 100%;
          height: auto;
          margin: 0.4em 0;
          border-radius: 4px;
        }
        .rich-editor :global(p) {
          margin: 0.25em 0;
        }
      `}</style>
    </div>
  );
}
