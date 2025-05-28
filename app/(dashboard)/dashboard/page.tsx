import Link from "next/link";

import {
  PlusIcon,
  CreditCardIcon,
  FileTextIcon,
  ClockIcon,
  DollarSignIcon,
} from "lucide-react";
import { CustomButton } from "@/components/custom-button";
import { DashboardContractStatus } from "@/components/dashboard-contract-status";
import { DashboardRecentPayments } from "@/components/dashboard-recent-payments";
import { DashboardRevenueChart } from "@/components/dashboard-revenue-card";
import { DashboardMetricCard } from "@/components/dashboard-metric-card";

export default function DashboardPage() {
  return (
    <>
      {/* Header */}
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

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardMetricCard
          title="Active Contracts"
          value="12"
          subtitle="3 contracts with pending payments"
          icon={FileTextIcon}
        />
        <DashboardMetricCard
          title="Total Revenue"
          value="$48,750"
          trend="+12% from last month"
          icon={DollarSignIcon}
        />
        <DashboardMetricCard
          title="Pending Payments"
          value="3"
          subtitle="Due in the next 30 days"
          icon={ClockIcon}
        />
      </div>

      {/* Charts and Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardRevenueChart />
        </div>
        <div className="space-y-6">
          <DashboardContractStatus />
          <DashboardRecentPayments />
        </div>
      </div>
    </>
  );
}
