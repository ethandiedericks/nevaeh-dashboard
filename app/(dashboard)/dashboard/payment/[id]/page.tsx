import { getPayment } from "@/app/actions/payment";
import { notFound } from "next/navigation";
import React from "react";
import PaymentDetailClient from "./PaymentDetailClient";

interface PageProps{
    params: Promise<{ id: string }>;
}

export default async function PaymentDetail({ params }: PageProps) {
    const { id } = await params;
    const payment = await getPayment(id);
  
    if (!payment) {
      notFound();
    }
  
    return <PaymentDetailClient payment={payment}/>;
};

