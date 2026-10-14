import ProntuariosContent from "@/components/cards/ProntuariosContent";

export default async function Prontuarios({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";

  return <ProntuariosContent query={query} />;
}
