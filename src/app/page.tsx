"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d4e6cc] to-[#a7cf90] flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-[#93c57c]/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-[#93c57c]/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
      <nav className="absolute top-6 left-6 z-50 flex items-center gap-2">
        <Link href="/">
          <div className="flex items-center gap-2 px-4 py-2">
            <Image
              src="/logo.png"
              alt="Posthuman Logo"
              width={40}
              height={40}
              className="h-10 w-10 filter invert-[10%] sepia-[90%] saturate-[300%] hue-rotate-[60deg]"
            />
            <span className="text-2xl font-semibold text-[#2c4c26]">
              Posthuman
            </span>
          </div>
        </Link>
      </nav>
      <main className="container mx-auto px-4 flex flex-1 items-center justify-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl font-bold leading-tight sm:text-6xl md:text-7xl text-[#2c4c26] mb-6">
            Your Legacy Management Agent
          </h1>
          <p className="mt-6 text-xl text-[#3a6332] mx-auto max-w-2xl">
            Posthumous asset management, will generation, and social memory
            preservation.
          </p>
          <motion.div
            className="mt-12 flex justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Button
              className="px-8 py-4 text-lg bg-[#6b9c5b] text-white hover:from-[#8bb674] hover:to-[#5f8d4f] transition duration-300 rounded-xl shadow-lg"
              onClick={() => router.push("/events")}
            >
              Try it Out!
            </Button>
          </motion.div>
        </motion.div>
      </main>
      <motion.div
        className="absolute bottom-10 left-10 w-20 h-20 bg-gradient-to-br from-[#93c57c] to-[#6b9c5b] rounded-full opacity-50"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 360, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-br from-[#7da56a] to-[#5f8d4f] rounded-full opacity-50"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -360, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
