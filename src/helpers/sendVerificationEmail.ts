import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "../types/apiResponse";

export async function sendVerificationEmail(
  email: string,
  userName: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mistry Message Verification Code",
      react: VerificationEmail({
        userName,
        otp: verifyCode,
      }),
    });

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (emailError) {
    console.log("Error sending email:", emailError);

    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
