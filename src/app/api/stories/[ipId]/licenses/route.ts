import { NextRequest, NextResponse } from "next/server";
import { users } from "@/data/user";
import { getIPLicensesFromStory } from "@/lib/licenses";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ipId: string }> }
) {
  try {
    const { ipId } = await params;

    if (!ipId) {
      return NextResponse.json(
        { error: "IP ID parameter is required" },
        { status: 400 }
      );
    }

    console.log(`API: Fetching license info for IP ID: ${ipId}`);

    // First, try to get licenses from Story Protocol API
    try {
      const licenses = await getIPLicensesFromStory(ipId);

      if (licenses && licenses.length > 0) {
        console.log(
          `API: Found ${licenses.length} licenses from Story Protocol for IP ID: ${ipId}`
        );

        // Extract license types from the detailed license terms
        const licenseTypes = licenses.map((license) => {
          // Map license template IDs to readable names
          switch (license.licenseTemplateId) {
            case "1":
              return "non-commercial-social-remixing";
            case "2":
              return "commercial-use";
            case "3":
              return "commercial-remix";
            default:
              return `pil-flavor-${license.licenseTemplateId}`;
          }
        });

        // Try to find story details from local data for title/author
        let storyDetails = null;
        for (const user of users) {
          const story = user.stories?.find((s: { ipId: string; title: string }) => s.ipId === ipId);
          if (story) {
            storyDetails = {
              title: story.title,
              author: user.userName || user.walletAddress,
            };
            break;
          }
        }

        return NextResponse.json({
          ipId: ipId,
          title: storyDetails?.title || "Unknown Title",
          author: storyDetails?.author || "Unknown Author",
          licenseTypes,
          licenses: licenses, // Include full license details
          source: "story-protocol-api",
        });
      }
    } catch (apiError) {
      console.warn(
        `API: Failed to fetch from Story Protocol API for IP ID ${ipId}:`,
        apiError
      );
      // Continue to fallback logic below
    }

    // Fallback: Search through user data to find the story and use default license
    console.log(`API: Falling back to static data for IP ID: ${ipId}`);

    for (const user of users) {
      const story = user.stories?.find((s: { ipId: string; title: string }) => s.ipId === ipId);
      if (story) {
        // For static user data, we default to non-commercial license
        const licenseTypes = ["non-commercial"];

        console.log(
          `API: Found story "${story.title}" with fallback licenses:`,
          licenseTypes
        );

        return NextResponse.json({
          ipId: story.ipId,
          title: story.title,
          author: user.userName || user.walletAddress,
          licenseTypes,
          source: "static-data-fallback",
        });
      }
    }

    console.log(`API: No license info found for IP ID: ${ipId}`);
    return NextResponse.json(
      { error: "Story not found or license information unavailable" },
      { status: 404 }
    );
  } catch (error) {
    console.error("API: Error fetching license info:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch license information",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
