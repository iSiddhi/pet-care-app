// Matches the real card's shape so the layout never jumps when data lands.
export const CardSkeleton = () => (
  <div className="rounded-3xl overflow-hidden bg-cream border border-hairline">
    <div className="aspect-[4/5] shimmer" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-20 rounded-full shimmer" />
      <div className="h-5 w-3/4 rounded-full shimmer" />
      <div className="h-4 w-1/2 rounded-full shimmer" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export default CardSkeleton;
