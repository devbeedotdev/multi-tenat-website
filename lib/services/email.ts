export async function sendAdminOTP(
  email: string,
  otp: string,
): Promise<boolean> {
  // In production, replace this with a call to Resend (or another
  // email provider) and return true/false based on the API result.
  // The UI and admin flows should not need to change.

  // eslint-disable-next-line no-console
  console.log(
    `SIMULATION: Sending Email OTP to ${email}. One-time code: ${otp}`,
  );

  await new Promise((resolve) => setTimeout(resolve, 2000));
  return true;
}

