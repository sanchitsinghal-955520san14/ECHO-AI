import { createTool } from "@convex-dev/agent";
import { z } from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";

export const escalateConversation = createTool({
  description: "Escalate a conversation",
  args: z.object({}),
  handler: async (context, args) => {
    if (!context.threadId) return "Missing thread Id";

    await context.runMutation(internal.system.conversations.escalate, {
      threadId: context.threadId,
    });

    await supportAgent.saveMessage(context, {
      threadId: context.threadId,
      message: {
        role: "assistant",
        content: "Conversation escalated to a human operator.",
      },
    });

    return "Conversation escalated to a human operator";
  },
});
