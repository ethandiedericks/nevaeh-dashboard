"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { CalendarIcon } from "lucide-react";
import { CustomButton } from "@/components/custom-button";
import { FileUpload } from "@/components/file-upload";

export default function NewContractPage() {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    contractAmount: "",
    startDate: "",
    endDate: "",
    signedDate: "",
    notes: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contract data:", formData);
    console.log("Selected file:", selectedFile);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  return (
    <div className="w-full mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Contract</h1>
        <p className="text-gray-600 mt-1">
          Create a new client retainer contract
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contract Details Section */}
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
            {/* Client Name and Email */}
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
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Acme Corporation"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  required
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
                  value={formData.clientEmail}
                  onChange={handleChange}
                  placeholder="contact@acme.com"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Contract Amount */}
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
                value={formData.contractAmount}
                onChange={handleChange}
                placeholder="5000"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                required
              />
            </div>

            {/* Dates */}
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
                    value={formData.startDate}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    required
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
                    value={formData.endDate}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    required
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
                    value={formData.signedDate}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    required
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Contract PDF Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Contract PDF
              </label>
              <FileUpload onFileSelect={handleFileSelect} />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            {/* Notes */}
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
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional details about the contract..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-8">
            <Link href="/dashboard/contracts">
              <CustomButton variant="outline">Cancel</CustomButton>
            </Link>
            <CustomButton type="submit" variant="primary">
              Create Contract
            </CustomButton>
          </div>
        </div>
      </form>
    </div>
  );
}
