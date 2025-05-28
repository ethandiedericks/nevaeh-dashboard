"use client";

import { deleteContract } from "@/app/actions/contract";
import { ArrowLeft, SquarePen, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Payment = {
  id: string;
  createdAt: Date;
  amountPaid: number;
  paidOn: Date;
  notes: string | null;
  contractId: string;
};

type Invoice = {
  id: string;
  createdAt: Date;
  amount: number;
  notes: string | null;
  contractId: string;
  invoicePdfUrl: string;
  issuedOn: Date;
};

type Contract = {
  id: string;
  clientName: string;
  clientEmail: string;
  contractPdfUrl: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  signedDate: Date;
  createdAt: Date;
  userId: string;
  payments: Payment[];
  invoices: Invoice[];
};

export default function ContractDetailClient({
  contract,
}: {
  contract: Contract;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteContract(contract.id);
    setLoading(false);
    if (result.success) {
      router.push("/dashboard/contract");
    } else {
      alert(result.error || "Failed to delete");
    }
  };
  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/contract"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to contracts
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {contract.clientName}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Contract #{contract.id}
            </p>
          </div>
          <div className="space-x-2">
            <Link
              href={`/dashboard/contract/${contract.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <SquarePen className="h-4 w-4 mr-2" />
              Edit Contract
            </Link>

            <button
              className="inline-flex items-center px-4 py-2 border  shadow-sm text-sm font-medium rounded-md text-gray-50 bg-red-600 hover:bg-red-700 "
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Contract
            </button>
          </div>
        </div>
      </div>
      {open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Are you sure?</h2>
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


      {/* Contract Details */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Client</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {contract.clientName}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Contract Value
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                ${contract.amount.toString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span
                  className={classNames(
                    "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                    new Date() < new Date(contract.endDate)
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  )}
                >
                  {new Date() < new Date(contract.endDate)
                    ? "Active"
                    : "Expired"}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Start Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(contract.startDate).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">End Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(contract.endDate).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(contract.createdAt).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Payments */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Payments
          </h3>
          <div className="space-y-4">
            {contract.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex justify-between items-center border-b pb-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    ${payment.amountPaid.toString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(payment.paidOn).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {payment.notes && (
                  <p className="text-sm text-gray-500">{payment.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Invoices
          </h3>
          <div className="space-y-4">
            {contract.invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex justify-between items-center border-b pb-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    ${invoice.amount.toString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(invoice.issuedOn).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {invoice.notes && (
                  <p className="text-sm text-gray-500">{invoice.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
