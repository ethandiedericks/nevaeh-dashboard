import {
  CheckCircleIcon,
  ClockIcon,
  AlertTriangleIcon,
  FileTextIcon,
} from "lucide-react";
import { SimpleDataTable } from "@/components/simple-data-table";
import { StatusBadge } from "@/components/status-badge";
import { MetricCard } from "@/components/metric-card";

const statsData = [
  {
    title: "Paid",
    value: "$3,450",
    icon: CheckCircleIcon,
  },
  {
    title: "Pending",
    value: "$1,800",
    icon: ClockIcon,
  },
  {
    title: "Overdue",
    value: "$3,200",
    icon: AlertTriangleIcon,
  },
  {
    title: "Draft",
    value: "$4,100",
    icon: FileTextIcon,
  },
];

const invoicesData = [
  {
    id: 1,
    number: "INV-001",
    customer: "Acme Corp",
    amount: "$2,500.00",
    status: "Paid",
    dueDate: "2024-01-15",
    issueDate: "2023-12-15",
  },
  {
    id: 2,
    number: "INV-002",
    customer: "Tech Solutions",
    amount: "$1,800.00",
    status: "Pending",
    dueDate: "2024-02-01",
    issueDate: "2024-01-01",
  },
  {
    id: 3,
    number: "INV-003",
    customer: "Global Industries",
    amount: "$3,200.00",
    status: "Overdue",
    dueDate: "2024-01-10",
    issueDate: "2023-12-10",
  },
  {
    id: 4,
    number: "INV-004",
    customer: "StartupXYZ",
    amount: "$950.00",
    status: "Paid",
    dueDate: "2024-01-20",
    issueDate: "2023-12-20",
  },
  {
    id: 5,
    number: "INV-005",
    customer: "Enterprise Ltd",
    amount: "$4,100.00",
    status: "Draft",
    dueDate: "2024-02-15",
    issueDate: "2024-01-15",
  },
];

const tableColumns = [
  {
    key: "number",
    label: "Invoice",
    render: (value: string) => (
      <span className="text-sm font-medium text-gray-900">{value}</span>
    ),
  },
  {
    key: "customer",
    label: "Customer",
    render: (value: string) => (
      <span className="text-sm text-gray-900">{value}</span>
    ),
  },
  {
    key: "amount",
    label: "Amount",
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
    key: "issueDate",
    label: "Issue Date",
    render: (value: string) => (
      <span className="text-sm text-gray-500">{value}</span>
    ),
  },
  {
    key: "dueDate",
    label: "Due Date",
    render: (value: string) => (
      <span className="text-sm text-gray-500">{value}</span>
    ),
  },
];

export default function InvoicesPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <p className="text-gray-600">
          A list of all invoices including their status, amounts, and due dates.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-8">
        {statsData.map((stat, index) => (
          <MetricCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Invoices table */}
      <SimpleDataTable
        title="All Invoices"
        data={invoicesData}
        columns={tableColumns}
        addButton={{
          label: "New invoice",
          href: "/dashboard/invoices/new",
        }}
      />
    </>
  );
}
