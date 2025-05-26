import { ArrowLeft, SquarePen } from "lucide-react";
import Link from "next/link";
import { getContract } from "@/app/actions/contracts";
import { notFound } from "next/navigation";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default async function ContractDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const contract = await getContract(params.id);

  if (!contract) {
    notFound();
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/contracts"
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
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <SquarePen className="h-4 w-4 mr-2" />
            Edit Contract
          </button>
        </div>
      </div>

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
                {new Date(contract.startDate).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">End Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(contract.endDate).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(contract.createdAt).toLocaleDateString()}
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
                    {new Date(payment.paidOn).toLocaleDateString()}
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
                    {new Date(invoice.issuedOn).toLocaleDateString()}
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
