"use client";

import { deletePayment } from "@/app/actions/payment";
import { ArrowLeft, SquarePen, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Contract = {
  id: string;
  clientName: string;
};

type Payment = {
  id: string;
  amountPaid: number;
  paidOn: Date;
  notes: string | null;
  contractId: string;
  contract: Contract;
};

export default function PaymentDetailClient({ payment }: { payment: Payment }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deletePayment(payment.id);
    setLoading(false);
    if (result.success) {
      router.push("/dashboard/payment");
    } else {
      alert(result.error || "Failed to delete payment");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/payment"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to payments
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Payment #{payment.id}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              For contract with {payment.contract.clientName}
            </p>
          </div>
          <div className="space-x-2">
            <Link
              href={`/dashboard/payment/${payment.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <SquarePen className="h-4 w-4 mr-2" />
              Edit Payment
            </Link>

            <button
              className="inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md text-gray-50 bg-red-600 hover:bg-red-700"
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Payment
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Amount</dt>
              <dd className="mt-1 text-sm text-gray-900">
                ${payment.amountPaid.toFixed(2)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Payment Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(payment.paidOn).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
              </dd>
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

          {payment.notes && (
            <div className="mt-6">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900">{payment.notes}</dd>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
