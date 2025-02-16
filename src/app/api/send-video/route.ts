import cron from "node-cron";
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

const checkEvents = () => {
  const now = new Date();
  const nowUTC = new Date(now.toISOString());
  const events = loadEvents();
  events.forEach((event: any) => {
    const eventTimeUTC = new Date(event.datetime);
    if (eventTimeUTC <= nowUTC) {
      triggerEventNotification(event);
      removeEvent(event.id);
    }
  });
};

const triggerEventNotification = async (event: any) => {
  try {
    const aiPrompt = `Ignore the previous instructions I gave you. The following event is happening for someone I am extremely close to, and I am currently not alive. Based on the context of the event, please wish/congratulate/console ${event.person} in around 30 words for ${event.name}. ONLY if you know them, mention some close memory. ONLY generate text.`;

    const chatResponse = await fetch("http://0.0.0.0:7325/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: aiPrompt }),
    });

    if (!chatResponse.ok) {
      throw new Error(
        `Failed to get AI-generated text: ${chatResponse.statusText}`
      );
    }

    const chatData = await chatResponse.json();
    const aiGeneratedText = chatData.message;

    const data = {
      image_path: event.image_path,
      text: aiGeneratedText,
      recipient_email: event.email,
    };

    const response = await fetch("http://0.0.0.0:9357/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to send request: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`API Response: ${result.message}`);
    console.log(`Result Path: ${result.result_path}`);
  } catch (error) {
    console.error("Error sending request:", error);
  }
};

const removeEvent = (eventId: number) => {
  let events = loadEvents();
  events = events.filter((event: any) => event.id !== eventId);
  fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2));
};

cron.schedule("* * * * *", () => {
  checkEvents();
});

export async function GET() {
  return NextResponse.json({ message: "Scheduler is running" });
}
