import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { InvoiceItem } from "@/types/invoice";

export async function generateInvoicePdf({
  clientName,
  invoiceNumber,
  issueDate,
  dueDate,
  notes,
  items,
}: {
  clientName: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  notes?: string;
  items: InvoiceItem[];
}) {
  if (!clientName || !invoiceNumber || !issueDate || !dueDate || !items) {
    throw new Error("Missing required invoice parameters");
  }

  const doc = new PDFDocument({ size: "A4", margin: 50, bufferPages: true });
  const buffers: Buffer[] = [];
  doc.on("data", buffers.push.bind(buffers));

  let useCustomFont = false;
  try {
    const fontPath = path.join(
      process.cwd(),
      "public",
      "fonts",
      "GeistMono-Regular.ttf"
    );
    if (fs.existsSync(fontPath)) {
      const fontData = fs.readFileSync(fontPath);
      doc.registerFont("GeistMono", fontData);
      useCustomFont = true;
    }
  } catch {
    useCustomFont = false;
  }
  if (useCustomFont) doc.font("GeistMono");

  const pageWidth = doc.page.width;
  const margin = doc.page.margins.left;

  // Header with logo + invoice title
  doc
    .fontSize(26)
    .text("TAX INVOICE", margin, 40)
    .fontSize(10)
    .text(`Invoice #: ${invoiceNumber}`, { align: "right" })
    .text(`Issue Date: ${issueDate}`, { align: "right" })
    .text(`Due Date: ${dueDate}`, { align: "right" });

  doc.moveDown();

  // Business and Client Info
  const top = 120;
  doc
    .fontSize(12)
    .text("From:", margin, top)
    .text("Your Business Name")
    .text("123 Business Rd")
    .text("City, State ZIP")
    .moveDown()
    .text("To:")
    .text(clientName);

  doc.moveDown(2);

  // Invoice Table Header
  doc
    .fontSize(12)
    .fillColor("black")
    .text("Description", margin, doc.y, { width: 250 })
    .text("Qty", margin + 270, doc.y, { width: 50, align: "right" })
    .text("Unit Price", margin + 320, doc.y, { width: 80, align: "right" })
    .text("Amount", margin + 420, doc.y, { width: 80, align: "right" })
    .moveDown(0.5)
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(margin, doc.y)
    .lineTo(pageWidth - margin, doc.y)
    .stroke();

  let total = 0;
  items.forEach((item) => {
    const amount = item.quantity * item.amount;
    total += amount;
    doc
      .fontSize(10)
      .fillColor("black")
      .text(item.description, margin, doc.y + 5, { width: 250 })
      .text(item.quantity.toString(), margin + 270, doc.y + 5, {
        width: 50,
        align: "right",
      })
      .text(item.amount.toFixed(2), margin + 320, doc.y + 5, {
        width: 80,
        align: "right",
      })
      .text(amount.toFixed(2), margin + 420, doc.y + 5, {
        width: 80,
        align: "right",
      });
  });

  doc.moveDown(2);

  // Totals Section
  doc
    .fontSize(12)
    .text("Subtotal:", margin + 320, doc.y, { width: 80, align: "right" })
    .text(total.toFixed(2), margin + 420, doc.y, { width: 80, align: "right" });

  const tax = total * 0.1;
  doc
    .text("Tax (10%):", margin + 320, doc.y + 15, { width: 80, align: "right" })
    .text(tax.toFixed(2), margin + 420, doc.y + 15, {
      width: 80,
      align: "right",
    })
    .font("Helvetica-Bold")
    .text("Total:", margin + 320, doc.y + 30, { width: 80, align: "right" })
    .text((total + tax).toFixed(2), margin + 420, doc.y + 30, {
      width: 80,
      align: "right",
    })
    .font("Helvetica");

  doc.moveDown(3);

  // Payment Details or Notes
  if (notes) {
    doc
      .fontSize(10)
      .text("Notes:", margin, doc.y)
      .fontSize(10)
      .text(notes, { width: pageWidth - 2 * margin });
  }

  doc.end();

  return await new Promise<Buffer>((resolve) => {
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
  });
}
