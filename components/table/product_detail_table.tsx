"use client";

import { ProductDetailLayoutProps } from "./product_detail_col_layout";
import {
  DetailValue,
  ProductDetailsDescriptionProps,
} from "./product_detail_description";

export default function ProductDetailsTablularLayout({
  title = "Product Detail",
  details,
  className,
}: ProductDetailLayoutProps) {
  const renderValue = (value: DetailValue) => {
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-5 space-y-1">
          {value.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }

    return value;
  };

  return (
    <div className={`mt-8 ${className ?? ""}`}>
      <h2 className="text-sm font-semibold text-slate-900 md:text-base">
        {title}
      </h2>

      <div className="mt-3 overflow-hidden rounded-xl border border-slate-100">
        <dl className="divide-y divide-slate-100 text-sm text-slate-700">
          {details.map((item, index) => {
            const key = Object.keys(item)[0];
            const value = item[key];

            return (
              <div
                key={index}
                className={`grid grid-cols-2 px-4 py-3 md:grid-cols-3 ${
                  index % 2 === 0 ? "bg-slate-50" : ""
                }`}
              >
                <dt className="font-medium text-slate-500">{key}</dt>

                <dd className="col-span-1 md:col-span-2">
                  {renderValue(value as DetailValue)}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
