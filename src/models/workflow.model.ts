import { Schema, model, Document, Types } from "mongoose";

export interface IStage {
  _id: Types.ObjectId;
  name: string;
  order: number;
}

export interface IWorkflow extends Document {
  projectId: Types.ObjectId
  name: string;
  stages: IStage[];
  createdBy: Types.ObjectId;

}

const workflowSchema = new Schema<IWorkflow>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    name: String,
    stages: [
      {
        _id: Types.ObjectId,
        name: String,
        order: Number
      }
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true, versionKey: false }
);

export const Workflow = model<IWorkflow>("Workflow", workflowSchema);
