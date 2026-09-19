import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const remove = mutation({
  args: {
    service: v.union(v.literal("vapi")),
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    const existingPlugin = await context.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) =>
        q.eq("organizationId", orgId).eq("service", args.service),
      )
      .unique();

    if (!existingPlugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found",
      });
    }

    await context.db.delete(existingPlugin._id);
  },
});

export const getOne = query({
  args: {
    service: v.union(v.literal("vapi")),
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    return await context.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) =>
        q.eq("organizationId", orgId).eq("service", args.service),
      )
      .unique();
  },
});
