"use server";

import { s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

interface UploadResult {
  url?: string;
  error?: string;
}

export async function uploadContractPdf(file: File): Promise<UploadResult> {
  if (!file || file.size === 0) {
    return { error: "No file provided." };
  }

  if (file.type !== "application/pdf") {
    return { error: "Only PDF files are allowed." };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { error: "File size exceeds 10MB limit." };
  }

  try {
    const fileName = `contract/${randomUUID()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    return { url };
  } catch (error) {
    console.error("S3 upload error:", error);
    return { error: "Failed to upload file to S3." };
  }
}
