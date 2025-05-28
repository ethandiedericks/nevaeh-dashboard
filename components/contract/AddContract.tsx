"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { uploadContractPdf } from "@/app/actions/upload";
import { createContract } from "@/app/actions/contract";

import { toast } from "react-toastify";
import { CalendarIcon } from "lucide-react";

import { FileUpload } from "../file-upload";
import { CustomButton } from "../custom-button";

const AddContract = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const clientAction = async (formData: FormData) => {
    if (!selectedFile) {
      toast.error("Please select a contract PDF file.");
      return;
    }

    setIsUploading(true);
    try {
      // Upload file to S3
      const { url, error } = await uploadContractPdf(selectedFile);
      if (error || !url) {
        toast.error(error || "Failed to upload contract PDF.");
        return;
      }

      // Append S3 URL to formData
      formData.append("contractPdfUrl", url);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error: contractError } = await createContract(formData);

      if (contractError) {
        toast.error(contractError);
      } else {
        toast.success("Contract added successfully!");
        router.push("/dashboard/contract");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  return (
    <div className="w-full mx-auto">
      <form action={clientAction} className="space-y-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Contract Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Enter the client and contract information
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="clientName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Client Name
                </label>
                <input
                  type="text"
                  name="clientName"
                  id="clientName"
                  placeholder="Acme Corporation"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="clientEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Client Email
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  id="clientEmail"
                  placeholder="contact@acme.com"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contractAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contract Amount ($)
              </label>
              <input
                type="number"
                name="contractAmount"
                id="contractAmount"
                placeholder="5000"
                step={0.01}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label
                  htmlFor="signedDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Signed Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="signedDate"
                    id="signedDate"
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Contract PDF
              </label>
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".pdf"
                maxSize={10}
              />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notes
              </label>
              <textarea
                name="notes"
                id="notes"
                rows={4}
                placeholder="Additional details about the contract..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
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
              {isUploading ? "Uploading..." : "Create Contract"}
            </CustomButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddContract;
