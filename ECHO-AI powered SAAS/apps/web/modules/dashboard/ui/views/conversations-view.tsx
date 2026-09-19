import Image from "next/image";

export const ConversationsView = () => { 
  return (
    <div className="flex h-full flex-1 flex-col gap-y-4 bg-muted">
      <div className="flex flex-1 items-center justify-center gap-x-2">
        <Image alt="Logo" height={80} width={80} src="/RelayLogo.png" />
        {/* <p className="font-semibold text-lg">Relay</p> */}
      </div>
    </div>
  );
};
