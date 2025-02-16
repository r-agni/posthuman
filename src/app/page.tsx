"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
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
        </nav>
      </header>
      <main className="container mx-auto px-4 flex flex-1 items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl md:text-6xl text-gray-800">
            Your <span className="text-[#81ae6d]">Legacy Management Agent</span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-gray-600 mx-auto">
            Posthumous asset management, will generation, social memory
            preservation.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="mt-8 px-8 py-6 text-lg bg-[#7ca768] text-white hover:bg-[#6e945c] transition duration-300 rounded-2xl shadow-lg"
              onClick={() => router.push("/events")}
            >
              Try it Out!
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
