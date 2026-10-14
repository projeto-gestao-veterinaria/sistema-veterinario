import VacinasContent from "@/components/cards/VacinasContent";

export default async function Vacinas({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";

  return <VacinasContent query={query} />;
}
