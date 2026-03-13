import LandingPage from "@/components/landing/LandingPage";
import { MAIN_DOMAIN } from "@/lib/config/platform";
import {
  createLandingOrder,
  getSuperAdminSettings,
  updateLandingOrderStatus,
} from "@/lib/dal";
import { sendSuperAdminLandingOrderEmail } from "@/lib/services/email";
import type { LandingOrder } from "@/types/order";
import type { Result } from "@/types/result";
import type { Metadata } from "next";

const OG_IMAGE_PLACEHOLDER =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

export const metadata: Metadata = {
  title: "Build an Online Store in Nigeria (₦50,000) | GetCheapEcommerce",
  description:
    "Launch your professional online store in 30 mins. Affordable ecommerce builder with WhatsApp ordering and Paystack integration for Nigerian vendors.",
  openGraph: {
    title: "Build an Online Store in Nigeria (₦50,000) | GetCheapEcommerce",
    description:
      "Launch your professional online store in 30 mins. Affordable ecommerce builder with WhatsApp ordering and Paystack integration for Nigerian vendors.",
    url: `https://${MAIN_DOMAIN}/`,
    siteName: "GetCheapEcommerce",
    type: "website",
    images: [
      {
        url: OG_IMAGE_PLACEHOLDER,
        width: 1200,
        height: 630,
        alt: "Preview of a professional ecommerce storefront built with GetCheapEcommerce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Build an Online Store in Nigeria (₦50,000) | GetCheapEcommerce",
    description:
      "Launch your professional online store in 30 mins. Affordable ecommerce builder with WhatsApp ordering and Paystack integration for Nigerian vendors.",
    images: [OG_IMAGE_PLACEHOLDER],
  },
};

type CreateLandingOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  businessName: string;
};

async function createLandingOrderAction(
  input: CreateLandingOrderInput,
): Promise<Result<LandingOrder>> {
  "use server";

  const amount = 50000;
  const productType = "Ecommerce website";

  try {
    const order = await createLandingOrder({
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      businessName: input.businessName,
      productType,
      amount,
    });

    return { ok: true, data: order };
  } catch (error) {
    console.error("Failed to create landing order:", error);
    return {
      ok: false,
      error: "We could not create your order. Please try again.",
    };
  }
}

async function completeLandingOrderPaymentAction(
  orderId: string,
  paystackReference: string,
): Promise<Result<LandingOrder>> {
  "use server";

  try {
    const updated = await updateLandingOrderStatus(
      orderId,
      "paid",
      paystackReference,
    );

    if (!updated) {
      return {
        ok: false,
        error:
          "We could not find your order after payment. Please contact support.",
      };
    }

    const superAdminResult = await getSuperAdminSettings();
    const superAdmin = superAdminResult.ok ? superAdminResult.data : null;
    if (superAdmin?.email) {
      await sendSuperAdminLandingOrderEmail(superAdmin.email, updated);
    }

    return { ok: true, data: updated };
  } catch (error) {
    console.error("Failed to complete landing order payment:", error);
    return {
      ok: false,
      error:
        "Your payment was received, but we could not complete your order. Please contact support.",
    };
  }
}

export default async function Home() {
  const superAdminResult = await getSuperAdminSettings();
  const superAdmin = superAdminResult.ok ? superAdminResult.data : { domain: "", email: "", phoneNumber: "" };

  return (
    <LandingPage
      superAdminEmail={superAdmin.email}
      superAdminPhone={superAdmin.phoneNumber ?? ""}
      createOrderAction={createLandingOrderAction}
      completePaymentAction={completeLandingOrderPaymentAction}
    />
  );
}

