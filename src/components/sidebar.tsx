"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpenText,
  CalendarDays,
  DollarSign,
  UserIcon,
  LogOut,
} from "lucide-react";

const categories = [
  { name: "Events", icon: CalendarDays, href: "/events" },
  { name: "Will", icon: BookOpenText, href: "/will" },
  { name: "Assets", icon: DollarSign, href: "/assets" },
  { name: "Profile", icon: UserIcon, href: "/profile" },
];

export function Sidebar() {
  const [selectedCategory, setSelectedCategory] = useState("Events");

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-screen">
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
      <nav className="space-y-1 flex-grow">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            onClick={() => setSelectedCategory(category.name)}
            className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors
              ${
                selectedCategory === category.name
                  ? "bg-[#93c57c] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <category.icon className="h-4 w-4" />
            {category.name}
          </Link>
        ))}
      </nav>
      <button className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors text-red-600 hover:bg-red-50 mt-auto">
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </aside>
  );
}
