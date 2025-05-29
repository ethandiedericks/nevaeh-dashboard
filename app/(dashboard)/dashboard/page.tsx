import Link from "next/link";
import {
  PlusIcon,
  CreditCardIcon,
  FileTextIcon,
  ClockIcon,
  DollarSignIcon,
} from "lucide-react";

import { CustomButton } from "@/components/custom-button";
import { DashboardMetricCard } from "@/components/dashboard-metric-card";
import { DashboardRevenueChart } from "@/components/dashboard-revenue-card";
import { DashboardContractStatus } from "@/components/dashboard-contract-status";
import { DashboardRecentPayments } from "@/components/dashboard-recent-payments";
import {
  getContractMetrics,
  getContractStatusSummary,
} from "@/app/actions/contract";
import { getMonthlyRevenue, getRecentPayments } from "@/app/actions/payment";

export default async function DashboardPage() {
  const [metrics, statusSummary, revenue, recentPayments] = await Promise.all([
    getContractMetrics(),
    getContractStatusSummary(),
    getMonthlyRevenue(),
    getRecentPayments(),
  ]);

  return (
    <>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Overview of your retainer contracts and revenue
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/dashboard/contract/new">
            <CustomButton variant="primary">
              <PlusIcon className="h-4 w-4 mr-2" />
              New Contract
            </CustomButton>
          </Link>
          <Link href="/dashboard/payment/new">
            <CustomButton variant="outline">
              <CreditCardIcon className="h-4 w-4 mr-2" />
              Record Payment
            </CustomButton>
          </Link>
          <Link href="/dashboard/invoice/new">
            <CustomButton variant="outline">
              <FileTextIcon className="h-4 w-4 mr-2" />
              Generate Invoice
            </CustomButton>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardMetricCard
          title="Active Contracts"
          value={statusSummary.active}
          subtitle={`${statusSummary.endingSoon} ending soon`}
          icon={FileTextIcon}
        />
        <DashboardMetricCard
          title="Total Revenue"
          value={`$${metrics.totalAmount.toLocaleString()}`}
          trend="" // Optional: calculate this later
          icon={DollarSignIcon}
        />
        <DashboardMetricCard
          title="Pending Payments"
          value={statusSummary.endingSoon}
          subtitle="Due in the next 30 days"
          icon={ClockIcon}
        />
      </div>

      {/* Charts and Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardRevenueChart data={revenue} />
        </div>
        <div className="space-y-6">
          <DashboardContractStatus data={statusSummary} />
          <DashboardRecentPayments data={recentPayments} />
        </div>
      </div>
    </>
  );
}
