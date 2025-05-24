import Link from "next/link";
import {
  CheckCircleIcon,
  FileTextIcon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react";
import { SimpleDataTable } from "@/components/simple-data-table";
import { DashboardMetricCard } from "@/components/dashboard-metric-card";

const statsData = [
  {
    title: "Active",
    value: "2",
    icon: CheckCircleIcon,
  },
  {
    title: "Draft",
    value: "1",
    icon: FileTextIcon,
  },
  {
    title: "Pending",
    value: "1",
    icon: ClockIcon,
  },
  {
    title: "Expired",
    value: "1",
    icon: XCircleIcon,
  },
];

const contractsData = [
  {
    id: 1,
    title: "Software Development Agreement",
    client: "Acme Corp",
    value: "$50,000",
    status: "Active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  },
  {
    id: 2,
    title: "Consulting Services Contract",
    client: "Tech Solutions",
    value: "$25,000",
    status: "Draft",
    startDate: "2024-02-01",
    endDate: "2024-08-01",
  },
  {
    id: 3,
    title: "Maintenance Agreement",
    client: "Global Industries",
    value: "$15,000",
    status: "Expired",
    startDate: "2023-06-01",
    endDate: "2024-01-01",
  },
  {
    id: 4,
    title: "Design Services Contract",
    client: "StartupXYZ",
    value: "$30,000",
    status: "Active",
    startDate: "2024-01-15",
    endDate: "2024-07-15",
  },
  {
    id: 5,
    title: "Support Agreement",
    client: "Enterprise Ltd",
    value: "$40,000",
    status: "Pending",
    startDate: "2024-03-01",
    endDate: "2025-03-01",
  },
];

function StatusBadge({ status }: { status: string }) {
  const getStatusClasses = () => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-blue-100 text-blue-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses()}`}
    >
      {status}
    </span>
  );
}

const tableColumns = [
  {
    key: "title",
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
    key: "client",
    label: "Client",
    render: (value: string) => (
      <span className="text-sm text-gray-900">{value}</span>
    ),
  },
  {
    key: "value",
    label: "Value",
    render: (value: string) => (
      <span className="text-sm text-gray-900">{value}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (value: string) => <StatusBadge status={value} />,
  },
  {
    key: "startDate",
    label: "Start Date",
    render: (value: string) => (
      <span className="text-sm text-gray-500">{value}</span>
    ),
  },
  {
    key: "endDate",
    label: "End Date",
    render: (value: string) => (
      <span className="text-sm text-gray-500">{value}</span>
    ),
  },
  {
    key: "actions",
    label: "",
    render: (value: any, row: any) => (
      <Link
        href={`/dashboard/contracts/${row.id}`}
        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
      >
        View
      </Link>
    ),
  },
];

export default function ContractsPage() {
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
        data={contractsData}
        columns={tableColumns}
        addButton={{
          label: "New contract",
          href: "/dashboard/contracts/new",
        }}
      />
    </>
  );
}
