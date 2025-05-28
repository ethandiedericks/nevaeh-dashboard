import { getContracts } from "@/app/actions/contract";
import ContractsClientPage from "./client";

export default async function ContractsPage() {
  const contracts = await getContracts();
  return <ContractsClientPage contracts={contracts} />;
}
