import { jobs } from "@/lib/data/jobs";
import JobDetailClient from "./JobDetailClient";

export function generateStaticParams() {
  return jobs.map((j) => ({ id: j.id }));
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <JobDetailClient jobId={id} />;
}
