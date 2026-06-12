import mongoose, { Schema, Document } from "mongoose";

//type define

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

//type define

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  isVerified: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "UserName is required"],
    trim: true,
    unique: true,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },

  verifyCode: {
    type: String,
    required: [true, "VerifyCode is required"],
  },

  verifyCodeExpiry: {
    type: Date,
    required: [true, "VerifyCode is required"],
    default: Date.now,
  },

  isAcceptingMessage: {
    type: Boolean,
    default: false,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  messages: [MessageSchema],
});

const UserModel =
  mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;
