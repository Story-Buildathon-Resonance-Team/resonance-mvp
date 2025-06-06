"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  ExternalLink, 
  Copy, 
  FileText,
  Hash,
  Coins
} from "lucide-react";
import { useState } from "react";

interface SuccessModalProps {
  result: {
    ipId?: string;
    txHash?: string;
    tokenId?: string;
    explorerUrl?: string;
    storyData?: any;
  };
  onClose: () => void;
}

export default function SuccessModal({ result, onClose }: SuccessModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Story Successfully Registered!
          </CardTitle>
          <p className="text-muted-foreground">
            Your story has been registered as an IP asset on Story Protocol
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* IP Asset Information */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              IP Asset Details
            </h3>
            
            {result.ipId && (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">IP Asset ID</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {result.ipId}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(result.ipId!, 'ipId')}
                >
                  {copiedField === 'ipId' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}

            {result.tokenId && (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">NFT Token ID</p>
                  <p className="text-xs text-muted-foreground">
                    #{result.tokenId}
                  </p>
                </div>
                <Badge variant="secondary">
                  <Coins className="h-3 w-3 mr-1" />
                  NFT Minted
                </Badge>
              </div>
            )}

            {result.txHash && (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Transaction Hash</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {result.txHash.slice(0, 20)}...{result.txHash.slice(-10)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(result.txHash!, 'txHash')}
                >
                  {copiedField === 'txHash' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* License Information */}
          {result.storyData && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Hash className="h-5 w-5" />
                License Information
              </h3>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">License Type</p>
                <Badge variant="outline" className="mt-1">
                  {result.storyData.licenseType === 'commercial-remix' 
                    ? 'Commercial Remix' 
                    : 'Non-Commercial Social Remixing'
                  }
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  {result.storyData.licenseType === 'commercial-remix'
                    ? 'Others can use your story commercially with 5% revenue sharing'
                    : 'Others can remix your story for non-commercial purposes'
                  }
                </p>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="space-y-4">
            <h3 className="font-semibold">What's Next?</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✅ Your story is now permanently stored on IPFS</p>
              <p>✅ IP ownership is secured by your NFT</p>
              <p>✅ License terms are enforced on-chain</p>
              <p>✅ Others can discover and potentially remix your work</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {result.explorerUrl && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open(result.explorerUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </Button>
            )}
            <Button onClick={onClose} className="flex-1">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}