"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { toast } from "react-toastify";
import { CustomButton } from "@/components/custom-button";
import { createPayment } from "@/app/actions/payment";

interface Contract {
  id: string;
  clientName: string;
}

interface AddPaymentProps {
  contracts: Contract[];
}

export default function AddPayment({ contracts }: AddPaymentProps) {
  const [formData, setFormData] = useState({
    contractId: "",
    contractName: "", // Added to store display name
    paymentAmount: "",
    paymentDate: "",
    notes: "",
  });
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("contract", formData.contractId);
      form.append("paymentAmount", formData.paymentAmount);
      form.append("paymentDate", formData.paymentDate);
      form.append("notes", formData.notes);

      const { error } = await createPayment(form);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Payment recorded successfully!");
        router.push("/dashboard/payment");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (id: string, name: string) => {
    setFormData({
      ...formData,
      contractId: id,
      contractName: name,
    });
    setIsSelectOpen(false);
  };

  return (
    <div className="w-full mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Record Payment</h1>
        <p className="text-gray-600 mt-1">
          Record a payment for a client contract
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Payment Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Enter the payment information
            </p>
          </div>

          <div className="space-y-6">
            {/* Contract Selection */}
            <div>
              <label
                htmlFor="contractId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contract
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                  className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                >
                  <span className="block truncate">
                    {formData.contractName || "Select a contract"}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  </span>
                </button>

                {isSelectOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {contracts.length === 0 ? (
                      <div className="py-2 pl-3 text-gray-500">
                        No contracts available
                      </div>
                    ) : (
                      contracts.map((contract) => (
                        <div
                          key={contract.id}
                          onClick={() =>
                            handleSelectChange(contract.id, contract.clientName)
                          }
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                        >
                          <span className="block truncate">
                            {contract.clientName}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Amount */}
            <div>
              <label
                htmlFor="paymentAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Payment Amount ($)
              </label>
              <input
                type="number"
                name="paymentAmount"
                id="paymentAmount"
                value={formData.paymentAmount}
                onChange={handleChange}
                placeholder="5000"
                step="0.01"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                required
              />
            </div>

            {/* Payment Date */}
            <div>
              <label
                htmlFor="paymentDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Payment Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="paymentDate"
                  id="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  required
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
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
                placeholder="Additional details about the payment..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-8">
            <Link href="/dashboard/payment">
              <CustomButton variant="outline">Cancel</CustomButton>
            </Link>
            <CustomButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Recording..." : "Record Payment"}
            </CustomButton>
          </div>
        </div>
      </form>
    </div>
  );
}
