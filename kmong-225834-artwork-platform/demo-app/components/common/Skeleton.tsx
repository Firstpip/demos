export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-[16/9] skel rounded-none" />
      <div className="p-5 space-y-3">
        <div className="skel h-3 w-20" />
        <div className="skel h-4 w-4/5" />
        <div className="skel h-4 w-2/3" />
        <div className="skel h-6 w-28 mt-3" />
      </div>
    </div>
  );
}

export function SkeletonLine({ width = "100%" }: { width?: string | number }) {
  return <div className="skel h-3" style={{ width }} />;
}

export function SkeletonBlock({ height = 200 }: { height?: number }) {
  return <div className="skel" style={{ height }} />;
}
