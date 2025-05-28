import { getContract } from "@/app/actions/contract";
import ContractEditForm from "./contract-edit-form";

interface PageProps {
  params: { id: string };
}

export default async function ContractEditPage({ params }: PageProps) {
  const contract = await getContract(params.id);

  if (!contract) {
    return <div className="p-6 text-red-500">Contract not found</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ContractEditForm contract={contract} />
    </div>
  );
}
