import { FROM_EMAIL, PLATFORM_BRAND_NAME } from "@/lib/config/platform";
import type { LandingOrder } from "@/types/order";
import { Resend } from "resend";

export async function sendSuperAdminLandingOrderEmail(
  to: string,
  order: LandingOrder,
): Promise<void> {
  const lines = [
    `New ecommerce website order (₦${order.amount.toLocaleString("en-NG")})`,
    "",
    `Order ID: ${order.orderId}`,
    `Status: ${order.status}`,
    "",
    `Customer name: ${order.customerName}`,
    `Customer email: ${order.customerEmail}`,
    `Customer phone: ${order.customerPhone}`,
    `Business name: ${order.businessName}`,
    "",
    `Product: ${order.productType}`,
    `Amount paid: ₦${order.amount.toLocaleString("en-NG")}`,
    `Payment reference: ${order.paystackReference ?? "N/A"}`,
    `Payment date: ${new Date(order.createdAt).toLocaleString()}`,
  ];

  // Mock email sending – in a real implementation this would
  // call an external provider such as SendGrid, SES, etc.
  // Keeping this in a single place makes it easy to swap later.
  // eslint-disable-next-line no-console
  console.log("Sending super admin order email to:", to, "\n" + lines.join("\n"));
}

export async function sendAdminOTP(
  email: string,
  otp: string,
): Promise<boolean> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // eslint-disable-next-line no-console
      console.error("RESEND_API_KEY is not configured");
      return false;
    }

    const resend = new Resend(apiKey);

    const fromAddress = `${PLATFORM_BRAND_NAME} Super Admin <${FROM_EMAIL}>`;

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: "Your Admin Login OTP",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Admin Login Verification</h2>
          <p>Your one-time password (OTP) is:</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">
            ${otp}
          </p>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Resend error:", error);
      return false;
    }

    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to send OTP email:", err);
    return false;
  }
}

