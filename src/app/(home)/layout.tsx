"use client";

import { Sidebar } from "@/components/sidebar";
import { useKeepCronAlive } from "@/hooks/cronjob";

export default function SecondaryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useKeepCronAlive();
  return (
    <div>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
