'use server'

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createInvoice(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const invoice = await prisma.invoice.create({
    data: {
      contractId: formData.get('contract') as string,
      invoicePdfUrl: formData.get('invoicePdfUrl') as string || '',
      amount: parseFloat(formData.get('amount') as string),
      issuedOn: new Date(formData.get('issueDate') as string),
      notes: formData.get('notes') as string,
    },
  });

  revalidatePath('/dashboard/invoices');
  return invoice;
}

export async function getInvoices() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return prisma.invoice.findMany({
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
    orderBy: { createdAt: 'desc' },
  });
}