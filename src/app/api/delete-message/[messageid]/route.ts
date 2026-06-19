import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageid: string }> }, // ✅ Promise type
) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const { messageid } = await params; // ✅ await করে unwrap করা
  const messageId = messageid;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return Response.json(
      { success: false, message: "Invalid message ID" },
      { status: 400 },
    );
  }

  try {
    const result = await UserModel.updateOne(
      { _id: session.user._id },
      { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } } },
    );

    if (result.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 },
      );
    }

    return Response.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error deleting message:", err);
    return Response.json(
      { success: false, message: "Error deleting message" },
      { status: 500 },
    );
  }
}
