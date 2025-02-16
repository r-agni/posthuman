import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file)
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const filePath = path.join(process.cwd(), "server", "assets", file.name);
  const fileBuffer = await file.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(fileBuffer));

  return NextResponse.json({ filePath: `/server/assets/${file.name}` });
}
