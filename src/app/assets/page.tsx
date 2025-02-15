"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface Asset {
  id: number;
  name: string;
  value: number;
  percentage: number;
}

export default function AssetsPage() {
  const [uploadedAssets, setUploadedAssets] = useState<Asset[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files?.length) return;
    const file = event.target.files[0];

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      if (!data.accounts) throw new Error("Invalid response from server");

      // Process new assets and calculate percentages
      const newAssets = data.accounts.map((account: any, index: number) => ({
        id: uploadedAssets.length + index + 1,
        name: account.type,
        value: account.balance,
        percentage: 0, // Placeholder for now
      }));

      const updatedAssets = [...uploadedAssets, ...newAssets];
      const totalValue = updatedAssets.reduce(
        (sum, asset) => sum + asset.value,
        0
      );

      const assetsWithPercentages = updatedAssets.map((asset) => ({
        ...asset,
        percentage: totalValue > 0 ? (asset.value / totalValue) * 100 : 0,
      }));

      setUploadedAssets(assetsWithPercentages);
      setUploadedFiles((prev) => [...prev, file.name]);
    } catch (error: any) {
      console.error("Error processing file:", error);
      setError("Failed to process the file. Please try again.");
    }

    setIsProcessing(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Assets</h1>
      <p className="text-md font-normal mb-6">
        Upload your financial statements for automatic classification
      </p>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg border border-red-400">
          {error}
        </div>
      )}

      {/* File Upload */}
      <div className="mb-6 flex items-center space-x-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            {isProcessing ? "Processing..." : "Upload PDF"}
          </Button>
        </label>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Uploaded Files</h2>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Asset Cards */}
      {uploadedAssets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uploadedAssets.map((asset) => (
            <Card key={asset.id}>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">{asset.name}</h3>
                <p className="text-2xl font-bold mb-4">
                  ${asset.value.toLocaleString()}
                </p>
                <Progress value={asset.percentage} className="h-2 mb-2" />
                <p className="text-sm text-gray-600">
                  {asset.percentage.toFixed(1)}% of portfolio
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
