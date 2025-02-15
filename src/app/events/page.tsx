"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Clock, Plus, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const loadEvents = () => {
  if (typeof window !== "undefined") {
    try {
      const storedEvents = localStorage.getItem("events");
      if (storedEvents) {
        return JSON.parse(storedEvents).map((event: any) => ({
          ...event,
          date: new Date(event.date),
        }));
      }
    } catch (error) {
      console.error("Error loading events:", error);
    }
  }
  return [];
};

export default function EventsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [newEvent, setNewEvent] = useState({
    name: "",
    email: "",
    date: new Date(),
    time: "",
    description: "",
  });

  useEffect(() => {
    const storedEvents = loadEvents();
    setEvents(storedEvents);
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events]);

  const selectedDateEvents = events.filter(
    (event: any) =>
      event.date.toDateString() === (date ? date.toDateString() : "")
  );

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    if (!newEvent.name) newErrors.name = "Event name is required";
    if (!newEvent.email) newErrors.email = "Recipient email is required";
    if (!newEvent.time) newErrors.time = "Time is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("One or more required fields are not filled!");
      return false;
    }

    setErrors({});
    return true;
  };

  const handleAddEvent = () => {
    if (!validateForm()) return;

    const [hours, minutes] = newEvent.time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedTime = `${formattedHours}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;

    const newEventObject = {
      id: Date.now(),
      name: newEvent.name,
      email: newEvent.email,
      date: new Date(newEvent.date),
      time: formattedTime,
      description: newEvent.description || "No description provided",
    };

    const updatedEvents = [...events, newEventObject];
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    setNewEvent({
      name: "",
      email: "",
      date: new Date(),
      time: "",
      description: "",
    });
    setErrors({});
    setIsDialogOpen(false);
  };

  const handleDeleteEvent = (eventId: number) => {
    const updatedEvents = events.filter((event: any) => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  return (
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome, Henry Rollins!
        </h1>
        <p className="text-lg text-gray-600">Schedule your timely events.</p>
      </div>
      <div className="max-w-7xl mx-auto p-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
          <Card className="h-min shadow-lg">
            <CardContent className="p-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg justify-center flex mr-4"
                modifiers={{
                  event: (day) =>
                    events.some(
                      (event: any) =>
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
                selectedDateEvents.map((event: any) => (
                  <Card
                    key={event.id}
                    className="transition-all hover:shadow-md"
                  >
                    <CardContent className="p-0">
                      <div className="bg-[#93c57c] p-4 text-white rounded-t-lg flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">
                            {event.name}
                          </h3>
                          <p className="text-sm text-white/90">
                            {event.date.toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-[#93c57c]" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2 text-[#93c57c]" />
                          {event.email}
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
            <h2 className="text-2xl font-bold text-gray-900">All Events</h2>
            <span className="text-sm text-gray-500">
              {events.length} total events
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: any) => (
              <Card
                key={event.id}
                className="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <CardContent className="p-0">
                  <div className="bg-[#93c57c] p-4 text-white rounded-t-lg flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{event.name}</h3>
                      <p className="text-sm text-white/90">
                        {event.date.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-white/80 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-[#93c57c]" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-[#93c57c]" />
                      {event.email}
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
      <button
        className="fixed top-12 right-12 bg-[#93c57c] text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
      </button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg w-full sm:max-w-md mx-auto bg-white rounded-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Event Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter event name"
                  value={newEvent.name}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">
                  Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>
                Recipient <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => {
                  setNewEvent({
                    ...newEvent,
                    email: value === "Other" ? "" : value,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Recipient" />
                </SelectTrigger>
                <SelectContent>
                  {["Jathin", "Jeffrey", "Shivansh", "Agni", "Other"].map(
                    (recipient) => (
                      <SelectItem key={recipient} value={recipient}>
                        {recipient}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            {newEvent.email === "" && (
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter contact email"
                  value={newEvent.email}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, email: e.target.value })
                  }
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>
                Date <span className="text-red-500">*</span>
              </Label>
              <Calendar
                mode="single"
                selected={newEvent.date}
                onSelect={(date) => date && setNewEvent({ ...newEvent, date })}
                className="rounded-md border flex justify-center mr-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter event description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                className="h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddEvent}
              className="bg-[#93c57c] text-white hover:bg-green-600"
            >
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
