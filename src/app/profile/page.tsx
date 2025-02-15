"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const [integrations, setIntegrations] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("integrations");
      return saved
        ? JSON.parse(saved)
        : { googleSuite: false, iMessage: false };
    }
    return { googleSuite: false, iMessage: false };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("integrations", JSON.stringify(integrations));
    }
  }, [integrations]);

  const handleIntegrationChange = (
    integration: keyof typeof integrations,
    checked: boolean
  ) => {
    setIntegrations((prev: any) => ({ ...prev, [integration]: checked }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Profile</h1>
      <h1 className="text-md font-normal mb-8">
        Manage your account information.
      </h1>
      <Card className="mb-8 shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="rounded-md">
            <p className="text-gray-600 font-normal">
              Name:{" "}
              <span className="font-semibold text-gray-800">John Doe</span>
            </p>
            <p className="text-gray-600 font-normal">
              Email:{" "}
              <span className="font-semibold text-gray-800">
                john.doe@example.com
              </span>
            </p>
            <p className="text-gray-600 font-normal">
              Account Created:{" "}
              <span className="font-semibold text-gray-800">
                January 1, 2023
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
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
        <Card className="flex-1">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                Reset Account
              </Button>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
