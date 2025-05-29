"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface ContractData {
  clientName: string;
  clientEmail: string;
  contractPdfUrl?: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  signedDate: Date;
}

interface ContractEditData {
  clientName?: string;
  clientEmail?: string;
  amount?: number;
  startDate?: string;
  endDate?: string;
  pdfUrl?: string;
}

interface ContractResult {
  data?: ContractData;
  error?: string;
}

export async function createContract(
  formData: FormData
): Promise<ContractResult> {

  const clientName = formData.get("clientName") as string;
  const clientEmail = formData.get("clientEmail") as string;
  const contractPdfUrl = formData.get("contractPdfUrl") as string;
  const amount = parseFloat(formData.get("contractAmount") as string);
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const signedDate = formData.get("signedDate") as string;


  if (
    !clientName ||
    !clientEmail ||
    !amount ||
    !startDate ||
    !endDate ||
    !signedDate
  ) {
    return { error: "All fields are required except PDF URL." };
  }
  if (isNaN(amount)) {
    return { error: "Invalid contract amount." };
  }
  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);
  const parsedSignedDate = new Date(signedDate);
  if (
    isNaN(parsedStartDate.getTime()) ||
    isNaN(parsedEndDate.getTime()) ||
    isNaN(parsedSignedDate.getTime())
  ) {
    return { error: "Invalid date format." };
  }
  if (contractPdfUrl && !contractPdfUrl.startsWith("https://")) {
    return { error: "Invalid PDF URL format." };
  }

  const { userId } = await auth();
  if (!userId) {
    return { error: "User not found." };
  }

  try {
    const contractData = await db.contract.create({
      data: {
        clientName,
        clientEmail,
        contractPdfUrl: contractPdfUrl || "",
        amount,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        signedDate: parsedSignedDate,
        userId,
      },
    });

    revalidatePath("/dashboard/contract/new");

    return { data: contractData };
  } catch (error) {
    console.error("Database error:", error);
    return { error: "Failed to create contract. Please try again." };
  }
}

export async function getContracts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.contract.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getContract(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const contract = await db.contract.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        payments: true,
        invoices: true,
      },
    });

    if (!contract) {
      return null;
    }

    return contract;
  } catch (error) {
    console.error("Error fetching contract:", error);
    throw new Error("Failed to fetch contract");
  }
}

export async function editContract(id: string, data: ContractEditData) {
  try {
    await db.contract.update({
      where: { id },
      data,
    });
    return { success: true };
  } catch (error) {
    console.error("Edit failed:", error);
    return { success: false, error: "Failed to update contract." };
  }
}

export async function deleteContract(id: string) {
  try {
    await db.contract.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Delete failed:", error);
    return { success: false, error: "Failed to delete contract." };
  }
}

export async function getContractStatusSummary() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const contracts = await db.contract.findMany({ where: { userId } });
  const now = new Date();

  let active = 0;
  let endingSoon = 0;
  let expired = 0;

  contracts.forEach((contract) => {
    const end = new Date(contract.endDate);
    const daysLeft = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (daysLeft < 0) expired++;
    else if (daysLeft <= 30) endingSoon++;
    else active++;
  });

  return { active, endingSoon, expired };
}

export async function getContractMetrics() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const contracts = await db.contract.findMany({ where: { userId } });
  const totalContracts = contracts.length;
  const totalAmount = contracts.reduce((sum, c) => sum + c.amount, 0);

  return {
    totalContracts,
    totalAmount,
  };
}
