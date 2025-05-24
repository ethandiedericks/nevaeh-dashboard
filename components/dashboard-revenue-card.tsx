"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const chartData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 4500 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 4800 },
  { month: "May", revenue: 5300 },
  { month: "Jun", revenue: 6000 },
  { month: "Jul", revenue: 5500 },
  { month: "Aug", revenue: 5700 },
  { month: "Sep", revenue: 6200 },
  { month: "Oct", revenue: 6500 },
  { month: "Nov", revenue: 6800 },
  { month: "Dec", revenue: 7000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">{`${label}: $${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

export function DashboardRevenueChart() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Revenue Overview
        </h3>
        <p className="text-sm text-gray-500">
          Monthly revenue for the past 12 months
        </p>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" fill="#374151" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
