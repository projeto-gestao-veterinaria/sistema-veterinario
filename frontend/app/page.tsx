import SearchBar from "@/components/search/SearchBar";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/login">LOGIN</Link>
      <SearchBar placeholder="Teste" />
    </div>
  );
}
