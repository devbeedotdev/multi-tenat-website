import { Resend } from "resend";

export async function sendAdminOTP(
  email: string,
  otp: string,
): Promise<boolean> {
  try {
    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: "Super Admin <noreply@getcheapecommerce.com>",
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
      console.error("Resend error:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to send OTP email:", err);
    return false;
  }
}
