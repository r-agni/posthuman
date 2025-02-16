"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CompanyAsset {
  company_name: string;
  value: number;
}

interface Asset {
  id: number;
  name: string;
  totalValue: number;
  percentage: number;
  companies: CompanyAsset[];
}

const LOCAL_STORAGE_KEYS = {
  ASSETS: "uploadedAssets",
  FILES: "uploadedFiles",
} as const;

const AssetCard = ({
  asset,
  onRemove,
}: {
  asset: Asset;
  onRemove: (name: string) => void;
}) => (
  <Card className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200">
    <div className="bg-[#93c57c] text-white px-4 py-3 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold">{asset.name}</h3>
        <p className="text-sm text-white">
          {asset.percentage.toFixed(1)}% of portfolio
        </p>
      </div>
      <Button
        onClick={() => onRemove(asset.name)}
        className="h-8 w-8 p-0 rounded-full shadow-none"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
    <CardContent className="p-5">
      <div className="mb-3">
        <Progress value={asset.percentage} className="h-2" />
      </div>
      <div className="mt-3">
        <ul className="text-sm text-gray-600 space-y-1">
          {asset.companies.length > 0 ? (
            asset.companies.map((company, index) => (
              <li
                key={`${asset.id}-${company.company_name}-${index}`}
                className="flex justify-between"
              >
                <span>{company.company_name}</span>
                <span className="font-semibold">
                  ${company.value.toLocaleString()}
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic">
              No company data available
            </p>
          )}
        </ul>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-300">
        <div className="flex justify-between">
          <span>Total</span>
          <span className="text-sm text-black font-semibold">
            ${asset.totalValue.toLocaleString()}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const FileItem = ({
  fileName,
  onRemove,
}: {
  fileName: string;
  onRemove: (name: string) => void;
}) => (
  <Card className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200">
    <CardContent className="p-5 flex items-center justify-between">
      <div className="flex items-center">
        <FileText className="h-4 w-4 text-gray-600 mr-2" />
        <span className="text-gray-700">{fileName}</span>
      </div>
      <Button
        onClick={() => onRemove(fileName)}
        className="h-8 w-8 p-0 rounded-full"
        variant="ghost"
      >
        <X className="h-5 w-5" />
      </Button>
    </CardContent>
  </Card>
);

const UploadDialog = ({
  isProcessing,
  uploadedFiles,
  error,
  onFileUpload,
  onRemoveFile,
  isOpen,
  setIsOpen,
}: {
  isProcessing: boolean;
  uploadedFiles: string[];
  error: string | null;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (fileName: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const handleLabelClick = () => {
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-[#93c57c] hover:bg-green-600 text-white font-medium rounded-xl"
          onClick={() => setIsOpen(true)}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Financial Statements</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <input
              type="file"
              accept="application/pdf"
              onChange={onFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              onClick={handleLabelClick}
              className="cursor-pointer"
            >
              <Button
                type="button"
                className="bg-[#93c57c] hover:bg-green-600 text-white font-medium rounded-xl"
                disabled={isProcessing}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isProcessing ? "Processing..." : "Choose PDF"}
              </Button>
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Uploaded Files
              </h2>
              <div className="grid gap-4 max-h-[300px] overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <FileItem
                    key={index}
                    fileName={file}
                    onRemove={onRemoveFile}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function AssetsPage() {
  const [uploadedAssets, setUploadedAssets] = useState<Asset[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadStoredData = () => {
      try {
        if (typeof window === "undefined") {
          setIsLoading(false);
          return;
        }

        const storedAssets = localStorage.getItem(LOCAL_STORAGE_KEYS.ASSETS);
        const storedFiles = localStorage.getItem(LOCAL_STORAGE_KEYS.FILES);

        if (storedAssets) {
          try {
            const parsedAssets = JSON.parse(storedAssets);
            if (Array.isArray(parsedAssets)) {
              setUploadedAssets(parsedAssets);
            }
          } catch (e) {
            console.warn("Error parsing assets:", e);
            localStorage.removeItem(LOCAL_STORAGE_KEYS.ASSETS);
          }
        }

        if (storedFiles) {
          try {
            const parsedFiles = JSON.parse(storedFiles);
            if (Array.isArray(parsedFiles)) {
              setUploadedFiles(parsedFiles);
            }
          } catch (e) {
            console.warn("Error parsing files:", e);
            localStorage.removeItem(LOCAL_STORAGE_KEYS.FILES);
          }
        }
      } catch (err) {
        console.error("Error loading from local storage:", err);
        setError("Failed to load saved data. Starting fresh.");
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []);

  useEffect(() => {
    const saveToStorage = () => {
      try {
        if (typeof window === "undefined") return;

        if (uploadedAssets.length > 0) {
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.ASSETS,
            JSON.stringify(uploadedAssets)
          );
        }

        if (uploadedFiles.length > 0) {
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.FILES,
            JSON.stringify(uploadedFiles)
          );
        }
      } catch (err) {
        console.error("Error saving to local storage:", err);
        setError("Failed to save data. Please try again.");
      }
    };

    if (!isLoading) {
      saveToStorage();
    }
  }, [uploadedAssets, uploadedFiles, isLoading]);

  const calculatePercentages = (assets: Asset[]): Asset[] => {
    const totalPortfolioValue = assets.reduce(
      (sum, asset) => sum + asset.totalValue,
      0
    );

    return assets.map((asset) => ({
      ...asset,
      percentage:
        totalPortfolioValue > 0
          ? (asset.totalValue / totalPortfolioValue) * 100
          : 0,
    }));
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) {
      setError("No file selected.");
      return;
    }

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

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();

      if (!data.accounts || !Array.isArray(data.accounts)) {
        throw new Error("Invalid response format from server");
      }

      setUploadedAssets((prevAssets) => {
        let updatedAssets = [...prevAssets];

        data.accounts.forEach((account: any) => {
          const { type, company_name, balance } = account;

          const existingAssetIndex = updatedAssets.findIndex(
            (asset) => asset.name === type
          );

          if (existingAssetIndex !== -1) {
            const existingAsset = updatedAssets[existingAssetIndex];
            const existingCompanyIndex = existingAsset.companies.findIndex(
              (c) => c.company_name === company_name
            );

            if (existingCompanyIndex !== -1) {
              existingAsset.companies[existingCompanyIndex].value += balance;
              existingAsset.totalValue += balance;
            } else {
              existingAsset.companies.push({ company_name, value: balance });
              existingAsset.totalValue += balance;
            }
          } else {
            updatedAssets.push({
              id: Date.now() + Math.random(),
              name: type,
              totalValue: balance,
              percentage: 0,
              companies: [{ company_name, value: balance }],
            });
          }
        });

        return calculatePercentages(updatedAssets);
      });

      setUploadedFiles((prevFiles) => [...prevFiles, file.name]);
      setIsDialogOpen(false);
    } catch (error: any) {
      setError(
        error.message || "Failed to process the file. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const removeAsset = (assetName: string) => {
    setUploadedAssets((prevAssets) => {
      const updatedAssets = prevAssets.filter(
        (asset) => asset.name !== assetName
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.ASSETS,
        JSON.stringify(updatedAssets)
      );
      return updatedAssets;
    });
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file !== fileName);
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FILES,
        JSON.stringify(updatedFiles)
      );
      return updatedFiles;
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Assets</h1>
        <p className="text-md text-gray-600 mt-2">
          Upload your finances for automatic classification.
        </p>
      </div>
      <div className="mb-8">
        <UploadDialog
          isProcessing={isProcessing}
          uploadedFiles={uploadedFiles}
          error={error}
          onFileUpload={handleFileUpload}
          onRemoveFile={removeFile}
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
        />
      </div>

      {uploadedAssets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uploadedAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} onRemove={removeAsset} />
          ))}
        </div>
      )}
    </div>
  );
}
