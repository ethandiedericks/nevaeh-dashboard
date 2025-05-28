/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import Link from "next/link";
import { CustomButton } from "./custom-button";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface SimpleDataTableProps {
  title: string;
  description?: string;
  data: any[];
  columns: Column[];
  addButton?: {
    label: string;
    href: string;
  };
  viewAllButton?: {
    label: string;
    href: string;
  };
  onRowClick?: (row: any) => void;
}

export function SimpleDataTable({
  title,
  description,
  data,
  columns,
  addButton,
  viewAllButton,
  onRowClick,
}: SimpleDataTableProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {title}
          </h3>
          <div className="flex items-center space-x-3">
            {addButton && (
              <Link href={addButton.href}>
                <CustomButton variant="primary">{addButton.label}</CustomButton>
              </Link>
            )}
            {viewAllButton && (
              <Link href={viewAllButton.href}>
                <CustomButton variant="primary">
                  {viewAllButton.label}
                </CustomButton>
              </Link>
            )}
          </div>
        </div>
        {description && (
          <p className="text-sm text-gray-600 mb-4">{description}</p>
        )}
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
