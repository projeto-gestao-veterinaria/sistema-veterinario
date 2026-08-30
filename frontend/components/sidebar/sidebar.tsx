"use client";

import { Calendar, Dog, HeartPulse, House, Syringe, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Dashboard", route: "/dashboard", icon: House },
  { label: "Tutores", route: "/tutores", icon: Users },
  { label: "Animais", route: "/animais", icon: Dog },
  { label: "Agendamento", route: "/agendamento", icon: Calendar },
  { label: "Prontuários", route: "/prontuarios", icon: HeartPulse },
  { label: "Vacinas", route: "/vacinas", icon: Syringe },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="fixed flex flex-col py-6 px-4 w-65 h-full rounded-r-2xl border border-border">
      <div className="flex items-center border-b border-border h-16 mb-6">
        <Image
          alt="logo"
          src="/assets/logo-badge.svg"
          width={44}
          height={44}
          className="object-cover"
        />
        <span className="font-outfit font-bold text-h3 text-dark-navy">
          PetAssistente
        </span>
      </div>

      <div>
        <ul className="flex flex-col gap-2">
          {items.map((item) => {
            const active = pathname === item.route;
            const Icon = item.icon;

            return (
              <li key={item.route}>
                <Link
                  href={item.route}
                  className={`text-h4 border rounded-xl py-3 px-4 flex items-center gap-2 ${
                    active
                      ? " border-border text-h4 text-teal font-bold shadow-[inset_6px_0_0_0_var(--color-orange)]"
                      : "border-border text-h4"
                  }`}
                >
                  <Icon
                    size={22}
                    strokeWidth={3}
                    className={active ? "text-teal" : "text-dark-navy"}
                  />

                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
