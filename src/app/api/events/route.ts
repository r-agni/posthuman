import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const eventsFilePath = path.join(process.cwd(), "public", "events.json");

const loadEvents = () => {
  try {
    if (!fs.existsSync(eventsFilePath)) {
      fs.writeFileSync(eventsFilePath, "[]", "utf8");
    }
    const data = fs.readFileSync(eventsFilePath, "utf8");
    return data.trim() ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading events:", error);
    return [];
  }
};

const saveEvents = (events: any[]) => {
  try {
    fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2));
  } catch (error) {
    console.error("Error writing events:", error);
  }
};

export async function GET() {
  return NextResponse.json(loadEvents(), { status: 200 });
}

export async function POST(req: Request) {
  try {
    const newEvent = await req.json();
    const events = loadEvents();
    events.push(newEvent);
    saveEvents(events);
    return NextResponse.json(
      { message: "Event added", event: newEvent },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding event", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    let events = loadEvents();
    events = events.filter((event: any) => event.id !== id);
    saveEvents(events);
    return NextResponse.json({ message: "Event deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting event", error },
      { status: 500 }
    );
  }
}
