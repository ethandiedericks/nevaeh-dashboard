import { CheckCircleIcon, ClockIcon, XCircleIcon } from "lucide-react";

import { SimpleDataTable } from "@/components/simple-data-table";
import { StatusBadge } from "@/components/status-badge";
import { MetricCard } from "@/components/metric-card";

const statsData = [
  {
    title: "Total Processed",
    value: "$12,550.00",
    icon: CheckCircleIcon,
  },
  {
    title: "Pending",
    value: "$5,900.00",
    icon: ClockIcon,
  },
  {
    title: "Failed",
    value: "$3,200.00",
    icon: XCircleIcon,
  },
];

const paymentsData = [
  {
    id: 1,
    reference: "PAY-001",
    customer: "Acme Corp",
    amount: "$2,500.00",
    status: "Completed",
    date: "2024-01-15",
    method: "Bank Transfer",
  },
  {
    id: 2,
    reference: "PAY-002",
    customer: "Tech Solutions",
    amount: "$1,800.00",
    status: "Processing",
    date: "2024-01-14",
    method: "Credit Card",
  },
  {
    id: 3,
    reference: "PAY-003",
    customer: "Global Industries",
    amount: "$3,200.00",
    status: "Failed",
    date: "2024-01-13",
    method: "ACH",
  },
  {
    id: 4,
    reference: "PAY-004",
    customer: "StartupXYZ",
    amount: "$950.00",
    status: "Completed",
    date: "2024-01-12",
    method: "PayPal",
  },
  {
    id: 5,
    reference: "PAY-005",
    customer: "Enterprise Ltd",
    amount: "$4,100.00",
    status: "Pending",
    date: "2024-01-11",
    method: "Wire Transfer",
  },
];

const tableColumns = [
  {
    key: "reference",
    label: "Reference",
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
    key: "method",
    label: "Method",
    render: (value: string) => (
      <span className="text-sm text-gray-500">{value}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (value: string) => <StatusBadge status={value} />,
  },
  {
    key: "date",
    label: "Date",
    render: (value: string) => (
      <span className="text-sm text-gray-500">{value}</span>
    ),
  },
];

export default function PaymentsPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600">
          A list of all payments including their reference, customer, amount,
          and status.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        {statsData.map((stat, index) => (
          <MetricCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Payments table */}
      <SimpleDataTable
        title="All Payments"
        data={paymentsData}
        columns={tableColumns}
        addButton={{
          label: "Add payment",
          href: "/dashboard/payments/new",
        }}
      />
    </>
  );
}
