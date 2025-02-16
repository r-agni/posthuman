"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Newspaper,
  Film,
  Music,
  ShoppingBag,
  Plus,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

type Subscription = {
  id: string;
  name: string;
  icon: React.ReactNode;
  link: string;
  login: string;
  password: string;
};

const SubscriptionItem = ({
  subscription,
  isExpanded,
  onToggle,
  onCancel,
  onUpdate,
}: {
  subscription: Subscription;
  isExpanded: boolean;
  onToggle: () => void;
  onCancel: (id: string) => void;
  onUpdate: (
    id: string,
    field: "link" | "login" | "password",
    value: string
  ) => void;
}) => (
  <Card className="mb-4 overflow-hidden">
    <CardContent className="p-0">
      <div
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            {subscription.icon}
          </div>
          <span className="text-lg font-medium">{subscription.name}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-6 w-6" />
        ) : (
          <ChevronDown className="h-6 w-6" />
        )}
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-6 pb-6 space-y-4">
          <Input
            placeholder="Subscription Link"
            value={subscription.link}
            onChange={(e) => onUpdate(subscription.id, "link", e.target.value)}
          />
          <div className="flex gap-4">
            <Input
              placeholder="Login"
              value={subscription.login}
              onChange={(e) =>
                onUpdate(subscription.id, "login", e.target.value)
              }
            />
            <Input
              type="password"
              placeholder="Password"
              value={subscription.password}
              onChange={(e) =>
                onUpdate(subscription.id, "password", e.target.value)
              }
            />
          </div>
          <Button
            variant="destructive"
            onClick={() => onCancel(subscription.id)}
          >
            <X className="h-4 w-4 mr-2" /> Cancel Subscription
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: "1",
      name: "New York Times",
      icon: <Newspaper className="h-6 w-6" />,
      link: "",
      login: "",
      password: "",
    },
    {
      id: "2",
      name: "Netflix",
      icon: <Film className="h-6 w-6" />,
      link: "",
      login: "",
      password: "",
    },
    {
      id: "3",
      name: "Spotify",
      icon: <Music className="h-6 w-6" />,
      link: "",
      login: "",
      password: "",
    },
    {
      id: "4",
      name: "DashPass",
      icon: <ShoppingBag className="h-6 w-6" />,
      link: "",
      login: "",
      password: "",
    },
  ]);

  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [newSubscription, setNewSubscription] = useState({
    name: "",
    link: "",
    login: "",
    password: "",
  });
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleToggle = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCancel = (id: string) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
    setExpandedIds((prev) => prev.filter((i) => i !== id));
  };

  const handleUpdate = (
    id: string,
    field: "link" | "login" | "password",
    value: string
  ) => {
    setSubscriptions(
      subscriptions.map((sub) =>
        sub.id === id ? { ...sub, [field]: value } : sub
      )
    );
  };

  const handleAddSubscription = () => {
    if (newSubscription.name) {
      const newId = (subscriptions.length + 1).toString();
      setSubscriptions([
        ...subscriptions,
        {
          id: newId,
          name: newSubscription.name,
          icon: <Plus className="h-6 w-6" />,
          link: newSubscription.link,
          login: newSubscription.login,
          password: newSubscription.password,
        },
      ]);
      setNewSubscription({ name: "", link: "", login: "", password: "" });
      setIsAddingNew(false);
      setExpandedIds((prev) => [...prev, newId]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Subscriptions</h1>
      <p className="text-lg font-normal mb-8">
        Manage your subscription information.
      </p>

      <div className="space-y-4">
        {subscriptions.map((subscription) => (
          <SubscriptionItem
            key={subscription.id}
            subscription={subscription}
            isExpanded={expandedIds.includes(subscription.id)}
            onToggle={() => handleToggle(subscription.id)}
            onCancel={handleCancel}
            onUpdate={handleUpdate}
          />
        ))}
      </div>

      {isAddingNew ? (
        <Card className="mt-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Add New Subscription
            </h2>
            <div className="space-y-4">
              <Input
                placeholder="Subscription Name"
                value={newSubscription.name}
                onChange={(e) =>
                  setNewSubscription({
                    ...newSubscription,
                    name: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Subscription Link"
                value={newSubscription.link}
                onChange={(e) =>
                  setNewSubscription({
                    ...newSubscription,
                    link: e.target.value,
                  })
                }
              />
              <div className="flex gap-4">
                <Input
                  placeholder="Login"
                  value={newSubscription.login}
                  onChange={(e) =>
                    setNewSubscription({
                      ...newSubscription,
                      login: e.target.value,
                    })
                  }
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={newSubscription.password}
                  onChange={(e) =>
                    setNewSubscription({
                      ...newSubscription,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex gap-4">
                <Button onClick={handleAddSubscription} className="flex-1">
                  <Plus className="h-4 w-4 mr-2" /> Add Subscription
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsAddingNew(true)} className="mt-8 w-full">
          <Plus className="h-4 w-4 mr-2" /> Add New Subscription
        </Button>
      )}
    </div>
  );
}
