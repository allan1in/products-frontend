export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col flex-1 p-4 transition">
      <div className="bg-gray-200 aspect-square w-full rounded-md animate-pulse">
      </div>
      <div className="flex flex-col w-full">
        <div className="font-bold bg-gray-200 my-3 h-(--text-sm) w-[70%] rounded-xl animate-pulse"></div>
        <div className="bg-gray-200 h-(--text-sm) w-[30%] rounded-xl animate-pulse"></div>
      </div>
    </div>
  );
}
