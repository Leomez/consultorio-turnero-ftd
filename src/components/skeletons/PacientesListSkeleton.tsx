import { Skeleton } from '@/components/ui/Skeleton';

export function PacientesListSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center"
        >
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24 hidden md:block" />
          <Skeleton className="h-4 w-20 hidden md:block" />
        </div>
      ))}
    </div>
  );
}
