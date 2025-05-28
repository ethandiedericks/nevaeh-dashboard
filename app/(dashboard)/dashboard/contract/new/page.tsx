import type React from "react";

import AddContract from "@/components/contract/AddContract";

export default function NewContractPage() {
  return (
    <div className="w-full mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Contract</h1>
        <p className="text-gray-600 mt-1">
          Create a new client retainer contract
        </p>
      </div>
      <AddContract />
    </div>
  );
}
