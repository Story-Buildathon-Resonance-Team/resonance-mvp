"use client";

import { useConnectModal } from "@tomo-inc/tomo-evm-kit";

export const useConnect = () => {
  const { openConnectModal } = useConnectModal();

  const handleConnect = () => {
    if (openConnectModal) {
      try {
        openConnectModal();
      } catch (error) {
        console.error("Error calling openConnectModal:", error);
      }
    } else {
      console.error("openConnectModal is not available");
    }
  };

  return { handleConnect };
};
