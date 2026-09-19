import ConversationIdLayout from "@/modules/dashboard/ui/layouts/conversation-id-layout";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ConversationIdLayout>{children}</ConversationIdLayout>;
}
