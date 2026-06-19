import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import mongoose from "mongoose";

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

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const result = await UserModel.aggregate([
      {
        $match: { _id: userObjectId },
      },
      {
        // ✅ messages array খালি থাকলেও document রাখার জন্য preserveNullAndEmptyArrays
        $unwind: {
          path: "$messages",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: {
          _id: "$_id",
          // ✅ null/undefined message push না করার জন্য
          messages: {
            $push: {
              $cond: [
                { $ifNull: ["$messages", false] },
                "$messages",
                "$$REMOVE",
              ],
            },
          },
        },
      },
    ]);

    if (!result || result.length === 0) {
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
        messages: result[0].messages,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error fetching messages:", err);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch messages",
      },
      { status: 500 },
    );
  }
}
