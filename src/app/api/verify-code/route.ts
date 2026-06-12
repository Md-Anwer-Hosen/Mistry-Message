import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Username does not exist",
        },
        { status: 404 },
      );
    }

    const isCodeValid = user.verifyCode === code;

    const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();

    if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Code does not match",
        },
        { status: 400 },
      );
    }

    if (isCodeExpired) {
      return Response.json(
        {
          success: false,
          message: "Code is expired",
        },
        { status: 410 },
      );
    }

    user.isVerified = true;
    await user.save();

    return Response.json({
      success: true,
      message: "User verified successfully",
    });
  } catch (err) {
    console.error("Error verifying code", err);

    return Response.json(
      {
        success: false,
        message: "Error verifying code",
      },
      { status: 500 },
    );
  }
}
