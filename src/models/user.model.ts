import { Schema, model, Document } from "mongoose";

import bcrypt from "bcrypt"

/* =======================
   Role Type
======================= */
export type Role = "admin" | "manager" | "member";

/* =======================
   User Interface
======================= */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

/* =======================
   Schema
======================= */
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false // 🔐 never return password by default
    },
    role: {
      type: String,
      enum: ["admin", "manager", "member"],
      default: "member"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});


export const User = model<IUser>("User", userSchema);
