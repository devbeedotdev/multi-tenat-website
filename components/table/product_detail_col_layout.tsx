"use client";

import { DetailValue, ProductDetailItem } from "./product_detail_description";

export type ProductDetailLayoutProps = {
  title?: string;
  details: ProductDetailItem[];
  className?: string;
};

export default function ProductDetailsColLayout({
  title = "Product details",
  details,
  className,
}: ProductDetailLayoutProps) {
  const renderValue = (value: DetailValue) => {
    if (typeof value === "boolean") {
      return <p className="mt-2 text-slate-700">{value ? "Yes" : "No"}</p>;
    }

    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-6 space-y-2 mt-2 text-slate-700">
          {value.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }

    return <p className="mt-2 text-slate-700 leading-relaxed">{value}</p>;
  };

  return (
    <div className={`mt-8 ${className ?? ""}`}>
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">{title}</h2>

      <div className="space-y-6">
        {details.map((item, index) => {
          const [key, value] = Object.entries(item)[0];

          return (
            <div key={index}>
              <h3 className="text-lg font-semibold text-slate-900">{key}</h3>

              {renderValue(value as DetailValue)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
