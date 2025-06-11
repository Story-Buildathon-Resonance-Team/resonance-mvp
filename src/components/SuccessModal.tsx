"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink } from "lucide-react";

interface SuccessModalProps {
  result: {
    ipId?: string;
    explorerUrl?: string;
  };
  onClose: () => void;
}

export default function SuccessModal({ result, onClose }: SuccessModalProps) {
  const handleReadStory = () => {
    if (result.ipId) {
      window.location.href = `/stories/${result.ipId}`;
    }
  };

  const handleViewExplorer = () => {
    if (result.explorerUrl && result.ipId) {
      window.open(`${result.explorerUrl}/${result.ipId}`, "_blank");
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
      <Card className='w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <CardHeader className='text-center'>
          <div className='flex justify-center mb-4'>
            <CheckCircle className='h-16 w-16 text-green-500' />
          </div>
          <CardTitle className='text-2xl text-green-600'>
            Your Story is Live and Ready for Readers
          </CardTitle>
          <p className='text-muted-foreground'>
            Your story is now part of a growing library where readers can
            discover, enjoy, and build upon your creative world.
          </p>
        </CardHeader>

        <CardContent className='space-y-6'>
          {/* Benefits */}
          <div className='space-y-2 text-sm'>
            <p>✅ Readers can now easily find and connect with your work</p>
            <p>
              ✅ Other writers can expand your universe (with your chosen
              permissions)
            </p>
            <p>
              ✅ You'll earn royalties when others build successful stories in
              your world
            </p>
            <p>✅ Your story is preserved and discoverable</p>
          </div>

          <div className='text-xs text-muted-foreground italic'>
            For the tech-curious among you: your story's data signature now
            lives immortally in the Aeneid testnet archives. <em>Very</em>{" "}
            futuristic stuff.
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 pt-4'>
            {result.explorerUrl && result.ipId && (
              <Button
                variant='outline'
                className='flex-1'
                onClick={handleViewExplorer}
              >
                <ExternalLink className='h-4 w-4 mr-2' />
                View on Explorer
              </Button>
            )}
            <Button
              onClick={result.ipId ? handleReadStory : onClose}
              className='flex-1'
            >
              {result.ipId ? "Read My Story" : "Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
