/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  type LucideIcon,
} from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { SimpleDataTable } from "@/components/simple-data-table";
import React from "react";

interface Payment {
  id: string;
  amountPaid: number | null;
  paidOn: Date | null;
  notes: string | null;
  contractId: string;
  contract: {
    clientName: string;
  } | null;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row?: Payment) => React.JSX.Element;
}

interface Stat {
  title: string;
  value: string;
  icon: LucideIcon;
}

interface Props {
  payments: Payment[];
}

const PaymentsPage = ({ payments }: Props) => {
  const router = useRouter();

  // Compute stats client-side
  const validPayments = payments.filter((p) => p.amountPaid !== null);
  //   const pendingPayments: Payment[] = [];
  //   const failedPayments: Payment[] = [];
  const totalProcessed = validPayments
    .reduce((sum: number, p: Payment) => sum + (p.amountPaid || 0), 0)
    .toFixed(2);

  const statsData: Stat[] = [
    {
      title: "Total Processed",
      value: `$${totalProcessed}`,
      icon: CheckCircleIcon,
    },
    {
      title: "Pending",
      value: "$0.00",
      icon: ClockIcon,
    },
    {
      title: "Failed",
      value: "$0.00",
      icon: XCircleIcon,
    },
  ];

  const tableColumns: Column[] = [
    {
      key: "id",
      label: "Reference",
      render: (value: string) => (
        <span className="text-sm font-medium text-gray-900">{`PAY-${value.slice(
          0,
          8
        )}`}</span>
      ),
    },
    {
      key: "contract.clientName",
      label: "client Name",
      render: (_: unknown, row?: Payment) => (
        <span className="text-sm text-gray-900">
          {row?.contract?.clientName || "N/A"}
        </span>
      ),
    },
    {
      key: "amountPaid",
      label: "Amount",
      render: (value: number | null) => (
        <span className="text-sm text-gray-900">
          {typeof value === "number" ? `$${value.toFixed(2)}` : "N/A"}
        </span>
      ),
    },
    {
      key: "paidOn",
      label: "Date",
      render: (value: Date | null) => (
        <span className="text-sm text-gray-500">
          {value instanceof Date && !isNaN(value.getTime())
            ? value.toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              })
            : "N/A"}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600">
          A list of all payments including their reference, customer, amount,
          and date.
        </p>
      </div>

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

      <SimpleDataTable
        title="All Payments"
        data={payments}
        columns={tableColumns}
        addButton={{
          label: "Add payment",
          href: "/dashboard/payment/new",
        }}
        onRowClick={(row: { id: string }) =>
          router.push(`/dashboard/payment/${row.id}`)
        }
      />
    </>
  );
};

export default PaymentsPage;
