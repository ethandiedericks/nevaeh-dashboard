'use server'

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createContract(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const contract = await prisma.contract.create({
    data: {
      clientName: formData.get('clientName') as string,
      clientEmail: formData.get('clientEmail') as string,
      contractPdfUrl: formData.get('contractPdfUrl') as string || '',
      amount: parseFloat(formData.get('contractAmount') as string),
      startDate: new Date(formData.get('startDate') as string),
      endDate: new Date(formData.get('endDate') as string),
      signedDate: new Date(formData.get('signedDate') as string),
      userId,
    },
  });

  revalidatePath('/dashboard/contracts');
  return contract;
}

export async function getContracts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return prisma.contract.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getContract(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return prisma.contract.findFirst({
    where: { 
      id,
      userId,
    },
    include: {
      payments: true,
      invoices: true,
    },
  });
}