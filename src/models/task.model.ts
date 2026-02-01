import { Schema, model, Document, Types } from "mongoose";

export type Priority = "Low" | "Medium" | "High";

export interface IActivityLog {
  action: string;
  from?: string;
  to?: string;
  userId: Types.ObjectId;
  timestamp: Date;
}

export interface ITask extends Document {
  title: string;
  description?: string;
  priority: Priority;
  workflowId: Types.ObjectId;
  currentStage: string;
  assignedUsers: Types.ObjectId[];
  dueDate?: Date;
  completedAt?: Date;
  activityLog: IActivityLog[];
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: String,
    description: String,
    priority: { type: String, enum: ["Low", "Medium", "High"] },
    workflowId: { type: Schema.Types.ObjectId, ref: "Workflow" },
    currentStage: String,
    assignedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dueDate: Date,
    completedAt: Date,
    activityLog: [
      {
        action: String,
        from: String,
        to: String,
        userId: Schema.Types.ObjectId,
        timestamp: Date
      }
    ]
  },
  { timestamps: true,versionKey:false }
);

export const Task = model<ITask>("Task", taskSchema);
