"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Plus, X } from "lucide-react";
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

const loadContacts = () => {
  if (typeof window !== "undefined") {
    try {
      const storedContacts = localStorage.getItem("contacts");
      if (storedContacts) {
        return JSON.parse(storedContacts);
      }
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
  }
  return {};
};

export default function EventsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [contacts, setContacts] = useState<{ [key: string]: any }>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [newEvent, setNewEvent] = useState({
    name: "",
    person: "",
    email: "",
    datetime: "",
    message: "",
    imagePath: "",
  });

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(() => {
      fetchEvents();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(
        data.map((event: any) => ({
          ...event,
          datetime: new Date(event.datetime),
        }))
      );
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  useEffect(() => {
    setContacts(loadContacts());
  }, []);

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    if (!newEvent.name) newErrors.name = "Event name is required";
    if (!newEvent.email) newErrors.email = "Recipient email is required";
    if (!newEvent.datetime) newErrors.time = "Time is required";
    if (!imageFile) newErrors.image = "Image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("One or more required fields are not filled!");
      return false;
    }

    setErrors({});
    return true;
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await fetch("/api/upload-pic", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Image upload failed");
      const data = await response.json();
      return data.filePath;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleAddEvent = async () => {
    if (!validateForm()) return;

    const imagePath = await handleImageUpload();
    if (!imagePath) return;

    const newEventObject = {
      id: Date.now(),
      name: newEvent.name,
      person: newEvent.person || "",
      email: newEvent.email,
      datetime: new Date(newEvent.datetime).toISOString(),
      message: newEvent.message || "No message provided",
      imagePath,
    };

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEventObject),
      });
      if (!response.ok) throw new Error("Failed to add event");
      setEvents((prev) => [...prev, newEventObject]);
    } catch (error) {
      console.error("Error adding event:", error);
    }

    setNewEvent({
      name: "",
      email: "",
      person: "",
      datetime: "",
      message: "",
      imagePath: "",
    });
    setImageFile(null);
    setErrors({});
    setIsDialogOpen(false);
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      const response = await fetch("/api/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventId }),
      });
      if (!response.ok) throw new Error("Failed to delete event");
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const selectedDateEvents = events.filter((event) => {
    const eventDateLocal = new Date(event.datetime).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    );
    const selectedDateLocal = date
      ? date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "";
    return eventDateLocal === selectedDateLocal;
  });

  return (
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome, Jeffrey Gong!
        </h1>
        <p className="text-lg text-gray-600">Schedule memorable events.</p>
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
                        new Date(event.date).toDateString() ===
                        day.toDateString()
                    ),
                }}
                modifiersClassNames={{
                  event:
                    "font-medium before:content-[''] before:absolute before:w-3.5 before:h-1 before:bg-[#93c57c] before:rounded-full before:translate-y-3 before:left-1/2 before:-translate-x-1/2",
                }}
              />
            </CardContent>
          </Card>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Events on{" "}
                {date
                  ? new Date(date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })
                  : "No date selected"}
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
                            {new Date(event.datetime).toLocaleString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                          <div className="flex items-center text-sm mt-4 text-white">
                            {event.email}
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {event.message}
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
                        {new Date(event.datetime).toLocaleTimeString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                      <div className="flex items-center text-sm text-white mt-4">
                        {event.email}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-white/80 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {event.message}
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
            <div>
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
            </div>
            <div className="space-y-2">
              <Label>Date & Time </Label>
              <span className="text-red-500">*</span>
              <Input
                type="datetime-local"
                value={newEvent.datetime}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, datetime: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Recipient </Label>
              <span className="text-red-500">*</span>
              <Select
                onValueChange={(value) => {
                  setNewEvent({
                    ...newEvent,
                    email:
                      value === "Other" ? "" : contacts[value]?.email || "",
                    person: value === "Other" ? "" : value,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Recipient" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(contacts).map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
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
              <Label htmlFor="image">
                Upload Image (JPG) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/jpeg"
                onChange={(e) =>
                  setImageFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter event message"
                value={newEvent.message}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, message: e.target.value })
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
