import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

/* =========================
   UPDATE accepting message
========================= */
export async function POST(request: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 },
      );
    }

    const userId = session.user._id;

    const { isAcceptingMessage } = await request.json();

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage,
      },
      {
        new: true,
      },
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Accepting message status updated successfully",
        user: updatedUser,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error updating accepting message status:", err);

    return Response.json(
      {
        success: false,
        message: "Failed to update accepting message status",
      },
      { status: 500 },
    );
  }
}

/* =========================
   GET accepting message status
========================= */
export async function GET() {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 },
      );
    }

    const userId = session.user._id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: user.isAcceptingMessage,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error fetching accepting message status:", err);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch accepting message status",
      },
      { status: 500 },
    );
  }
}
