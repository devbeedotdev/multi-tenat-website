import LandingPage from "@/components/landing/LandingPage";
import { createLandingOrder, getSuperAdminSettings, updateLandingOrderStatus } from "@/lib/dal";
import { sendSuperAdminLandingOrderEmail } from "@/lib/services/email";
import type { LandingOrder } from "@/types/order";
import type { Result } from "@/types/result";

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

    const superAdmin = getSuperAdminSettings();
    if (superAdmin.email) {
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
  const superAdmin = getSuperAdminSettings();

  return (
    <LandingPage
      superAdminEmail={superAdmin.email}
      superAdminPhone={superAdmin.phoneNumber ?? ""}
      createOrderAction={createLandingOrderAction}
      completePaymentAction={completeLandingOrderPaymentAction}
    />
  );
}


