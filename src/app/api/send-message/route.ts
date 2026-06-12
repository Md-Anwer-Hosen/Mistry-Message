import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { Message } from "@/model/user";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, content } = await request.json();

    //  Validation

    if (!username || !content) {
      return Response.json(
        {
          success: false,
          message: "Username and content are required",
        },
        { status: 400 },
      );
    }

    //  Find user
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    //  Check if accepting messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 },
      );
    }

    //  Create message
    const newMessage = {
      content,
      createdAt: new Date(),
    };

    //  Save message
    user.messages.push(newMessage as Message);
    await user.save();

    //  Success response
    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error sending message:", err);

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
