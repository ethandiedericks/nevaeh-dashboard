interface Payment {
  id: string;
  company: string;
  initials: string;
  date: string;
  amount: string;
  status: "Paid";
}

const payments: Payment[] = [
  {
    id: "1",
    company: "Acme Corp",
    initials: "Ac",
    date: "May 15, 2025",
    amount: "$4,500",
    status: "Paid",
  },
  {
    id: "2",
    company: "Globex Inc",
    initials: "Gl",
    date: "May 12, 2025",
    amount: "$3,750",
    status: "Paid",
  },
  {
    id: "3",
    company: "Initech",
    initials: "In",
    date: "May 10, 2025",
    amount: "$5,000",
    status: "Paid",
  },
];

export function DashboardRecentPayments() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
      </div>
      <div className="space-y-4">
        {payments.map((payment) => (
          <div key={payment.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-medium text-gray-600">
                  {payment.initials}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {payment.company}
                </p>
                <p className="text-xs text-gray-500">{payment.date}</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900 mr-3">
                {payment.amount}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {payment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
