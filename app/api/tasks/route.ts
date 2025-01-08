import { NextResponse } from "next/server";
import { tasks } from "@/lib/data";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return NextResponse.json(tasks);
}
