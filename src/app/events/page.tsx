"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Clock, MapPin } from "lucide-react";

const events = [
  {
    id: 1,
    name: "Team Meeting",
    date: new Date(2024, 1, 15),
    time: "10:00 AM",
    location: "Conference Room A",
    description: "Weekly sync with the development team",
  },
  {
    id: 2,
    name: "Product Launch",
    date: new Date(2024, 1, 20),
    time: "2:00 PM",
    location: "Main Auditorium",
    description: "New feature release and presentation",
  },
  {
    id: 3,
    name: "Client Workshop",
    date: new Date(2024, 1, 25),
    time: "11:00 AM",
    location: "Virtual Meeting",
    description: "Onboarding session for new clients",
  },
  {
    id: 4,
    name: "Client Workshop",
    date: new Date(2024, 1, 25),
    time: "11:00 AM",
    location: "Virtual Meeting",
    description: "Onboarding session for new clients",
  },
  {
    id: 5,
    name: "Client Workshop",
    date: new Date(2024, 1, 25),
    time: "11:00 AM",
    location: "Virtual Meeting",
    description: "Onboarding session for new clients",
  },
];

export default function EventsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedDateEvents = events.filter(
    (event) => event.date.toDateString() === date?.toDateString()
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <h1 className="text-3xl font-bold">Welcome, John!</h1>
      <h1 className="text-md font-normal mb-8">Schedule your timely events.</h1>
      <div className="max-w-7xl mx-auto p-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
          <Card className="h-min shadow-lg flex items-center justify-center">
            <CardContent className="p-6 w-full flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg w-full max-w-sm flex justify-center mr-4"
                modifiers={{
                  event: (day) =>
                    events.some(
                      (event) =>
                        event.date.toDateString() === day.toDateString()
                    ),
                }}
                modifiersClassNames={{
                  event:
                    "font-medium before:content-[''] before:absolute before:w-1.5 before:h-1.5 before:bg-[#93c57c] before:rounded-full before:top-1 before:left-1/2 before:-translate-x-1/2",
                }}
              />
            </CardContent>
          </Card>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Events on{" "}
                {date?.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <span className="text-sm text-gray-500">
                {selectedDateEvents.length} event
                {selectedDateEvents.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="space-y-6 max-h-96 overflow-y-auto pr-4">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event) => (
                  <Card key={event.id} className="transition-all">
                    <CardContent className="p-0">
                      <div className="bg-[#93c57c] p-4 text-white rounded-t-lg">
                        <h3 className="text-xl font-semibold">{event.name}</h3>
                        <p className="text-sm text-white/90">
                          {event.date.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-[#93c57c]" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-[#93c57c]" />
                          {event.location}
                        </div>
                        <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-gray-50 border-dashed">
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">
                      No events scheduled for this date.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              All Your Events
            </h2>
            <span className="text-sm text-gray-500">
              {events.length} total events
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card
                key={event.id}
                className="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <CardContent className="p-0">
                  <div className="bg-[#93c57c] p-4 text-white rounded-t-lg">
                    <h3 className="text-xl font-semibold">{event.name}</h3>
                    <p className="text-sm text-white/90">
                      {event.date.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-[#93c57c]" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-[#93c57c]" />
                      {event.location}
                    </div>
                    <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
