import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";

export const upsert = internalMutation({
  args: {
    service: v.union(v.literal("vapi")),
    secretName: v.string(),
    organizationId: v.string(),
  },
  handler: async (context, args) => {
    const existingPlugin = await context.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) =>
        q.eq("organizationId", args.organizationId).eq("service", args.service),
      )
      .unique();

    if (existingPlugin) {
      await context.db.patch(existingPlugin._id, {
        service: args.service,
        secretName: args.secretName,
      });
    } else {
      await context.db.insert("plugins", {
        organizationId: args.organizationId,
        service: args.service,
        secretName: args.secretName,
      });
    }
  },
});

export const getByOrganizationIdAndService = internalQuery({
  args: {
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
  },
  handler: async (context, args) => {
    return await context.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) =>
        q.eq("organizationId", args.organizationId).eq("service", args.service),
      )
      .unique();
  },
});
