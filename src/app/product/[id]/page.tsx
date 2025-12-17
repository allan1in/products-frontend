export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex justify-center items-center h-screen font-bold">
      Product {id}
    </div>
  );
}
