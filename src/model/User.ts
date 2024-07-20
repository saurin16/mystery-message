import mongoose, { Schema, Document } from "mongoose";

// Extend the Message interface to include _id
export interface Message extends Document {
  _id: string; // Add this line
  content: string;
  createAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  message: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, 'please use a valid email address']
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true
  },
  verifyCode: {
    type: String,
    trim: true
  },
  verifyCodeExpiry: {
    type: Date,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true
  },
  message: {
    type: [MessageSchema],
    default: []
  }
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model("User", UserSchema);

export default UserModel;
