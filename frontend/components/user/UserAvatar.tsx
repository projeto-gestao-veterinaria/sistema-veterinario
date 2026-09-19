import { PawPrint } from "lucide-react";
import Image from "next/image";

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
}

export default function UserAvatar({ name, image }: UserAvatarProps) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface">
      {image ? (
        <Image
          src={image}
          alt={`Foto do usuário ${name ?? ""}`.trim()}
          width={34}
          height={34}
          className="rounded-full object-cover"
        />
      ) : (
        <PawPrint size={20} strokeWidth={2} className="text-slate" aria-hidden />
      )}
    </div>
  );
}
