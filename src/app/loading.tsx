import { ProductGridSkeleton, Skeleton } from "@/components/ui/primitives";

export default function Loading() {
  return (
    <div className="container-x py-10" aria-busy="true">
      <Skeleton className="h-[420px] w-full" />
      <Skeleton className="mt-10 h-12 w-72" />
      <div className="mt-6"><ProductGridSkeleton n={4} /></div>
    </div>
  );
}
