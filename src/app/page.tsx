"use client";

import { useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useConnectModal } from "@tomo-inc/tomo-evm-kit";
import { useAccount } from "wagmi";

export default function LoginTest() {
  const { openConnectModal } = useConnectModal();

  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      console.log("Connected address:", address);
    } else {
      console.log("Not connected");
    }
  }, [isConnected, address]);

  return (
    <Card className='w-full max-w-md mx-auto mt-10'>
      <CardContent>
        <div className='mt-6 flex flex-col items-center space-y-4'>
          {isConnected ? (
            <p className='text-sm text-gray-700'>
              Connected: <span className='font-mono'>{address}</span>
            </p>
          ) : (
            <p className='text-sm text-gray-500'>No wallet connected yet</p>
          )}

          <Button variant='outline' onClick={() => openConnectModal()}>
            {isConnected ? "Reconnect / Switch" : "Login with Tomo"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
