import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex justify-center h-24 items-center max-w-7xl px-4 mx-auto border-b border-border">
      <div className="w-full flex items-center">
        <Image
          src="/assets/logo-badge.svg"
          alt={"Logo PetAssistente"}
          width="72"
          height="72"
        />
        <span className="text-h2 text-deep-teal">PetAssistente</span>
      </div>
      <div>
        <Link
          className="self-center px-8 py-3 rounded-full bg-linear-to-r bg-primary-green-gradient text-white text-xs font-bold tracking-wide hover:opacity-90 transition"
          href="/login"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
