import Link from "next/link";
import {
  CheckCircleIcon,
  FileTextIcon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react";
import { SimpleDataTable } from "@/components/simple-data-table";
import { DashboardMetricCard } from "@/components/dashboard-metric-card";
import { getContracts } from "@/app/actions/contracts";

export default async function ContractsPage() {
  const contracts = await getContracts();

  const activeContracts = contracts.filter(
    (contract) => new Date() < new Date(contract.endDate)
  );
  const expiredContracts = contracts.filter(
    (contract) => new Date() >= new Date(contract.endDate)
  );
  const endingSoonContracts = contracts.filter((contract) => {
    const endDate = new Date(contract.endDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return endDate <= thirtyDaysFromNow && endDate > new Date();
  });

  const statsData = [
    {
      title: "Active",
      value: activeContracts.length.toString(),
      icon: CheckCircleIcon,
    },
    {
      title: "Draft",
      value: "0",
      icon: FileTextIcon,
    },
    {
      title: "Ending Soon",
      value: endingSoonContracts.length.toString(),
      icon: ClockIcon,
    },
    {
      title: "Expired",
      value: expiredContracts.length.toString(),
      icon: XCircleIcon,
    },
  ];

  const tableColumns = [
    {
      key: "clientName",
      label: "Contract",
      render: (value: string, row: any) => (
        <Link
          href={`/dashboard/contracts/${row.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-900"
        >
          {value}
        </Link>
      ),
    },
    {
      key: "clientEmail",
      label: "Client Email",
      render: (value: string) => (
        <span className="text-sm text-gray-900">{value}</span>
      ),
    },
    {
      key: "amount",
      label: "Value",
      render: (value: number) => (
        <span className="text-sm text-gray-900">${value.toString()}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string, row: any) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            new Date() < new Date(row.endDate)
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {new Date() < new Date(row.endDate) ? "Active" : "Expired"}
        </span>
      ),
    },
    {
      key: "startDate",
      label: "Start Date",
      render: (value: string) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "endDate",
      label: "End Date",
      render: (value: string) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
        <p className="text-gray-600">
          A list of all contracts including their details, client information,
          and current status.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-8">
        {statsData.map((stat, index) => (
          <DashboardMetricCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Contracts table */}
      <SimpleDataTable
        title="All Contracts"
        data={contracts}
        columns={tableColumns}
        addButton={{
          label: "New contract",
          href: "/dashboard/contracts/new",
        }}
      />
    </>
  );
}
