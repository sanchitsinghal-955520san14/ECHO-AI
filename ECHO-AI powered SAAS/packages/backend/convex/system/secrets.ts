import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { upsertSecret } from "../lib/secrets";
import { internal } from "../_generated/api";

export const upsert = internalAction({
  args: {
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
    value: v.any(),
  },
  handler: async (context, args) => {
    const secretName = `tenant/${args.organizationId}/${args.service}`;

    await upsertSecret(secretName, args.value);

    await context.runMutation(internal.system.plugins.upsert, {
      service: args.service,
      secretName,
      organizationId: args.organizationId,
    });

    return { status: "success" };
  },
});
