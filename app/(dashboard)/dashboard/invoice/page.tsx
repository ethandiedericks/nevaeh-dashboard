import { CheckCircleIcon, ClockIcon, AlertTriangleIcon } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { getInvoices } from "@/app/actions/invoice";
import { InvoiceClientList } from "./InvoiceListClient";

// Define the InvoiceStatus enum inside your page file
enum InvoiceStatus {
  PAID = "PAID",
  PENDING = "PENDING",
  OVERDUE = "OVERDUE",
}

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  const statsData = [
    {
      title: "Paid",
      value: `$${invoices
        .filter((inv) => (inv.status as InvoiceStatus) === InvoiceStatus.PAID)
        .reduce((sum, inv) => sum + inv.amount, 0)
        .toFixed(2)}`,
      icon: CheckCircleIcon,
    },
    {
      title: "Pending",
      value: `$${invoices
        .filter(
          (inv) => (inv.status as InvoiceStatus) === InvoiceStatus.PENDING
        )
        .reduce((sum, inv) => sum + inv.amount, 0)
        .toFixed(2)}`,
      icon: ClockIcon,
    },
    {
      title: "Overdue",
      value: `$${invoices
        .filter(
          (inv) => (inv.status as InvoiceStatus) === InvoiceStatus.OVERDUE
        )
        .reduce((sum, inv) => sum + inv.amount, 0)
        .toFixed(2)}`,
      icon: AlertTriangleIcon,
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <p className="text-gray-600">
          A list of all invoices including their status, amounts, and due dates.
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

      <InvoiceClientList invoices={invoices} />
    </>
  );
}
