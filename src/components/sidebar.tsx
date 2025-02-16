"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BookOpenText,
  CalendarDays,
  DollarSign,
  UserIcon,
  MessageCircle,
  Bell,
} from "lucide-react";
import { usePathname } from "next/navigation";

const categories = [
  { name: "Events", icon: CalendarDays, href: "/events" },
  { name: "Will", icon: BookOpenText, href: "/will" },
  { name: "Assets", icon: DollarSign, href: "/assets" },
  { name: "Subscriptions", icon: Bell, href: "/subscriptions" },
  { name: "Chat", icon: MessageCircle, href: "/chat" },
  { name: "Profile", icon: UserIcon, href: "/profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-screen">
      <Link href="/">
        <div className="flex items-center gap-2 mb-8">
          <Image
            src="/logo.png"
            alt="Posthuman Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-xl font-semibold">Posthuman</span>
        </div>
      </Link>
      <nav className="space-y-1 flex-grow">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors
              ${
                pathname === category.href
                  ? "bg-[#93c57c] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <category.icon className="h-4 w-4" />
            {category.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
