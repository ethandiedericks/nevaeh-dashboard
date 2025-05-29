"use client";

import type React from "react";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash } from "lucide-react";
import { createInvoice } from "@/app/actions/invoice";
import { InvoiceStatus } from "@/lib/db";
import { CustomButton } from "@/components/custom-button";

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Contract {
  id: string;
  clientName: string;
}

interface CreateInvoiceClientProps {
  contracts: Contract[];
}

export function CreateInvoiceClient({ contracts }: CreateInvoiceClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    contract: "",
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    status: InvoiceStatus.UNPAID,
    notes: "",
    invoicePdfUrl: "",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: "", quantity: 1, rate: 0, amount: 0 },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.contract) {
      alert("Please select a contract");
      return;
    }

    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

    startTransition(async () => {
      try {
        const formDataObj = new FormData();
        formDataObj.append("contract", formData.contract);
        formDataObj.append("number", formData.invoiceNumber);
        formDataObj.append("amount", totalAmount.toString());
        formDataObj.append("issueDate", formData.issueDate);
        formDataObj.append("dueDate", formData.dueDate);
        formDataObj.append("status", formData.status);
        formDataObj.append("notes", formData.notes);
        formDataObj.append("invoicePdfUrl", formData.invoicePdfUrl);

        formDataObj.append("items", JSON.stringify(items));

        await createInvoice(formDataObj);
        router.push("/dashboard/invoice");
      } catch (error) {
        console.error("Error creating invoice:", error);
        alert("Failed to create invoice. Please try again.");
      }
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addItem = () => {
    const newId = Math.max(...items.map((item) => item.id)) + 1;
    setItems([
      ...items,
      { id: newId, description: "", quantity: 1, rate: 0, amount: 0 },
    ]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (
    id: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <>
      {/* Header */}
      <div className="w-full mx-auto mb-6">
        <Link
          href="/dashboard/invoice"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to invoices
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Create New Invoice</h2>
        <p className="mt-1 text-sm text-gray-600">
          Fill out the form below to create a new invoice.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="contract"
                className="block text-sm font-medium text-gray-700"
              >
                Contract / Customer
              </label>
              <select
                name="contract"
                id="contract"
                value={formData.contract}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
                required
              >
                <option value="">Select a contract</option>
                {contracts.map((contract) => (
                  <option key={contract.id} value={contract.id}>
                    {contract.clientName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="invoiceNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Invoice Number
              </label>
              <input
                type="text"
                name="invoiceNumber"
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
                placeholder="INV-001"
                required
              />
            </div>

            <div>
              <label
                htmlFor="issueDate"
                className="block text-sm font-medium text-gray-700"
              >
                Issue Date
              </label>
              <input
                type="date"
                name="issueDate"
                id="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
                required
              />
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700"
              >
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                id="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
                required
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
              >
                <option value={InvoiceStatus.UNPAID}>Unpaid</option>
                <option value={InvoiceStatus.PAID}>Paid</option>
                <option value={InvoiceStatus.OVERDUE}>Overdue</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="invoicePdfUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Invoice PDF URL (Optional)
              </label>
              <input
                type="url"
                name="invoicePdfUrl"
                id="invoicePdfUrl"
                value={formData.invoicePdfUrl}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
                placeholder="https://example.com/invoice.pdf"
              />
            </div>
          </div>

          {/* Invoice Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Invoice Items
              </h3>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
                          placeholder="Item description"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "quantity",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          className="block w-20 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
                          min="1"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "rate",
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                            className="block w-24 pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${item.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                          className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-6 flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-medium border-t pt-2">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Notes
            </label>
            <textarea
              name="notes"
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
              placeholder="Additional notes or terms"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Link href="/dashboard/contract">
              <CustomButton variant="outline">Cancel</CustomButton>
            </Link>
            <CustomButton type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Creating..." : "Create Invoice"}
            </CustomButton>
          </div>
        </form>
      </div>
    </>
  );
}
