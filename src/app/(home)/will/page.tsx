"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Info, Check, Plus, Trash2 } from "lucide-react";

type FormData = {
  personalInfo: {
    fullName: string;
    address: string;
    dob: string;
    maritalStatus: string;
    spouseName: string;
    children: string;
    numChildren: number;
    childrenInfo: { name: string; dob: string }[];
  };
  executors: {
    primary: { name: string; contact: string };
    alternate: { name: string; contact: string };
  };
  beneficiaries: {
    name: string;
    relationship: string;
    asset: string;
    percentage: string;
  }[];
  guardianship: {
    primary: { name: string; contact: string };
    alternate: { name: string; contact: string };
  };
  trusts: { name: string; beneficiary: string; details: string }[];
  specificBequests: { item: string; recipient: string; description: string }[];
  residualEstate: { beneficiary: string; percentage: string };
  finalWishes: {
    medicalDirectives: string;
    organDonation: string;
    funeralPreferences: string;
    burialPreferences: string;
  };
  digitalAssets: {
    socialMedia: string;
    emails: string;
    cryptocurrencies: string;
    onlineAccounts: string;
  };
  pets: { name: string; type: string; caretaker: string }[];
  emergencyContact: { name: string; phone: string; relationship: string };
  witnesses: { name: string; address: string; phone: string }[];
  createdDate: string;
  lastUpdated: string;
  submitted: boolean;
  signature?: string;
};

export default function WillPage() {
  // run if you want to refresh will
  // localStorage.removeItem("willData");
  // localStorage.removeItem("willCompleted");

  const [step, setStep] = useState(1);
  const [willCompleted, setWillCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      fullName: "",
      address: "",
      dob: "",
      maritalStatus: "",
      spouseName: "",
      children: "no",
      numChildren: 0,
      childrenInfo: [],
    },
    executors: {
      primary: { name: "", contact: "" },
      alternate: { name: "", contact: "" },
    },
    beneficiaries: [{ name: "", relationship: "", asset: "", percentage: "" }],
    guardianship: {
      primary: { name: "", contact: "" },
      alternate: { name: "", contact: "" },
    },
    trusts: [{ name: "", beneficiary: "", details: "" }],
    specificBequests: [{ item: "", recipient: "", description: "" }],
    residualEstate: { beneficiary: "", percentage: "" },
    finalWishes: {
      medicalDirectives: "",
      organDonation: "",
      funeralPreferences: "",
      burialPreferences: "",
    },
    digitalAssets: {
      socialMedia: "",
      emails: "",
      cryptocurrencies: "",
      onlineAccounts: "",
    },
    pets: [{ name: "", type: "", caretaker: "" }],
    emergencyContact: { name: "", phone: "", relationship: "" },
    witnesses: [
      { name: "", address: "", phone: "" },
      { name: "", address: "", phone: "" },
    ],
    createdDate: "",
    lastUpdated: "",
    submitted: false,
  });

  useEffect(() => {
    const savedWill = localStorage.getItem("willData");
    const savedStatus = localStorage.getItem("willCompleted");

    if (savedWill) {
      try {
        const parsedData = JSON.parse(savedWill);

        setFormData((prev) => ({
          ...prev,
          ...parsedData,

          beneficiaries: Array.isArray(parsedData.beneficiaries)
            ? parsedData.beneficiaries
            : prev.beneficiaries,

          trusts: Array.isArray(parsedData.trusts)
            ? parsedData.trusts
            : prev.trusts,

          specificBequests: Array.isArray(parsedData.specificBequests)
            ? parsedData.specificBequests
            : prev.specificBequests,

          pets: Array.isArray(parsedData.pets) ? parsedData.pets : prev.pets,

          witnesses: Array.isArray(parsedData.witnesses)
            ? parsedData.witnesses
            : prev.witnesses,
        }));
      } catch (error) {
        console.error("Error parsing stored will data:", error);
        localStorage.removeItem("willData");
      }
    }

    if (savedStatus) {
      setWillCompleted(JSON.parse(savedStatus));
    }
  }, []);

  useEffect(() => {
    const totalSteps = 8;
    const currentProgress = (step / totalSteps) * 100;
    setProgress(currentProgress);
  }, [step]);

  const updateField = (
    section: keyof FormData | "signature",
    field: string,
    value: any
  ) => {
    setFormData((prev) => {
      let updatedFormData;

      if (section === "signature") {
        updatedFormData = { ...prev, signature: value };
      } else if (Array.isArray(prev[section])) {
        updatedFormData = {
          ...prev,
          [section]: value,
        };
      } else if (typeof prev[section] === "object" && prev[section] !== null) {
        updatedFormData = {
          ...prev,
          [section]: {
            ...(prev[section] as Record<string, any>),
            [field]: value,
          },
        };
      } else {
        console.error(`Invalid section: ${section}`);
        return prev;
      }

      localStorage.setItem("willData", JSON.stringify(updatedFormData));
      return updatedFormData;
    });
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const handleSubmit = () => {
    if (!formData.signature) {
      alert("Please sign your name before submitting.");
      return;
    }

    setFormData((prev) => {
      const updatedData = { ...prev, submitted: true };

      localStorage.setItem("willCompleted", "true");
      localStorage.setItem("willData", JSON.stringify(updatedData));

      return updatedData;
    });

    setWillCompleted(true);
  };

  const addItem = (section: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...(prev[section as keyof FormData] as any), {}],
    }));
  };

  const removeItem = (section: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [section]: (prev[section as keyof FormData] as any[]).filter(
        (_, i) => i !== index
      ),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            {formData.submitted
              ? "View Your Last Will & Testament"
              : "Create Your Last Will & Testament"}
          </CardTitle>
          {formData.submitted && (
            <CardDescription className="text-center text-lg text-[#93c57c] font-semibold">
              Completed
            </CardDescription>
          )}
          {!formData.submitted && (
            <CardDescription className="text-center text-lg">
              Step {step} of 8
            </CardDescription>
          )}
          <Progress
            value={formData.submitted ? 100 : progress}
            className="w-full mt-4"
          />
        </CardHeader>

        <CardContent>
          <Tabs value={`step${step}`} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              <TabsTrigger
                value="step1"
                onClick={() => setStep(1)}
                disabled={!formData.submitted && step !== 1}
              >
                Personal
              </TabsTrigger>
              <TabsTrigger
                value="step2"
                onClick={() => setStep(2)}
                disabled={!formData.submitted && step !== 2}
              >
                Family
              </TabsTrigger>
              <TabsTrigger
                value="step3"
                onClick={() => setStep(3)}
                disabled={!formData.submitted && step !== 3}
              >
                Executors
              </TabsTrigger>
              <TabsTrigger
                value="step4"
                onClick={() => setStep(4)}
                disabled={!formData.submitted && step !== 4}
              >
                Assets
              </TabsTrigger>
              <TabsTrigger
                value="step5"
                onClick={() => setStep(5)}
                disabled={!formData.submitted && step !== 5}
              >
                Guardians
              </TabsTrigger>
              <TabsTrigger
                value="step6"
                onClick={() => setStep(6)}
                disabled={!formData.submitted && step !== 6}
              >
                Trusts
              </TabsTrigger>
              <TabsTrigger
                value="step7"
                onClick={() => setStep(7)}
                disabled={!formData.submitted && step !== 7}
              >
                Wishes
              </TabsTrigger>
              <TabsTrigger
                value="step8"
                onClick={() => setStep(8)}
                disabled={!formData.submitted && step !== 8}
              >
                Finalize
              </TabsTrigger>
            </TabsList>

            <TabsContent value="step1">
              <h3 className="text-xl font-semibold mb-4 mt-4">
                Personal Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Your full legal name"
                      value={formData.personalInfo.fullName}
                      onChange={(e) =>
                        updateField("personalInfo", "fullName", e.target.value)
                      }
                      disabled={formData.submitted}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.personalInfo.dob}
                      onChange={(e) =>
                        updateField("personalInfo", "dob", e.target.value)
                      }
                      disabled={formData.submitted}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Your current address"
                    value={formData.personalInfo.address}
                    onChange={(e) =>
                      updateField("personalInfo", "address", e.target.value)
                    }
                    disabled={formData.submitted}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Select
                    onValueChange={(value) =>
                      updateField("personalInfo", "maritalStatus", value)
                    }
                    value={formData.personalInfo.maritalStatus}
                    disabled={formData.submitted}
                  >
                    <SelectTrigger id="maritalStatus">
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="step2">
              <h3 className="text-xl font-semibold mb-4 mt-4">
                Family Information
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="spouseName">Spouse's Full Name</Label>
                  <Input
                    id="spouseName"
                    placeholder="Spouse's full name (if applicable)"
                    value={formData.personalInfo.spouseName}
                    onChange={(e) =>
                      updateField("personalInfo", "spouseName", e.target.value)
                    }
                    disabled={formData.submitted}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="children">Do you have children?</Label>
                  <Select
                    onValueChange={(value) =>
                      updateField("personalInfo", "children", value)
                    }
                    value={formData.personalInfo.children}
                    disabled={formData.submitted}
                  >
                    <SelectTrigger id="children">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.personalInfo.children === "yes" && (
                  <div className="space-y-2">
                    <Label htmlFor="numChildren">Number of Children</Label>
                    <Input
                      id="numChildren"
                      type="number"
                      min="1"
                      value={formData.personalInfo.numChildren}
                      onChange={(e) =>
                        updateField(
                          "personalInfo",
                          "numChildren",
                          Number.parseInt(e.target.value)
                        )
                      }
                      disabled={formData.submitted}
                    />
                    <Label>Children's Information</Label>
                    {Array.from({
                      length: formData.personalInfo.numChildren,
                    }).map((_, index) => (
                      <div key={index} className="space-y-2 mt-2">
                        <Input
                          placeholder={`Child ${index + 1}'s full name`}
                          value={
                            formData.personalInfo.childrenInfo[index]?.name ||
                            ""
                          }
                          onChange={(e) => {
                            const newChildrenInfo = [
                              ...formData.personalInfo.childrenInfo,
                            ];
                            newChildrenInfo[index] = {
                              ...newChildrenInfo[index],
                              name: e.target.value,
                            };
                            updateField(
                              "personalInfo",
                              "childrenInfo",
                              newChildrenInfo
                            );
                          }}
                          disabled={formData.submitted}
                        />
                        <Input
                          type="date"
                          placeholder={`Child ${index + 1}'s date of birth`}
                          value={
                            formData.personalInfo.childrenInfo[index]?.dob || ""
                          }
                          onChange={(e) => {
                            const newChildrenInfo = [
                              ...formData.personalInfo.childrenInfo,
                            ];
                            newChildrenInfo[index] = {
                              ...newChildrenInfo[index],
                              dob: e.target.value,
                            };
                            updateField(
                              "personalInfo",
                              "childrenInfo",
                              newChildrenInfo
                            );
                          }}
                          disabled={formData.submitted}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="step3">
              <h3 className="text-xl font-semibold mb-4 mt-4">
                Executor Details
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="executorName">Primary Executor Name</Label>
                  <Input
                    id="executorName"
                    placeholder="Full name of primary executor"
                    value={formData.executors.primary.name}
                    onChange={(e) =>
                      updateField("executors", "primary", {
                        ...formData.executors.primary,
                        name: e.target.value,
                      })
                    }
                    disabled={formData.submitted}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="executorContact">
                    Primary Executor Contact
                  </Label>
                  <Input
                    id="executorContact"
                    placeholder="Contact information for primary executor"
                    value={formData.executors.primary.contact}
                    onChange={(e) =>
                      updateField("executors", "primary", {
                        ...formData.executors.primary,
                        contact: e.target.value,
                      })
                    }
                    disabled={formData.submitted}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternateExecutorName">
                    Alternate Executor Name
                  </Label>
                  <Input
                    id="alternateExecutorName"
                    placeholder="Full name of alternate executor"
                    value={formData.executors.alternate.name}
                    onChange={(e) =>
                      updateField("executors", "alternate", {
                        ...formData.executors.alternate,
                        name: e.target.value,
                      })
                    }
                    disabled={formData.submitted}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternateExecutorContact">
                    Alternate Executor Contact
                  </Label>
                  <Input
                    id="alternateExecutorContact"
                    placeholder="Contact information for alternate executor"
                    value={formData.executors.alternate.contact}
                    onChange={(e) =>
                      updateField("executors", "alternate", {
                        ...formData.executors.alternate,
                        contact: e.target.value,
                      })
                    }
                    disabled={formData.submitted}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="step4">
              <h3 className="text-xl font-semibold mb-4 mt-4">
                Assets & Beneficiaries
              </h3>
              <div className="space-y-4">
                {formData.beneficiaries.map((beneficiary, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-md">
                    <Label>Beneficiary {index + 1}</Label>
                    <Input
                      placeholder="Beneficiary Name"
                      value={beneficiary.name}
                      onChange={(e) => {
                        const newBeneficiaries = [...formData.beneficiaries];
                        newBeneficiaries[index] = {
                          ...newBeneficiaries[index],
                          name: e.target.value,
                        };
                        updateField("beneficiaries", "", newBeneficiaries);
                      }}
                      disabled={formData.submitted}
                    />
                    <Input
                      placeholder="Relationship"
                      value={beneficiary.relationship}
                      onChange={(e) => {
                        const newBeneficiaries = [...formData.beneficiaries];
                        newBeneficiaries[index] = {
                          ...newBeneficiaries[index],
                          relationship: e.target.value,
                        };
                        updateField("beneficiaries", "", newBeneficiaries);
                      }}
                      disabled={formData.submitted}
                    />
                    <Input
                      placeholder="Asset"
                      value={beneficiary.asset}
                      onChange={(e) => {
                        const newBeneficiaries = [...formData.beneficiaries];
                        newBeneficiaries[index] = {
                          ...newBeneficiaries[index],
                          asset: e.target.value,
                        };
                        updateField("beneficiaries", "", newBeneficiaries);
                      }}
                      disabled={formData.submitted}
                    />
                    <Input
                      placeholder="Percentage"
                      value={beneficiary.percentage}
                      onChange={(e) => {
                        const newBeneficiaries = [...formData.beneficiaries];
                        newBeneficiaries[index] = {
                          ...newBeneficiaries[index],
                          percentage: e.target.value,
                        };
                        updateField("beneficiaries", "", newBeneficiaries);
                      }}
                      disabled={formData.submitted}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem("beneficiaries", index)}
                      disabled={formData.submitted}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Remove Beneficiary
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() => addItem("beneficiaries")}
                  disabled={formData.submitted}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Beneficiary
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="step5">
              <h3 className="text-xl font-semibold mb-4 mt-4">Guardianship</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guardianName">Primary Guardian Name</Label>
                  <Input
                    id="guardianName"
                    placeholder="Full name of primary guardian"
                    value={formData.guardianship.primary.name}
                    onChange={(e) =>
                      updateField("guardianship", "primary", {
                        ...formData.guardianship.primary,
                        name: e.target.value,
                      })
                    }
                    disabled={formData.submitted}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardianContact">
                    Primary Guardian Contact
                  </Label>
                  <Input
                    id="guardianContact"
                    placeholder="Contact information for primary guardian"
                    value={formData.guardianship.primary.contact}
                    onChange={(e) =>
                      updateField("guardianship", "primary", {
                        ...formData.guardianship.primary,
                        contact: e.target.value,
                      })
                    }
                    disabled={formData.submitted}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternateGuardianName">
                    Alternate Guardian Name
                  </Label>
                  <Input
                    id="alternateGuardianName"
                    placeholder="Full name of alternate guardian"
                    value={formData.guardianship.alternate.name}
                    onChange={(e) =>
                      updateField("guardianship", "alternate", {
                        ...formData.guardianship.alternate,
                        name: e.target.value,
                      })
                    }
                    disabled={formData.submitted}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternateGuardianContact">
                    Alternate Guardian Contact
                  </Label>
                  <Input
                    id="alternateGuardianContact"
                    placeholder="Contact information for alternate guardian"
                    value={formData.guardianship.alternate.contact}
                    onChange={(e) =>
                      updateField("guardianship", "alternate", {
                        ...formData.guardianship.alternate,
                        contact: e.target.value,
                      })
                    }
                    disabled={formData.submitted}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="step6">
              <h3 className="text-xl font-semibold mb-4 mt-4">Trusts</h3>
              <div className="space-y-4">
                {formData.trusts.map((trust, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-md">
                    <Label>Trust {index + 1}</Label>
                    <Input
                      placeholder="Trust Name"
                      value={trust.name}
                      onChange={(e) => {
                        const newTrusts = [...formData.trusts];
                        newTrusts[index] = {
                          ...newTrusts[index],
                          name: e.target.value,
                        };
                        updateField("trusts", "", newTrusts);
                      }}
                      disabled={formData.submitted}
                    />
                    <Input
                      placeholder="Beneficiary"
                      value={trust.beneficiary}
                      onChange={(e) => {
                        const newTrusts = [...formData.trusts];
                        newTrusts[index] = {
                          ...newTrusts[index],
                          beneficiary: e.target.value,
                        };
                        updateField("trusts", "", newTrusts);
                      }}
                      disabled={formData.submitted}
                    />
                    <Textarea
                      placeholder="Trust Details"
                      value={trust.details}
                      onChange={(e) => {
                        const newTrusts = [...formData.trusts];
                        newTrusts[index] = {
                          ...newTrusts[index],
                          details: e.target.value,
                        };
                        updateField("trusts", "", newTrusts);
                      }}
                      disabled={formData.submitted}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem("trusts", index)}
                      disabled={formData.submitted}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Remove Trust
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() => addItem("trusts")}
                  disabled={formData.submitted}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Trust
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="step7">
              <h3 className="text-xl font-semibold mb-4 mt-4">Final Wishes</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="medicalDirectives">Medical Directives</Label>
                  <Textarea
                    id="medicalDirectives"
                    placeholder="Your medical directives and preferences"
                    value={formData.finalWishes.medicalDirectives}
                    onChange={(e) =>
                      updateField(
                        "finalWishes",
                        "medicalDirectives",
                        e.target.value
                      )
                    }
                    disabled={formData.submitted}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organDonation">
                    Organ Donation Preferences
                  </Label>
                  <Textarea
                    id="organDonation"
                    placeholder="Your organ donation preferences"
                    value={formData.finalWishes.organDonation}
                    onChange={(e) =>
                      updateField(
                        "finalWishes",
                        "organDonation",
                        e.target.value
                      )
                    }
                    disabled={formData.submitted}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="funeralPreferences">
                    Funeral Preferences
                  </Label>
                  <Textarea
                    id="funeralPreferences"
                    placeholder="Your funeral preferences"
                    value={formData.finalWishes.funeralPreferences}
                    onChange={(e) =>
                      updateField(
                        "finalWishes",
                        "funeralPreferences",
                        e.target.value
                      )
                    }
                    disabled={formData.submitted}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="burialPreferences">Burial Preferences</Label>
                  <Textarea
                    id="burialPreferences"
                    placeholder="Your burial preferences"
                    value={formData.finalWishes.burialPreferences}
                    onChange={(e) =>
                      updateField(
                        "finalWishes",
                        "burialPreferences",
                        e.target.value
                      )
                    }
                    disabled={formData.submitted}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="step8">
              <h3 className="text-xl font-semibold mb-4 mt-4">
                Finalize Your Will
              </h3>
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    {formData.submitted
                      ? "Your will has been finalized. Please ensure you have printed and signed the document in the presence of witnesses."
                      : "Please review all the information you've provided before finalizing your will. Once finalized, you should print and sign the document in the presence of witnesses."}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="signature">Your Signature</Label>
                  <Input
                    id="signature"
                    placeholder="Type your full name as a signature"
                    value={formData.signature || ""}
                    onChange={(e) =>
                      updateField("signature", "", e.target.value)
                    }
                    disabled={formData.submitted}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="witnesses">Witnesses</Label>
                  {formData.witnesses.map((witness, index) => (
                    <div
                      key={index}
                      className="space-y-2 p-4 border rounded-md"
                    >
                      <Input
                        placeholder={`Witness ${index + 1} Name`}
                        value={witness.name}
                        onChange={(e) => {
                          const newWitnesses = [...formData.witnesses];
                          newWitnesses[index] = {
                            ...newWitnesses[index],
                            name: e.target.value,
                          };
                          updateField("witnesses", "", newWitnesses);
                        }}
                        disabled={formData.submitted}
                      />
                      <Input
                        placeholder={`Witness ${index + 1} Address`}
                        value={witness.address}
                        onChange={(e) => {
                          const newWitnesses = [...formData.witnesses];
                          newWitnesses[index] = {
                            ...newWitnesses[index],
                            address: e.target.value,
                          };
                          updateField("witnesses", "", newWitnesses);
                        }}
                        disabled={formData.submitted}
                      />
                      <Input
                        placeholder={`Witness ${index + 1} Phone`}
                        value={witness.phone}
                        onChange={(e) => {
                          const newWitnesses = [...formData.witnesses];
                          newWitnesses[index] = {
                            ...newWitnesses[index],
                            phone: e.target.value,
                          };
                          updateField("witnesses", "", newWitnesses);
                        }}
                        disabled={formData.submitted}
                      />
                    </div>
                  ))}
                </div>
                {formData.submitted ? (
                  <div className="text-[#93c57c] font-semibold text-center text-lg">
                    Will Successfully Submitted!
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <Button
                      onClick={handleSubmit}
                      className="w-40 flex items-center justify-center bg-[#93c57c] hover:bg-green-600"
                    >
                      <Check className="w-4 h-4 mr-2" /> Finalize Will
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {!formData.submitted && (
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <Button onClick={handleBack} variant="outline">
                  Previous
                </Button>
              )}
              {step < 8 && (
                <Button onClick={handleNext} className="ml-auto">
                  Next
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
