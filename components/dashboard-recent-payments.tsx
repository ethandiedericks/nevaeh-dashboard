"use client";

interface Payment {
  id: string;
  contract: { clientName: string };
  paidOn: Date;
  amountPaid: number;
  notes?: string | null;
}

interface Props {
  data: Payment[];
}

export function DashboardRecentPayments({ data }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
      </div>
      <div className="space-y-4">
        {data.map((payment) => (
          <div key={payment.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-medium text-gray-600">
                  {payment.contract.clientName.slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {payment.contract.clientName}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(payment.paidOn).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900 mr-3">
                ${payment.amountPaid.toLocaleString()}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Paid
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
