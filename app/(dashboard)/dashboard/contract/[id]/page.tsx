import { getContract } from "@/app/actions/contract";
import { notFound } from "next/navigation";
import ContractDetailClient from "./client";

export default async function ContractDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const contract = await getContract(params.id);

  if (!contract) {
    notFound();
  }

  return <ContractDetailClient contract={contract} />;
}
