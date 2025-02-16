"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
  icon: string;
  link: string;
  login: string;
  password: string;
};

const LOCAL_STORAGE_KEY = "subscriptionsData";

const iconMap: Record<string, React.ReactNode> = {
  newspaper: <Newspaper className="h-5 w-5" />,
  film: <Film className="h-5 w-5" />,
  music: <Music className="h-5 w-5" />,
  shoppingBag: <ShoppingBag className="h-5 w-5" />,
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
  <Card className="mb-4 overflow-hidden relative">
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-6 right-6 text-gray-500 hover:text-gray-700"
      onClick={() => onCancel(subscription.id)}
    >
      <X className="h-5 w-5" />
    </Button>

    <CardContent className="p-0">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-3 rounded-full">
            {iconMap[subscription.icon] || <Plus className="h-5 w-5" />}
          </div>
          <span className="text-md font-medium">{subscription.name}</span>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-800"
            onClick={onToggle}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>
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
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [newSubscription, setNewSubscription] = useState({
    name: "",
    link: "",
    login: "",
    password: "",
    icon: "plus",
  });
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    const savedSubscriptions = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedSubscriptions) {
      try {
        setSubscriptions(JSON.parse(savedSubscriptions));
      } catch (error) {
        console.error("Error parsing subscriptions from local storage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (subscriptions.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(subscriptions));
    }
  }, [subscriptions]);

  const handleToggle = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCancel = (id: string) => {
    const updatedSubscriptions = subscriptions.filter((sub) => sub.id !== id);
    setSubscriptions(updatedSubscriptions);
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(updatedSubscriptions)
    );
  };

  const handleUpdate = (
    id: string,
    field: "link" | "login" | "password",
    value: string
  ) => {
    const updatedSubscriptions = subscriptions.map((sub) =>
      sub.id === id ? { ...sub, [field]: value } : sub
    );
    setSubscriptions(updatedSubscriptions);
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(updatedSubscriptions)
    );
  };

  const handleAddSubscription = () => {
    if (newSubscription.name.trim()) {
      const newId = crypto.randomUUID();
      const newSub = {
        id: newId,
        name: newSubscription.name.trim(),
        icon: newSubscription.icon,
        link: newSubscription.link.trim(),
        login: newSubscription.login.trim(),
        password: newSubscription.password.trim(),
      };
      const updatedSubscriptions = [...subscriptions, newSub];
      setSubscriptions(updatedSubscriptions);
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(updatedSubscriptions)
      );

      setNewSubscription({
        name: "",
        link: "",
        login: "",
        password: "",
        icon: "newspaper",
      });
      setIsAddingNew(false);
      setExpandedIds((prev) => [...prev, newId]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-md text-gray-600 mt-2">
          Manage your recurring subscriptions.
        </p>
      </div>
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
              <Button onClick={handleAddSubscription}>Add Subscription</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setIsAddingNew(true)}
          className="w-48 rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Subscription
        </Button>
      )}
    </div>
  );
}
