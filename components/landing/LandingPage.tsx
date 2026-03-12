"use client";

import FaqSection from "@/components/landing/FaqSection";
import LandingOrderModal from "@/components/landing/LandingOrderModal";
import {
  PLATFORM_BRAND_NAME,
  PLATFORM_LOGO_URL,
  PLATFORM_MARKETING_LINE,
} from "@/lib/config/platform";
import type { LandingOrder } from "@/types/order";
import type { Result } from "@/types/result";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

type CreateLandingOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  businessName: string;
};

type LandingPageProps = {
  superAdminEmail: string;
  superAdminPhone: string;
  createOrderAction: (
    input: CreateLandingOrderInput,
  ) => Promise<Result<LandingOrder>>;
  completePaymentAction: (
    orderId: string,
    paystackReference: string,
  ) => Promise<Result<LandingOrder>>;
};

export default function LandingPage({
  superAdminPhone,
  createOrderAction,
  completePaymentAction,
}: LandingPageProps) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const whatsappUrl = useMemo(() => {
    const digits = (superAdminPhone || "").replace(/\D/g, "");
    if (!digits) return "";

    const message =
      "Hi, I want to buy the ₦50,000 ecommerce website and launch my online store.";
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${digits}?text=${encodedMessage}`;
  }, [superAdminPhone]);

  const handleOrderClick = () => {
    setIsOrderModalOpen(true);
  };

  const handleWhatsAppClick = () => {
    if (!whatsappUrl) return;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <main className="min-h-screen bg-slate-950 text-slate-50">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen">
            <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-emerald-500/40 blur-3xl" />
            <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-sky-500/40 blur-3xl" />
          </div>

          <section className="relative px-4 pt-10 pb-16 sm:px-6 lg:px-8 lg:pb-24">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-start">
              <div className="w-full max-w-xl space-y-6 lg:max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-100 shadow-sm backdrop-blur">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                    30
                  </span>
                  <span>Launch your ecommerce shop in about 30 minutes</span>
                </div>

                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  Get a full ecommerce website for{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
                    ₦50,000
                  </span>{" "}
                  and start selling today.
                </h1>

                <p className="max-w-xl text-sm leading-relaxed text-slate-200/80 sm:text-base">
                  {PLATFORM_MARKETING_LINE} You get a complete,
                  conversion-focused online store – product catalog, cart, order
                  management, WhatsApp checkout and an easy admin dashboard.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={handleOrderClick}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 hover:shadow-emerald-500/40"
                  >
                    Order Website
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppClick}
                    disabled={!whatsappUrl}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-slate-50 shadow-sm transition hover:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-400" />
                    Chat on WhatsApp
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 text-[11px] text-slate-300/80">
                  <div className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Done-for-you setup</span>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>WhatsApp & card-friendly checkout</span>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Mobile responsive storefronts</span>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-md lg:max-w-sm">
                <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/80 to-slate-950/95 p-4 shadow-2xl shadow-emerald-500/20">
                  <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-900/80 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-700 bg-slate-800/80">
                        <Image
                          src={PLATFORM_LOGO_URL}
                          alt={`${PLATFORM_BRAND_NAME} logo`}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-50">
                          {PLATFORM_BRAND_NAME}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Personal custom ecommerce website for serious online
                          shops
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                      ₦50,000 one-time
                    </span>
                  </div>

                  <div className="mt-4 space-y-3 rounded-2xl bg-slate-900/60 p-4">
                    <div className="flex items-center justify-between text-xs text-slate-200">
                      <span>Setup time</span>
                      <span className="font-semibold text-emerald-400">
                        ~30 minutes
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-200">
                      <span>Storefront variants</span>
                      <span className="font-semibold text-sky-300">
                        A / B / C
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-200">
                      <span>Admin dashboard access</span>
                      <span className="font-semibold text-emerald-300">
                        Included
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-200">
                      <span>Monthly subscription</span>
                      <span className="font-semibold text-red-300">None</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleOrderClick}
                    className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/30 transition hover:bg-emerald-600"
                  >
                    Get my ecommerce website for ₦50,000
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="relative border-t border-slate-800/60 bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-8">
              <div className="space-y-2 text-center">
                <h2 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
                  Everything you need to run a modern ecommerce shop
                </h2>
                <p className="text-sm text-slate-300/90 sm:text-base">
                  Your store is powered by the same multi-tenant engine used for
                  serious ecommerce brands – optimised for speed, conversions
                  and day-to-day operations.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Product catalog",
                    body: "Organise unlimited products with clean categories, rich descriptions and beautiful media.",
                  },
                  {
                    title: "Shopping cart & checkout",
                    body: "Smooth cart experience that helps buyers add items and complete orders without friction.",
                  },

                  {
                    title: "WhatsApp checkout",
                    body: "Let customers complete orders and ask questions via WhatsApp with a single tap.",
                  },
                  {
                    title: "Mobile responsive design",
                    body: "Your storefront looks premium on any device – phones, tablets and laptops.",
                  },
                  {
                    title: "Admin dashboard",
                    body: "Manage products, pricing, images and content from an intuitive admin interface.",
                  },
                  {
                    title: "Inventory management",
                    body: "Keep stock levels accurate so you never oversell or disappoint customers.",
                  },
                  {
                    title: "Secure payments ready",
                    body: "Built to plug into modern payment gateways so you can accept card and bank payments.",
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
                  >
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-50">
                      {feature.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-300/90">
                      {feature.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="relative border-t border-slate-800/60 bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center">
              <div className="w-full space-y-4 lg:w-1/2">
                <h2 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
                  How it works – from idea to live shop in about 30 minutes
                </h2>
                <p className="text-sm text-slate-300/90 sm:text-base">
                  We&apos;ve removed the complicated parts of ecommerce setup so
                  you can focus on selling and serving your customers.
                </p>
                <ol className="space-y-4 text-sm text-slate-200">
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">
                      1
                    </span>
                    <div>
                      <p className="font-semibold">Place your order</p>
                      <p className="text-xs text-slate-300/90">
                        Click “Order Website”, fill in your details and pay
                        ₦50,000 securely.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">
                      2
                    </span>
                    <div>
                      <p className="font-semibold">We set up your store</p>
                      <p className="text-xs text-slate-300/90">
                        Our system provisions your ecommerce storefront, admin
                        dashboard and checkout flows on our multi-tenant
                        platform.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">
                      3
                    </span>
                    <div>
                      <p className="font-semibold">
                        Go live in about 30 minutes
                      </p>
                      <p className="text-xs text-slate-300/90">
                        You receive your store URL, login details and a quick
                        guide so you can start adding products and accepting
                        orders immediately.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="w-full lg:w-1/2">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      label: "Variant A",
                      title: "Classic grid storefront",
                      body: "Clean hero, product grid and category filters. Perfect for general retail shops.",
                      imageUrl:
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
                    },
                    {
                      label: "Variant B",
                      title: "Story-driven hero layout",
                      body: "Big, bold hero with storytelling sections for brands that want to showcase lifestyle.",
                      imageUrl:
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
                    },
                    {
                      label: "Variant C",
                      title: "Social commerce focused",
                      body: "Optimised for WhatsApp and social traffic with strong CTAs and highlights.",
                      imageUrl:
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
                    },
                  ].map((variant) => (
                    <div
                      key={variant.label}
                      className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60"
                    >
                      <div className="relative h-24 w-full">
                        <Image
                          src={variant.imageUrl}
                          alt={variant.title}
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1 px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                          {variant.label}
                        </p>
                        <p className="text-xs font-semibold text-slate-50">
                          {variant.title}
                        </p>
                        <p className="text-[11px] leading-relaxed text-slate-300/90">
                          {variant.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative border-t border-slate-800/60 bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/20 via-slate-950 to-slate-950 px-6 py-10 shadow-xl sm:px-10">
              <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
                    Simple, transparent pricing
                  </h2>
                  <p className="text-sm text-slate-200/90 sm:text-base">
                    One premium ecommerce website, built on a battle-tested
                    multi-tenant platform – no hidden setup fees or monthly
                    lock-in.
                  </p>
                  <ul className="mt-3 space-y-2 text-xs text-slate-100">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                      <span>
                        Full ecommerce storefront with product catalog, cart and
                        checkout
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                      <span>
                        Admin dashboard to manage products, orders and content
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                      <span>WhatsApp-friendly checkout and mobile UX</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                      <span>Setup and delivery in about 30 minutes</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4 rounded-2xl bg-slate-950/70 p-5 text-center shadow-inner shadow-black/40">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    One-time plan
                  </p>
                  <div className="flex items-end justify-center gap-2">
                    <span className="text-3xl font-semibold text-slate-50">
                      ₦50,000
                    </span>
                    <span className="mb-1 text-xs text-slate-400">
                      per ecommerce website
                    </span>
                  </div>
                  <p className="text-xs text-slate-300/90">
                    No monthly bill from us. You only pay standard payment
                    gateway or bank charges where applicable.
                  </p>
                  <button
                    type="button"
                    onClick={handleOrderClick}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 transition hover:bg-emerald-600"
                  >
                    Order my ecommerce website
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <FaqSection />

          <section className="relative border-t border-slate-800/60 bg-slate-950 px-4 pb-14 pt-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center space-y-4">
              <h2 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
                Ready to start your online store?
              </h2>
              <p className="text-sm text-slate-300/90 sm:text-base">
                Pay ₦50,000 today and we&apos;ll put a professional ecommerce
                website in your hands in about 30 minutes – complete with
                product catalog, cart, orders and WhatsApp-friendly checkout.
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleOrderClick}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 transition hover:bg-emerald-600"
                >
                  Order Website for ₦50,000
                  <ArrowRight className="h-4 w-4" />
                </button>
                {whatsappUrl && (
                  <button
                    type="button"
                    onClick={handleWhatsAppClick}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-3 text-sm font-semibold text-slate-50 shadow-sm transition hover:border-emerald-500"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-400" />
                    Chat on WhatsApp
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <LandingOrderModal
        open={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        createOrderAction={createOrderAction}
        completePaymentAction={completePaymentAction}
      />
    </>
  );
}
