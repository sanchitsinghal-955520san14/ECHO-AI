import { mutation, query } from "./_generated/server";

export const getMany = query({
  args: {},
  handler: async (context) => {
    const users = await context.db.query("users").collect();

    return users;
  },
});

export const add = mutation({
  args: {},
  handler: async (context) => {
    const identity = await context.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new Error("Missing organization"); 
    }

    throw new Error("Tracking Test"); 

    const userId = await context.db.insert("users", {
      name: "JDream",
    });

    return userId;
  },
});
