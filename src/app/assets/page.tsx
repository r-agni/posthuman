"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const assets = [
  { id: 1, name: "Stocks", value: 50000, percentage: 40 },
  { id: 2, name: "Real Estate", value: 150000, percentage: 30 },
  { id: 3, name: "Cryptocurrency", value: 25000, percentage: 20 },
  { id: 4, name: "Bonds", value: 10000, percentage: 10 },
];

export default function AssetsPage() {
  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold">Assets</h1>
      <h1 className="text-md font-normal mb-8">
        Handle your finances and distributions.
      </h1>
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Total Assets</h2>
          <p className="text-4xl font-bold text-[#93c57c]">
            ${totalAssets.toLocaleString()}
          </p>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assets.map((asset) => (
          <Card key={asset.id}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">{asset.name}</h3>
              <p className="text-2xl font-bold mb-4">
                ${asset.value.toLocaleString()}
              </p>
              <Progress value={asset.percentage} className="h-2 mb-2" />
              <p className="text-sm text-gray-600">
                {asset.percentage}% of portfolio
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
