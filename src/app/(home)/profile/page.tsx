"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface Contact {
  email: string;
  relationship: string;
  id: number;
}

export default function ProfilePage() {
  const [integrations, setIntegrations] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("integrations");
      return saved
        ? JSON.parse(saved)
        : { googleSuite: false, iMessage: false, financialDocuments: false };
    }
    return { googleSuite: false, iMessage: false, financialDocuments: false };
  });

  const [contacts, setContacts] = useState<{ [key: string]: Contact }>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("contacts");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [newContact, setNewContact] = useState({
    name: "",
    relationship: "",
    email: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("integrations", JSON.stringify(integrations));
      localStorage.setItem("contacts", JSON.stringify(contacts));
    }
  }, [integrations, contacts]);

  const handleIntegrationChange = (
    integration: keyof typeof integrations,
    checked: boolean
  ) => {
    setIntegrations((prev: any) => ({ ...prev, [integration]: checked }));
  };

  const handleAddContact = () => {
    if (newContact.name.trim() && newContact.email.trim()) {
      setContacts((prevContacts) => ({
        ...prevContacts,
        [newContact.name]: {
          email: newContact.email,
          relationship: newContact.relationship,
          id: Date.now(),
        },
      }));
      setNewContact({ name: "", relationship: "", email: "" });
    }
  };

  const handleRemoveContact = (name: string) => {
    setContacts((prevContacts) => {
      const updatedContacts = { ...prevContacts };
      delete updatedContacts[name];
      return updatedContacts;
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-md text-gray-600 mt-2">
          Manage your account information.
        </p>
      </div>
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="rounded-md">
            <p className="text-gray-600 font-normal">
              Name:{" "}
              <span className="font-medium text-gray-800">Jeffrey Gong</span>
            </p>
            <p className="text-gray-600 font-normal">
              Email:{" "}
              <span className="font-medium text-gray-800">
                jeffrey.gong@gmail.com
              </span>
            </p>
            <p className="text-gray-600 font-normal">
              Account Created:{" "}
              <span className="font-medium text-gray-800">
                February 14th, 2025
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Integrations</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="googleSuite"
                  checked={integrations.googleSuite}
                  onCheckedChange={(checked) =>
                    handleIntegrationChange("googleSuite", !!checked)
                  }
                />
                <Label htmlFor="googleSuite">Google Suite</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="iMessage"
                  checked={integrations.iMessage}
                  onCheckedChange={(checked) =>
                    handleIntegrationChange("iMessage", !!checked)
                  }
                />
                <Label htmlFor="iMessage">iMessage</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="financialDocuments"
                  checked={integrations.financialDocuments}
                  onCheckedChange={(checked) =>
                    handleIntegrationChange("financialDocuments", !!checked)
                  }
                />
                <Label htmlFor="financialDocuments">Financial Documents</Label>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Contact</h2>
            <div className="space-y-4">
              <div className="space-y-3">
                <Input
                  placeholder="Name"
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact({ ...newContact, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Relationship"
                  value={newContact.relationship}
                  onChange={(e) =>
                    setNewContact({
                      ...newContact,
                      relationship: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) =>
                    setNewContact({ ...newContact, email: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleAddContact} className="w-full">
                Add Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {Object.keys(contacts).length > 0 && (
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6">Saved Contacts</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(contacts).map(([name, contact]) => (
                <div
                  key={contact.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900">{name}</p>
                      <p className="text-sm text-gray-600">
                        {contact.relationship || "No Relationship"}
                      </p>
                      <p className="text-sm text-gray-600">{contact.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveContact(name)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
