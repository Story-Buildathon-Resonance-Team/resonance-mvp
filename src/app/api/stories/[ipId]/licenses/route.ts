import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/data/user';

export async function GET(
  request: NextRequest,
  { params }: { params: { ipId: string } }
) {
  try {
    const { ipId } = params;
    
    if (!ipId) {
      return NextResponse.json(
        { error: 'IP ID parameter is required' },
        { status: 400 }
      );
    }

    console.log(`API: Fetching license info for IP ID: ${ipId}`);

    // Search through user data to find the story
    for (const user of users) {
      const story = user.stories?.find((s: any) => s.ipId === ipId);
      if (story) {
        // For static user data, we default to non-commercial license
        // In a real implementation, this would query the Story Protocol
        const licenseTypes = ['non-commercial'];
        
        console.log(`API: Found story "${story.title}" with licenses:`, licenseTypes);
        
        return NextResponse.json({
          ipId: story.ipId,
          title: story.title,
          author: user.userName || user.walletAddress,
          licenseTypes,
          source: 'static-data'
        });
      }
    }
    console.log(`API: No license info found for IP ID: ${ipId}`);
    return NextResponse.json(
      { error: 'Story not found or license information unavailable' },
      { status: 404 }
    );

  } catch (error) {
    console.error('API: Error fetching license info:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch license information',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}