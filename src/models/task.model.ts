import mongoose, { Document, Types } from "mongoose";

export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface CurrentStage {
  stageId: Types.ObjectId;
  stageName: string;
  order: number;
}

export interface ActivityLog {
  action: string;
  fromStage?: string;
  toStage?: string;
  user: Types.ObjectId;
  createdAt: Date;
}

export interface Task extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string; // markdown
  priority: Priority;
  project: Types.ObjectId;
  workflow: Types.ObjectId;
  currentStage: CurrentStage;
  assignedUsers: Types.ObjectId[];
  dueDate: Date;
  completedAt?: Date;
  activityLog: ActivityLog[];
  createdAt: Date;
}
import { Schema, model, } from "mongoose";

const ActivityLogSchema = new Schema(
  {
    action: { type: String, required: true },
    fromStage: { type: String },
    toStage: { type: String },
    user: { type: Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const CurrentStageSchema = new Schema(
  {
    stageId: { type: Types.ObjectId, required: true },
    stageName: { type: String, required: true },
    order: { type: Number, required: true }
  },
  { _id: false }
);

const TaskSchema = new Schema<Task>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM"
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    workflow: {
      type: Types.ObjectId,
      ref: "Workflow",
      required: true
    },
    currentStage: {
      type: CurrentStageSchema,
      required: true
    },
    assignedUsers: [
      {
        type: Types.ObjectId,
        ref: "User"
      }
    ],
    dueDate: {
      type: Date,
      required: true
    },
    completedAt: {
      type: Date
    },
    activityLog: {
      type: [ActivityLogSchema],
      default: []
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const TaskModel = model("Task", TaskSchema);
