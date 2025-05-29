import { getContracts } from "@/app/actions/contract";
import { CreateInvoiceClient } from "./CreateInvoice";

export default async function NewInvoicePage() {
  const contracts = await getContracts();

  return <CreateInvoiceClient contracts={contracts} />;
}
