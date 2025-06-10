import { NextRequest, NextResponse } from "next/server";
import { CommercialUseOnlyTermsId } from "@/utils/utils";

// Set cache control headers for 15 minutes
export const revalidate = 900; // 15 minutes in seconds

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ipId: string }> }
) {
  // Await params before using its properties
  const resolvedParams = await params;
  const ipId = resolvedParams.ipId;

  try {
    // Fetch licenses from Story Protocol API
    const response = await fetch(
      `https://api.storyapis.com/api/v3/assets/${ipId}/licenses`,
      {
        headers: {
          "X-Api-Key": process.env.X_API_KEY!,
          "X-Chain": process.env.X_CHAIN!,
        },
        next: { revalidate },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch license data: ${response.statusText}` },
        { status: response.status }
      );
    }

    const apiResponse = await response.json();
    const licenses = apiResponse.data || [];

    if (!licenses || licenses.length === 0) {
      // No licenses found
      return NextResponse.json({
        hasLicenses: false,
        isCommercialUseOnly: false,
        allowsRemix: true, // Default to allowing remix if no licenses
        licenseCount: 0,
        licenses: [],
      });
    }

    // Filter out disabled licenses
    const activeLicenses = licenses.filter((license: any) => !license.disabled);

    // Check if there's only one license and it's Commercial Use Only (ID "2")
    const isCommercialUseOnly =
      activeLicenses.length === 1 &&
      activeLicenses[0].licenseTermsId === CommercialUseOnlyTermsId;

    // Commercial Use Only doesn't allow derivatives/remixes
    const allowsRemix = !isCommercialUseOnly;

    return NextResponse.json({
      hasLicenses: activeLicenses.length > 0,
      isCommercialUseOnly,
      allowsRemix,
      licenseCount: activeLicenses.length,
      licenses: activeLicenses.map((license: any) => ({
        id: license.id,
        licenseTermsId: license.licenseTermsId,
        disabled: license.disabled,
      })),
    });
  } catch (error) {
    console.error("Error fetching license data from Story:", error);
    return NextResponse.json(
      { error: "Failed to fetch license data from Story Protocol" },
      { status: 500 }
    );
  }
}
