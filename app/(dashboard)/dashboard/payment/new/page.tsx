import { getContracts } from "@/app/actions/contract";
import AddPayment from "./AddPayment";

export default async function NewPaymentPage() {
  let contracts;
  try {
    contracts = await getContracts();
  } catch (error) {
    return (
      <div className="text-red-600">
        Error:{" "}
        {error instanceof Error ? error.message : "Failed to fetch contracts"}
      </div>
    );
  }

  // Transform contracts to match the expected interface
  const simplifiedContracts = contracts.map((contract) => ({
    id: contract.id,
    clientName: contract.clientName,
  }));

  return <AddPayment contracts={simplifiedContracts} />;
}
