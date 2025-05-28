import { getContract } from "@/app/actions/contract";
import { notFound } from "next/navigation";
import ContractDetailClient from "./client";

interface PageProps {
  params: Promise<{ id: string }>;
}
export default async function ContractDetailPage({ params }: PageProps) {
  const { id } = await params;
  const contract = await getContract(id);

  if (!contract) {
    notFound();
  }

  return <ContractDetailClient contract={contract} />;
}
