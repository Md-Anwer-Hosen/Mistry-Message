import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { userNamevalidation } from "@/schemas/signupSchema";
import { z } from "zod";

const usernameQuerySchema = z.object({ username: userNamevalidation });

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    const queryParam = { username: searchParams.get("username") || "" };

    //validate with zod

    const result = usernameQuerySchema.safeParse(queryParam);

    console.log(result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      console.log(usernameErrors);
      return Response.json(
        {
          success: false,
          message: "Invalid Query Parameters",
        },
        { status: 400 },
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 200 },
      );
    }

    return Response.json({
      success: true,
      message: "Username is Valid",
    });
  } catch (err) {
    console.error("Error checking Username", err); //for terminal
    return Response.json({
      // for frontend
      success: false,
      message: "Error checking username",
    });
  }
}
