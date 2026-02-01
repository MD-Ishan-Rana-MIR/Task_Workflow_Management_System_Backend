import { Schema, model, Document } from "mongoose";

export type Role = "admin" | "manager" | "member";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["admin", "manager", "member"] }
  },
  { timestamps: true,versionKey:false }
);

export const User = model<IUser>("User", userSchema);
