import type { LucideIcon } from "lucide-react";

interface DashboardMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
}

export function DashboardMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: DashboardMetricCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <p className="text-sm text-green-600 font-medium">{trend}</p>
          )}
        </div>
        <div className="ml-4">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
