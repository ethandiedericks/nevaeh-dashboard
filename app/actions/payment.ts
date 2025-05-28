"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface PaymentData {
  id: string;
  amountPaid: number;
  paidOn: Date;
  notes: string | null; // Changed from string | undefined to match Prisma schema
  contractId: string;
  contract: {
    clientName: string;
  };
}

interface PaymentEditData {
  amountPaid?: number;
  paidOn?: string;
  notes?: string;
  contractId?: string;
}

interface PaymentResult {
  data?: PaymentData;
  error?: string;
}

export async function createPayment(
  formData: FormData
): Promise<PaymentResult> {
  // Extract form fields
  const contractId = formData.get("contract") as string;
  const amountPaid = parseFloat(formData.get("paymentAmount") as string);
  const paidOn = formData.get("paymentDate") as string;
  const notes = formData.get("notes") as string;

  // Validate fields
  if (!contractId || !amountPaid || !paidOn) {
    return { error: "Contract ID, amount, and payment date are required." };
  }
  if (isNaN(amountPaid) || amountPaid <= 0) {
    return { error: "Invalid payment amount." };
  }
  const parsedPaidOn = new Date(paidOn);
  if (isNaN(parsedPaidOn.getTime())) {
    return { error: "Invalid payment date format." };
  }

  const { userId } = await auth();
  if (!userId) {
    return { error: "User not found." };
  }

  // Verify contract belongs to the user
  const contract = await db.contract.findFirst({
    where: {
      id: contractId,
      userId,
    },
  });

  if (!contract) {
    return { error: "Contract not found or does not belong to user." };
  }

  try {
    const paymentData = await db.payment.create({
      data: {
        contractId,
        amountPaid,
        paidOn: parsedPaidOn,
        notes: notes || null, // Use null instead of empty string to match schema
      },
      include: {
        contract: {
          select: {
            clientName: true,
          },
        },
      },
    });

    revalidatePath("/dashboard/payment");

    return { data: paymentData };
  } catch (error) {
    console.error("Database error:", error);
    return { error: "Failed to create payment. Please try again." };
  }
}

export async function getPayments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.payment.findMany({
    where: { contract: { user: { clerkUserId: userId } } },
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

export async function getPayment(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const payment = await db.payment.findFirst({
      where: {
        id,
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
    });

    if (!payment) {
      return null;
    }

    return payment;
  } catch (error) {
    console.error("Error fetching payment:", error);
    throw new Error("Failed to fetch payment");
  }
}

export async function editPayment(id: string, data: PaymentEditData) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Validate contractId if provided
    if (data.contractId) {
      const contract = await db.contract.findFirst({
        where: {
          id: data.contractId,
          userId,
        },
      });
      if (!contract) {
        return {
          success: false,
          error: "Contract not found or does not belong to user.",
        };
      }
    }

    // Validate amount if provided
    if (
      data.amountPaid !== undefined &&
      (isNaN(data.amountPaid) || data.amountPaid <= 0)
    ) {
      return { success: false, error: "Invalid payment amount." };
    }

    // Validate date if provided
    if (data.paidOn) {
      const parsedPaidOn = new Date(data.paidOn);
      if (isNaN(parsedPaidOn.getTime())) {
        return { success: false, error: "Invalid payment date format." };
      }
      data.paidOn = parsedPaidOn.toISOString();
    }

    await db.payment.update({
      where: { id },
      data: {
        amountPaid: data.amountPaid,
        paidOn: data.paidOn ? new Date(data.paidOn) : undefined,
        notes: data.notes ?? null, // Handle undefined as null to match schema
        contractId: data.contractId,
      },
    });

    revalidatePath("/dashboard/payment");
    return { success: true };
  } catch (error) {
    console.error("Edit failed:", error);
    return { success: false, error: "Failed to update payment." };
  }
}

export async function deletePayment(id: string) {
  try {
    await db.payment.delete({ where: { id } });
    revalidatePath("/dashboard/payment");
    return { success: true };
  } catch (error) {
    console.error("Delete failed:", error);
    return { success: false, error: "Failed to delete payment." };
  }
}
