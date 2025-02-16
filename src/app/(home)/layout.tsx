import { Sidebar } from "@/components/sidebar";

export default function SecondaryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
