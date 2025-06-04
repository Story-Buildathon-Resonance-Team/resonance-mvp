"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Card className='max-w-md w-full'>
        <CardHeader>
          <CardTitle>Welcome to Resonance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-gray-700'>
            This is a demo application showcasing the Story Protocol. You can
            create, manage, and view your stories seamlessly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
