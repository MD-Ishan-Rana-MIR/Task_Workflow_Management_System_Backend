import { Schema, model, Document, Types } from "mongoose";

export interface IStage {
  name: string;
  order: number;
}

export interface IWorkflow extends Document {
  name: string;
  stages: IStage[];
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const workflowSchema = new Schema<IWorkflow>(
  {
    name: String,
    stages: [
      {
        name: String,
        order: Number
      }
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true , versionKey:false}
);

export const Workflow = model<IWorkflow>("Workflow", workflowSchema);
