"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CalendarIcon } from "lucide-react";
import { editPayment } from "@/app/actions/payment";

import { CustomButton } from "@/components/custom-button";

interface Payment {
  id: string;
  amountPaid: number;
  paidOn: Date;
  notes: string | null;
  contractId: string;
  contract: {
    clientName: string;
  };
}

interface PaymentUpdateData {
  amountPaid?: number;
  paidOn?: string;
  notes?: string;
  contractId?: string;
}

export default function PaymentEditForm({ payment }: { payment: Payment }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const clientAction = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      const updatedData: PaymentUpdateData = {
        amountPaid: parseFloat(formData.get("amountPaid") as string),
        paidOn: formData.get("paidOn") as string,
        notes: formData.get("notes") as string,
      };

      // Validate amount
      if (isNaN(updatedData.amountPaid!)) {
        toast.error("Invalid payment amount");
        return;
      }

      // Validate date
      if (updatedData.paidOn) {
        const parsedDate = new Date(updatedData.paidOn);
        if (isNaN(parsedDate.getTime())) {
          toast.error("Invalid payment date");
          return;
        }
        updatedData.paidOn = parsedDate.toISOString();
      }

      const result = await editPayment(payment.id, updatedData);

      if (result.success) {
        toast.success("Payment updated successfully!");
        router.push("/dashboard/payment");
      } else {
        toast.error(result.error || "Failed to update payment");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto">
      <form action={clientAction} className="space-y-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Payment
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Update the payment information.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="amountPaid" className="form-label">
                Amount ($)
              </label>
              <input
                type="number"
                name="amountPaid"
                step="0.01"
                defaultValue={payment.amountPaid}
                className="form-input"
                required
              />
            </div>

            <div>
              <label htmlFor="paidOn" className="form-label">
                Payment Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="paidOn"
                  defaultValue={formatDateForInput(new Date(payment.paidOn))}
                  className="form-input pr-10"
                  required
                />
                <CalendarIcon className="calendar-icon" />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="form-label">
                Notes
              </label>
              <textarea
                name="notes"
                defaultValue={payment.notes || ""}
                className="form-input"
                rows={3}
              />
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Contract</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {payment.contract.clientName}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Contract ID</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {payment.contractId}
              </dd>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <Link href="/dashboard/payment">
              <CustomButton variant="outline">Cancel</CustomButton>
            </Link>
            <CustomButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Update Payment"}
            </CustomButton>
          </div>
        </div>
      </form>
    </div>
  );
}
