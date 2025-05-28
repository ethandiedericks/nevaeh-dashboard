"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createPayment(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const payment = await db.payment.create({
    data: {
      contractId: formData.get("contract") as string,
      amountPaid: parseFloat(formData.get("paymentAmount") as string),
      paidOn: new Date(formData.get("paymentDate") as string),
      notes: formData.get("notes") as string,
    },
  });

  revalidatePath("/dashboard/payment");
  return payment;
}

export async function getPayments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.payment.findMany({
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
