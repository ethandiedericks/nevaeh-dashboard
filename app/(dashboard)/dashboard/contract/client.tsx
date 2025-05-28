"use client";

import { useRouter } from "next/navigation";
import { CheckCircleIcon, ClockIcon, XCircleIcon } from "lucide-react";
import { SimpleDataTable } from "@/components/simple-data-table";
import { DashboardMetricCard } from "@/components/dashboard-metric-card";

interface Contract {
  id: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  startDate: Date;
  endDate: Date;
}

interface Props {
  contracts: Contract[];
}

export default function ContractsClientPage({ contracts }: Props) {
  const router = useRouter();

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
      render: (value: string) => (
        <span className="text-sm text-gray-900">{value}</span>
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
      render: (_: string, row: Contract) => (
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
          {new Date(value).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "endDate",
      label: "End Date",
      render: (value: string) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
        <p className="text-gray-600">
          A list of all contracts including their details, client information,
          and current status.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        {statsData.map((stat, index) => (
          <DashboardMetricCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      <SimpleDataTable
        title="All Contracts"
        data={contracts}
        columns={tableColumns}
        addButton={{
          label: "New contract",
          href: "/dashboard/contract/new",
        }}
        onRowClick={(row: Contract) =>
          router.push(`/dashboard/contract/${row.id}`)
        }
      />
    </>
  );
}
