import { Schema, model, Document, Types } from "mongoose";

export interface INotification extends Document {
  userId: Types.ObjectId;
  taskId: Types.ObjectId;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    taskId: { type: Schema.Types.ObjectId, ref: "Task" },
    message: String,
    read: { type: Boolean, default: false }
  },
  { timestamps: true,versionKey:false }
);

export const Notification = model<INotification>(
  "Notification",
  notificationSchema
);
