import PaymentEditForm from "./PaymentEditClient";
import { getPayment } from "@/app/actions/payment";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentEditPage({ params }: PageProps) {
  const { id } = await params;
  const payment = await getPayment(id);

  if (!payment) {
    return <div className="p-6 text-red-500">Payment not found</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PaymentEditForm payment={payment} />
    </div>
  );
}
