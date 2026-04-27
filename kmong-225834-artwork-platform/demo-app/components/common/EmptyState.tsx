import Link from "next/link";
import { Inbox } from "lucide-react";

type CtaAction = { label: string; onClick?: () => void; href?: string };

interface Props {
  title: string;
  description?: string;
  cta?: CtaAction;
  secondaryCta?: CtaAction;
  icon?: React.ReactNode;
}

function CtaButton({ action, variant }: { action: CtaAction; variant: "primary" | "outline" }) {
  const cls = `btn btn-${variant} btn-sm`;
  if (action.href) {
    return (
      <Link href={action.href} className={cls}>
        {action.label}
      </Link>
    );
  }
  return (
    <button type="button" onClick={action.onClick} className={cls}>
      {action.label}
    </button>
  );
}

export default function EmptyState({ title, description, cta, secondaryCta, icon }: Props) {
  return (
    <div className="text-center py-16 px-6">
      <div className="mx-auto w-14 h-14 rounded-full bg-[#F3F3EE] grid place-items-center text-[var(--color-muted)]">
        {icon || <Inbox size={22} />}
      </div>
      <h3 className="mt-4 font-semibold text-base">{title}</h3>
      {description && <p className="mt-2 text-sm text-[var(--color-muted)] max-w-md mx-auto">{description}</p>}
      {(cta || secondaryCta) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {cta && <CtaButton action={cta} variant={secondaryCta ? "primary" : "outline"} />}
          {secondaryCta && <CtaButton action={secondaryCta} variant="outline" />}
        </div>
      )}
    </div>
  );
}
