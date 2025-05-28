"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import { CalendarIcon } from "lucide-react";

import { uploadContractPdf } from "@/app/actions/upload";
import { editContract } from "@/app/actions/contract";

import { FileUpload } from "@/components/file-upload";
import { CustomButton } from "@/components/custom-button";

// Define the contract type based on your database schema
interface Contract {
  id: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  contractPdfUrl?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  signedDate?: Date | string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
  // Include related data if needed
  payments?: unknown[];
  invoices?: unknown[];
}

// Define the update data type
interface ContractUpdateData {
  clientName: string;
  clientEmail: string;
  amount: number;
  contractPdfUrl: string;
  startDate?: string;
  endDate?: string;
  signedDate?: string;
}

export default function ContractEditForm({ contract }: { contract: Contract }) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (file: File) => setSelectedFile(file);

  // Helper function to format date for input field
  const formatDateForInput = (date: Date | string | undefined): string => {
    if (!date) return "";
    const dateObj = new Date(date);
    return dateObj.toISOString().split("T")[0];
  };

  const clientAction = async (formData: FormData) => {
    setIsUploading(true);

    try {
      let pdfUrl = contract.contractPdfUrl || "";

      if (selectedFile) {
        const uploadResult = await uploadContractPdf(selectedFile);
        if (uploadResult.error || !uploadResult.url) {
          toast.error(uploadResult.error || "PDF upload failed.");
          return;
        }
        pdfUrl = uploadResult.url;
      }

      const updatedData: ContractUpdateData = {
        clientName: formData.get("clientName") as string,
        clientEmail: formData.get("clientEmail") as string,
        amount: parseFloat(formData.get("contractAmount") as string),
        contractPdfUrl: pdfUrl,
      };

      // Conditionally add dates if present
      const startDate = formData.get("startDate") as string;
      const endDate = formData.get("endDate") as string;
      const signedDate = formData.get("signedDate") as string;

      if (startDate) updatedData.startDate = new Date(startDate).toISOString();
      if (endDate) updatedData.endDate = new Date(endDate).toISOString();
      if (signedDate)
        updatedData.signedDate = new Date(signedDate).toISOString();

      const result = await editContract(contract.id, updatedData);

      if (result.success) {
        toast.success("Contract updated successfully!");
        router.push("/dashboard/contract");
      } else {
        toast.error(result.error || "Failed to update contract.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full mx-auto">
      <form action={clientAction} className="space-y-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Contract
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Update the contract information and upload a new PDF if needed.
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="clientName" className="form-label">
                  Client Name
                </label>
                <input
                  type="text"
                  name="clientName"
                  defaultValue={contract.clientName}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label htmlFor="clientEmail" className="form-label">
                  Client Email
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  defaultValue={contract.clientEmail}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="contractAmount" className="form-label">
                Contract Amount ($)
              </label>
              <input
                type="number"
                name="contractAmount"
                step={0.01}
                defaultValue={contract.amount}
                className="form-input"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  field: "startDate",
                  label: "Start Date",
                  value: contract.startDate,
                },
                {
                  field: "endDate",
                  label: "End Date",
                  value: contract.endDate,
                },
                {
                  field: "signedDate",
                  label: "Signed Date",
                  value: contract.signedDate,
                },
              ].map(({ field, label, value }) => (
                <div key={field}>
                  <label htmlFor={field} className="form-label">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name={field}
                      defaultValue={formatDateForInput(value)}
                      className="form-input pr-10"
                    />
                    <CalendarIcon className="calendar-icon" />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="form-label">Replace Contract PDF</label>
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".pdf"
                maxSize={10}
              />
              {selectedFile ? (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {selectedFile.name}
                </p>
              ) : contract.contractPdfUrl ? (
                <a
                  href={contract.contractPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 mt-2 underline"
                >
                  View current PDF
                </a>
              ) : null}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <Link href="/dashboard/contract">
              <CustomButton variant="outline">Cancel</CustomButton>
            </Link>
            <CustomButton
              type="submit"
              variant="primary"
              disabled={isUploading}
            >
              {isUploading ? "Saving..." : "Update Contract"}
            </CustomButton>
          </div>
        </div>
      </form>
    </div>
  );
}
