// import { Task } from "../models/task.model";
// import { Workflow } from "../models/workflow.model";
// import { Notification } from "../models/notification.model";
// import { canMoveStage } from "../utils/workflowValidator";
// import { Request, Response } from "express";

// interface UpdateTaskStageBody {
//   stage: string;
// };




// export const createTask = async (req: any, res: any) => {
//       // Get userId from headers (safe)
//     const userIdHeader = req.headers['x-user-id'];
//     if (!userIdHeader) return res.status(401).json({ message: "User ID missing" });
//     const userId = Array.isArray(userIdHeader) ? userIdHeader[0] : userIdHeader;
//   try {
//     const { title, description, priority, workflowId, assignedUsers, dueDate } = req.body;

//     // Check if workflow exists
//     const workflow = await Workflow.findById(workflowId);
//     if (!workflow) return res.status(404).json({ message: "Workflow not found" });

//     // Initialize first stage automatically
//     const firstStage = workflow.stages.sort((a, b) => a.order - b.order)[0]?.name;

//     const task = await Task.create({
//       title,
//       description,
//       priority,
//       workflowId,
//       currentStage: firstStage,
//       assignedUsers,
//       dueDate,
//       activityLog: [
//         {
//           action: "CREATED",
//           from: userId,
//           to: firstStage.name,
//           userId,
//           timestamp: new Date()
//         }
//       ]
//     });

//     res.status(201).json(task);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to create task", error });
//   }
// };




// export const updateTaskStage = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const { stage } = req.body;

//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ message: "Task not found" });

//     const workflow = await Workflow.findById(task.workflowId);
//     if (!workflow) return res.status(404).json({ message: "Workflow not found" });

//     if (!canMoveStage(workflow.stages, task.currentStage, stage)) {
//       return res.status(400).json({ message: "Invalid stage transition" });
//     }

//     const userIdHeader = req.headers['x-user-id'];
// const userId  = Array.isArray(userIdHeader) ? userIdHeader[0] : userIdHeader;


//     task.activityLog.push({
//       action: "STAGE_CHANGED",
//       from: task.currentStage,
//       to: stage,
//       userId,
//       timestamp: new Date()
//     });

//     task.currentStage = stage;

//     if (stage === "Done") {
//       task.completedAt = new Date();
//       for (const assignedUserId of task.assignedUsers) {
//         await Notification.create({
//           userId: assignedUserId,
//           taskId: task._id,
//           message: `Task "${task.title}" completed`
//         });
//       }
//     }

//     await task.save();

//     res.json(task);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to update task stage", error });
//   }
// };


const isValidStageMove = (
  currentOrder: number,
  nextOrder: number
) => nextOrder === currentOrder + 1;




import { Request, Response } from "express";
import { Types } from "mongoose";
import { TaskModel } from "../models/task.model";
import { Workflow, IStage } from "../models/workflow.model"; // IStage must have _id, name, order
import { Notification } from "../models/notification.model";
import { errorResponse, successResponse } from "../utils/response";

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, project, workflow, assignedUsers, priority, dueDate } = req.body;

    const wf = await Workflow.findById(workflow);
    if (!wf) return res.status(404).json({ message: "Workflow not found" });

    const stages: IStage[] = wf.stages.sort((a, b) => a.order - b.order);
    if (!stages.length) {
      return res.status(400).json({ message: "Workflow has no stages" });
    }

    const firstStage = stages[0];

    const assignedUserIds: Types.ObjectId[] = (assignedUsers || []).map(
      (id: string) => new Types.ObjectId(id)
    );

    const userIdHeader = req.headers.id;

    if (!userIdHeader) {
      return res.status(400).json({ message: "User ID missing in headers" });
    }

    const userId = Array.isArray(userIdHeader) ? userIdHeader[0] : userIdHeader;



    let task;
    if (firstStage) {
      task = await TaskModel.create({
        title,
        project: new Types.ObjectId(project),
        workflow: new Types.ObjectId(workflow),
        priority: priority || "MEDIUM",
        assignedUsers: assignedUserIds,
        dueDate: new Date(dueDate),
        currentStage: {
          stageId: firstStage._id,
          stageName: firstStage.name,
          order: firstStage.order
        },
        activityLog: [
          {
            action: "TASK_CREATED",
            toStage: firstStage.name,
            user: userId,
            createdAt: new Date()
          }
        ]
      });
    }

    return res.status(201).json(task);
  } catch (err: any) {
    console.error("Error creating task:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};






export const changeTaskStage = async (req: Request, res: Response) => {
  const { nextStageId } = req.body;
  const userIdHeader = req.headers.id;

  if (!userIdHeader) {
    return res.status(400).json({ message: "User ID missing in headers" });
  }

  // Express headers can be string or string[]
  const userId = Array.isArray(userIdHeader) ? userIdHeader[0] : userIdHeader;

  const task = await TaskModel.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  // Member restriction
  if (
    req.headers.role === "MEMBER" &&
    !task.assignedUsers.includes(new Types.ObjectId(userId))
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const workflow = await Workflow.findById(task.workflow);
  if (!workflow) return res.status(404).json({ message: "Workflow missing" });

  const nextStage = workflow.stages.find(
    s => s._id.toString() === nextStageId
  );
  if (!nextStage) return res.status(400).json({ message: "Invalid stage" });

  if (!isValidStageMove(task.currentStage.order, nextStage.order)) {
    return res.status(400).json({ message: "Illegal stage move" });
  }

  // update stage
  task.currentStage = {
    stageId: nextStage._id,
    stageName: nextStage.name,
    order: nextStage.order
  };

  task.activityLog.push({
    action: "STAGE_CHANGED",
    fromStage: task.currentStage.stageName,
    toStage: nextStage.name,
    user: new Types.ObjectId(userId),
    createdAt: new Date()
  });

  // 🔔 Automation

  if (nextStage.name === "Done") {
    task.completedAt = new Date();

    if (task.assignedUsers && task.assignedUsers.length > 0) {
      // Convert all users to ObjectId
      const users: Types.ObjectId[] = task.assignedUsers.map(user =>
        user instanceof Types.ObjectId ? user : new Types.ObjectId(user)
      );

      await Notification.insertMany(
        users.map(userId => ({
          user: userId,
          task: task._id,
          message: `Task "${task.title}" completed`,
          createdAt: new Date() // optional
        }))
      );
    }
  }


  await task.save();
  res.json(task);
};





export const allTask = async (req: Request, res: Response) => {
  try {
    const data = await TaskModel.find().sort({ createdAt: -1 });
    return successResponse(res, 200, "Task find successfully", data);
  } catch (error) {
    return errorResponse(res, 500, "Something went worng", error);
  }
}