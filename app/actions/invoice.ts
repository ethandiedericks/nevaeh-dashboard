/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { db, InvoiceStatus } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { uploadToS3 } from "@/lib/s3";
import { generateInvoicePdf } from "@/lib/generateInvoicePdf";

export async function createInvoice(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const contractId = formData.get("contract") as string;
  const number = formData.get("number") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const issueDate = formData.get("issueDate") as string;
  const dueDate = formData.get("dueDate") as string;
  const status = formData.get("status") as InvoiceStatus;
  const notes = formData.get("notes") as string;
  const itemsRaw = formData.get("items");

  if (!itemsRaw) {
    throw new Error("Items array is required");
  }

  let items;
  try {
    items = JSON.parse(itemsRaw as string);
  } catch (error) {
    throw new Error("Invalid JSON for invoice items");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Items array is required");
  }
  // Items will be included later as JSON string in FormData
  // const items: InvoiceItem[] = JSON.parse(formData.get("items") as string);

  const contract = await db.contract.findFirst({
    where: { id: contractId, userId },
  });
  if (!contract) throw new Error("Contract not found");

  const pdfBuffer = await generateInvoicePdf({
    clientName: contract.clientName,
    invoiceNumber: number,
    issueDate,
    dueDate,
    notes,
    items,
  });

  const pdfUrl = await uploadToS3(
    pdfBuffer,
    `${number}.pdf`,
    "application/pdf"
  );

  await db.invoice.create({
    data: {
      contractId,
      number,
      amount,
      issuedOn: new Date(issueDate), // renamed here
      dueDate: new Date(dueDate),
      status,
      notes,
      invoicePdfUrl: pdfUrl,
    },
  });
}

export async function getInvoices() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.invoice.findMany({
    where: {
      contract: {
        userId,
      },
    },
    include: {
      contract: {
        select: {
          clientName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
