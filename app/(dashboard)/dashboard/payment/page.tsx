import PaymentsPage from "./client";
import { getPayments } from "@/app/actions/payment";

interface PaymentData {
  id: string;
  amountPaid: number | null;
  paidOn: Date | null;
  notes: string | null;
  contractId: string;
  contract: {
    clientName: string;
  } | null;
}

export default async function PaymentsPageServer() {
  let payments: PaymentData[];
  try {
    payments = await getPayments();
    console.log("Payments:", JSON.stringify(payments, null, 2)); // Debug
  } catch (error) {
    return (
      <div className="text-red-600">
        Error:{" "}
        {error instanceof Error ? error.message : "Failed to fetch payments"}
      </div>
    );
  }

  return <PaymentsPage payments={payments} />;
}
