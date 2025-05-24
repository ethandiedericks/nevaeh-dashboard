import { ArrowLeft, SquarePen } from "lucide-react";
import Link from "next/link";

// Mock data - in a real app, this would come from your database
const getContract = (id: string) => {
  const contracts = {
    "1": {
      id: 1,
      title: "Software Development Agreement",
      client: "Acme Corp",
      value: "$50,000",
      status: "Active",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      description:
        "Development of a custom web application with full-stack capabilities including user authentication, data management, and reporting features.",
      terms:
        "Payment terms: Net 30 days. Deliverables include source code, documentation, and 6 months of support. Client retains full ownership of the developed software.",
      createdAt: "2023-12-15",
      lastModified: "2024-01-10",
    },
  };
  return contracts[id as keyof typeof contracts];
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ContractDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const contract = getContract(params.id);

  if (!contract) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Contract not found</h2>
        <p className="mt-2 text-gray-600">
          The contract you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/dashboard/contracts"
          className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to contracts
        </Link>
      </div>
    );
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
              {contract.title}
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
              <dd className="mt-1 text-sm text-gray-900">{contract.client}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Contract Value
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{contract.value}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span
                  className={classNames(
                    "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                    contract.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : contract.status === "Draft" ||
                        contract.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  )}
                >
                  {contract.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Start Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {contract.startDate}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">End Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{contract.endDate}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {contract.createdAt}
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Description
          </h3>
          <p className="text-sm text-gray-700">{contract.description}</p>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Terms and Conditions
          </h3>
          <div className="prose prose-sm text-gray-700">
            <p>{contract.terms}</p>
          </div>
        </div>
      </div>
    </>
  );
}
