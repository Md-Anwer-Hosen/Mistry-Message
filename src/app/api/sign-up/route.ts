import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const normalizedEmail = email.toLowerCase();

    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUser) {
      return Response.json(
        { success: false, message: "User already exists" },
        { status: 400 },
      );
    }

    const existingEmailUser = await UserModel.findOne({
      email: normalizedEmail,
    });

    const verifyCodeOTP = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const expiryDate = new Date(Date.now() + 60 * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingEmailUser) {
      if (existingEmailUser.isVerified) {
        return Response.json(
          { success: false, message: "Email already verified" },
          { status: 400 },
        );
      }

      // update unverified user

      existingEmailUser.password = hashedPassword;
      existingEmailUser.verifyCode = verifyCodeOTP;
      existingEmailUser.verifyCodeExpiry = expiryDate;

      await existingEmailUser.save();
    } else {
      await UserModel.create({
        username,
        email: normalizedEmail,
        password: hashedPassword,
        verifyCode: verifyCodeOTP,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        isVerified: false,
        messages: [],
      });
    }

    const emailResponse = await sendVerificationEmail(
      normalizedEmail,
      username,
      verifyCodeOTP,
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 },
      );
    }

    return Response.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (err) {
    console.error("Registration error:", err);
    return Response.json(
      { success: false, message: "Error registering user" },
      { status: 500 },
    );
  }
}
