import { ConvexError, v } from "convex/values";
import { action, query } from "../_generated/server";
import { components, internal } from "../_generated/api";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { paginationOptsValidator } from "convex/server";
import { resolveConversation } from "../system/ai/tools/resolveConversation";
import { escalateConversation } from "../system/ai/tools/escalateConversation";
import { saveMessage } from "@convex-dev/agent";
import { search } from "../system/ai/tools/search";

export const create = action({
  args: {
    prompt: v.string(),
    threadId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (context, args) => {
    const contactSession = await context.runQuery(
      internal.system.contactSessions.getOne,
      {
        contactSessionId: args.contactSessionId,
      },
    );

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid Session",
      });
    }

    const conversation = await context.runQuery(
      internal.system.conversations.getByThreadId,
      {
        threadId: args.threadId,
      },
    );

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    if (conversation.status === "resolved") {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Conversation resolved",
      });
    }

    //* This refreshes the user's session if they are within the threshold
    await context.runMutation(internal.system.contactSessions.refresh, {
      contactSessionId: args.contactSessionId,
    });

    const subscription = await context.runQuery(
      internal.system.subscriptions.getByOrganizationId,
      {
        organizationId: conversation.organizationId,
      },
    );

    const shouldTriggerAgent =
      conversation.status === "unresolved" && subscription?.status === "active";

    if (shouldTriggerAgent) {
      try {
        await supportAgent.generateText(
          context,
          { threadId: args.threadId },
          {
            prompt: args.prompt,
            tools: {
              resolveConversationTool: resolveConversation,
              escalateConversationTool: escalateConversation,
              searchTool: search,
            },
          },
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const isRateLimit =
          message.includes("quota") ||
          message.includes("rate") ||
          message.includes("429");

        if (isRateLimit) {
          // User message already saved by generateText internally, just respond
          await saveMessage(context, components.agent, {
            threadId: args.threadId,
            message: {
              role: "assistant",
              content:
                "I'm temporarily unavailable due to high demand. Please try again in a moment.",
            },
          });
        }
      }
    } else {
      await saveMessage(context, components.agent, {
        threadId: args.threadId,
        prompt: args.prompt,
      });
    }
  },
});

export const getMany = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (context, args) => {
    const contactSession = await context.db.get(args.contactSessionId);

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid Session",
      });
    }

    const paginated = await supportAgent.listMessages(context, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });

    return paginated;
  },
});
