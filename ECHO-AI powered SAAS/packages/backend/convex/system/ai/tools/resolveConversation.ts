import { createTool } from "@convex-dev/agent";
import { z } from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";

export const resolveConversation = createTool({
  description: "Resolve a conversation",
  args: z.object({}),
  handler: async (context, args) => {
    if (!context.threadId) return "Missing thread Id";

    await context.runMutation(internal.system.conversations.resolve, {
      threadId: context.threadId,
    });

    await supportAgent.saveMessage(context, {
      threadId: context.threadId,
      message: {
        role: "assistant",
        content: "Conversation resolved.",
      },
    });

    return "Conversation resolved";
  },
});
