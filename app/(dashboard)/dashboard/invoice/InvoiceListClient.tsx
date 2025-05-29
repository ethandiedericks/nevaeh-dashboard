"use client";

import { SimpleDataTable } from "@/components/simple-data-table";
import { StatusBadge } from "@/components/status-badge";

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
    key: "dueDate",
    label: "Due Date",
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

type Invoice = {
  id: string;
  contract: { clientName: string };
  amount: number;
  issuedOn: Date;
  status: string;
  dueDate: Date;
  number: string;
};

type Props = {
  invoices: Invoice[];
};

export function InvoiceClientList({ invoices }: Props) {
  const formattedInvoices = invoices.map((invoice) => ({
    id: invoice.id,
    number: invoice.number ?? `INV-${invoice.id.slice(-4).toUpperCase()}`,
    customer: invoice.contract.clientName,
    amount: `$${invoice.amount.toFixed(2)}`,
    status: invoice.status || "Pending",
    issueDate: new Date(invoice.issuedOn).toISOString().split("T")[0],
    dueDate: new Date(invoice.dueDate).toISOString().split("T")[0],
  }));

  return (
    <SimpleDataTable
      title="All Invoices"
      data={formattedInvoices}
      columns={tableColumns}
      addButton={{
        label: "New invoice",
        href: "/dashboard/invoice/new",
      }}
    />
  );
}
