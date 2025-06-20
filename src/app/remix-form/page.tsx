"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Upload,
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  FileText,
  Scale,
  CheckCircle,
  Info,
  ImageIcon,
  Save,
  LinkIcon,
  AlertCircle,
} from "lucide-react";
import { registerStoryAsIP } from "../../services/storyService";
import { uploadStoryToPinata } from "../../utils/pinata";
import { useUser } from "../Web3Providers";
import { usePublishStore, useStoryStore } from "@/stores";
import { users } from "../../data/user";
import SuccessModal from "../../components/SuccessModal";
import StoryUploadFormStep1 from "../../components/StoryUploadFormStep1";
import {
  getParentAssetLicenseInfo,
  determineLicenseInheritance,
  validateDerivativeLicenseSelection,
  formatLicenseForDisplay,
  LicenseType,
  ParentAssetLicenseInfo,
} from "../../services/licenseService";

// Base schema without refinement
const baseSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  contentType: z.enum(["text", "pdf"], {
    required_error: "Please select content type",
  }),
  content: z.string().optional(),
  storyFile: z.instanceof(File).optional(),
  coverImage: z.instanceof(File, { message: "Cover image is required" }),
  licenseType: z.enum(
    ["non-commercial", "commercial-use", "commercial-remix"],
    {
      required_error: "Please select a license type",
    }
  ),
});

// Complete form schema with refinement
const completeSchema = baseSchema.refine(
  (data) => {
    if (data.contentType === "text") {
      return data.content && data.content.length >= 50;
    } else if (data.contentType === "pdf") {
      return data.storyFile && data.storyFile.type === "application/pdf";
    }
    return false;
  },
  {
    message:
      "Please provide either text content (min 50 characters) or upload a PDF file",
    path: ["content"],
  }
);

// Step-specific schemas for validation
const storyContentSchema = baseSchema.pick({
  title: true,
  description: true,
  contentType: true,
  content: true,
  storyFile: true,
  coverImage: true,
});

const licenseSchema = baseSchema.pick({
  licenseType: true,
});

type FormData = z.infer<typeof completeSchema>;

interface RemixStoryFormProps {
  onSuccess?: (result: unknown) => void;
}

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  schema: z.ZodSchema<unknown>;
}

// Remix-specific step order (License first)
const remixSteps: Step[] = [
  {
    id: 1,
    title: "License Inheritance",
    description: "Review inherited license terms from parent IP",
    icon: Scale,
    schema: licenseSchema,
  },
  {
    id: 2,
    title: "Create Remix",
    description: "Upload your remix content and cover image",
    icon: FileText,
    schema: storyContentSchema,
  },
  {
    id: 3,
    title: "Review & Publish",
    description: "Review and publish your remix",
    icon: CheckCircle,
    schema: completeSchema,
  },
];

// Original Story Context Card Component
const OriginalStoryCard = ({ originalStory }: { originalStory: unknown }) => (
  <Card className='mb-6 border-primary/20'>
    <CardContent className='p-4'>
      <div className='flex items-center gap-2 mb-2'>
        <LinkIcon className='h-4 w-4' />
        <span className='text-sm font-medium'>Remixing:</span>
      </div>
      <h3 className='font-semibold'>
        {(originalStory as { title: string }).title}
      </h3>
      <p className='text-sm text-muted-foreground'>
        by {(originalStory as { author: string }).author}
      </p>
      <Badge variant='outline' className='mt-2'>
        {(originalStory as { licenseType?: string }).licenseType ||
          "Non-Commercial"}
      </Badge>
    </CardContent>
  </Card>
);

export default function RemixStoryForm({ onSuccess }: RemixStoryFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const originalStoryId = searchParams.get("originalStoryId");
  const suggestionText = searchParams.get("suggestion");

  // State for original story data
  const [originalStory, setOriginalStory] = useState<unknown>(null);
  const [loadingOriginalStory, setLoadingOriginalStory] = useState(true);

  // State for license inheritance
  const [parentLicenseInfo, setParentLicenseInfo] =
    useState<ParentAssetLicenseInfo | null>(null);
  const [licenseInheritance, setLicenseInheritance] = useState<ReturnType<
    typeof determineLicenseInheritance
  > | null>(null);
  const [selectedLicense, setSelectedLicense] = useState<LicenseType | null>(
    null
  );

  // Replace useState with Zustand store
  const {
    currentStep,
    formData,
    isSubmitting,
    submitStatus,
    setCurrentStep,
    updateFormData,
    setIsSubmitting,
    setSubmitStatus,
    resetForm,
  } = usePublishStore();

  const { addPublishedStory, publishedStories } = useStoryStore();
  const [successResult, setSuccessResult] = useState<unknown>(null);

  const { address, isConnected, userName } = useUser();

  // Fetch original story data and license information
  useEffect(() => {
    const fetchStoryAndLicenseInfo = async () => {
      if (originalStoryId) {
        const findStory = () => {
          // First check the store for published stories (custom stories)
          const storeStory = publishedStories.find(
            (s) => s.ipId === originalStoryId
          );
          if (storeStory) {
            return {
              ipId: storeStory.ipId,
              title: storeStory.title,
              description: storeStory.description,
              author:
                storeStory.author.name ||
                storeStory.author.address.slice(0, 8) + "...",
              licenseType: storeStory.licenseTypes?.[0] || "non-commercial", // Use first license type
              licenseTypes: storeStory.licenseTypes || ["non-commercial"], // All license types
              contentCID: storeStory.contentCID,
              imageCID: storeStory.imageCID,
            };
          }

          // Fallback to static user data (preloaded stories)
          for (const user of users) {
            const foundStory = user.stories.find(
              (s) => s.ipId === originalStoryId
            );
            if (foundStory) {
              return {
                ...foundStory,
                author: user.userName || user.walletAddress.slice(0, 8) + "...",
                licenseType: "non-commercial", // Default for static stories
                licenseTypes: ["non-commercial"], // Default for static stories
              };
            }
          }
          return null;
        };

        const foundStory = findStory();
        setOriginalStory(foundStory);

        // Get detailed license information
        if (foundStory) {
          try {
            const licenseInfo = await getParentAssetLicenseInfo(
              originalStoryId,
              publishedStories,
              users
            );

            if (licenseInfo) {
              setParentLicenseInfo(licenseInfo);

              // Determine inheritance requirements
              const parentLicenseTypes = licenseInfo.licenses.map(
                (l) => l.type
              );
              const inheritance =
                determineLicenseInheritance(parentLicenseTypes);
              setLicenseInheritance(inheritance);

              // If automatic inheritance, set the license
              if (
                !inheritance.requiresSelection &&
                inheritance.inheritedLicense
              ) {
                setSelectedLicense(inheritance.inheritedLicense.type);
              }
            }
          } catch (error) {
            console.error("Error fetching license information:", error);
          }
        }

        setLoadingOriginalStory(false);
      } else {
        setLoadingOriginalStory(false);
      }
    };

    fetchStoryAndLicenseInfo();
  }, [originalStoryId, publishedStories]);

  // Get author name from user data or fallback to wallet address
  const getAuthorName = (): string => {
    if (!address) return "";

    // Find user in the users array by wallet address
    const userEntry = users.find(
      (user) => user.walletAddress.toLowerCase() === address.toLowerCase()
    );

    if (userEntry && userEntry.userName) {
      return userEntry.userName;
    }

    // If no user found or no userName, use the userName from context or shortened address
    return userName || `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const authorName = getAuthorName();

  // Pre-populate form with remix-specific defaults and license inheritance
  const defaultValues = {
    title: originalStory
      ? `Remix of ${(originalStory as { title: string }).title}`
      : "",
    description: suggestionText ? decodeURIComponent(suggestionText) : "",
    contentType: "text" as const,
    content: "",
    // Inherit license from parent story, with fallback to non-commercial
    licenseType:
      ((originalStory as { licenseType?: string })?.licenseType as
        | "non-commercial"
        | "commercial-use"
        | "commercial-remix") || ("non-commercial" as const),
  };

  const form = useForm<FormData>({
    resolver: zodResolver(completeSchema),
    defaultValues,
    mode: "onChange",
  });

  // Update form when original story and license information loads
  useEffect(() => {
    if (originalStory && !form.watch("title")) {
      form.setValue(
        "title",
        `Remix of ${(originalStory as { title: string }).title}`
      );
      updateFormData({
        title: `Remix of ${(originalStory as { title: string }).title}`,
      });
    }

    if (suggestionText && !form.watch("description")) {
      const decodedSuggestion = decodeURIComponent(suggestionText);
      form.setValue("description", decodedSuggestion);
      updateFormData({ description: decodedSuggestion });
    }

    // Set license based on inheritance logic
    if (licenseInheritance && selectedLicense && !form.watch("licenseType")) {
      form.setValue("licenseType", selectedLicense);
      updateFormData({ licenseType: selectedLicense });
    }
  }, [
    originalStory,
    suggestionText,
    licenseInheritance,
    selectedLicense,
    form,
    updateFormData,
  ]);

  // Auto-save form data to store whenever form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData(value);
    });
    return () => subscription.unsubscribe();
  }, [form, updateFormData]);

  const getCurrentStepSchema = () => {
    return (
      remixSteps.find((step) => step.id === currentStep)?.schema ||
      completeSchema
    );
  };

  const validateCurrentStep = async () => {
    const currentSchema = getCurrentStepSchema();
    const formData = form.getValues();

    // Additional validation for license selection step
    if (currentStep === 1 && licenseInheritance?.requiresSelection) {
      if (!selectedLicense || !formData.licenseType) {
        form.setError("licenseType", {
          type: "manual",
          message: "Please select a license for your remix",
        });
        return false;
      }

      // Validate that the selected license is valid
      if (parentLicenseInfo) {
        const validation = validateDerivativeLicenseSelection(
          parentLicenseInfo.licenses.map((l) => l.type),
          selectedLicense
        );

        if (!validation.isValid) {
          form.setError("licenseType", {
            type: "manual",
            message: validation.error || "Invalid license selection",
          });
          return false;
        }
      }
    }

    try {
      await currentSchema.parseAsync(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          form.setError(err.path[0] as keyof FormData, {
            type: "manual",
            message: err.message,
          });
        });
      }
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < remixSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const fillSampleStory = () => {
    const sampleData = {
      title: originalStory
        ? `Remix of ${(originalStory as { title: string }).title}`
        : "Your remix title here",
      description: suggestionText
        ? decodeURIComponent(suggestionText)
        : "A brief description of your remix. 1-2 sentences is enough.",
      contentType: "text" as const,
      content: `Hey, you liked the story? Come on, get those creative juices flowing and add to this universe. Maybe you came up with a song? A character's origin story? Write it here, share your creative vision with the world. This remix is based on &quot;${
        (originalStory as { title: string })?.title || "the original story"
      }&quot; and should credit the original author while adding your unique creative vision.`,
    };

    // Update form
    form.setValue("title", sampleData.title);
    form.setValue("description", sampleData.description);
    form.setValue("contentType", sampleData.contentType);
    form.setValue("content", sampleData.content);

    // Update store
    updateFormData(sampleData);
  };

  const onSubmit = async (data: FormData) => {
    if (!address) {
      setSubmitStatus({
        type: "error",
        message:
          "Wallet address not available. Please ensure you are logged in.",
      });
      return;
    }

    if (!originalStoryId) {
      setSubmitStatus({
        type: "error",
        message:
          "Original story ID not found. Please navigate from a story page.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      setSubmitStatus({ type: null, message: "Uploading remix to IPFS..." });

      const pinataResult = await uploadStoryToPinata({
        title: data.title,
        content: data.content,
        storyFile: data.storyFile,
        contentType: data.contentType,
        coverImage: data.coverImage,
        author: authorName,
        description: data.description,
      });

      setSubmitStatus({
        type: null,
        message: "Registering remix on Story Protocol...",
      });

      // Include original story reference in remix data
      const remixData = {
        title: data.title,
        description: data.description,
        contentCID: pinataResult.contentCID,
        imageCID: pinataResult.imageCID,
        author: {
          name: authorName,
          address: address,
        },
        licenseType: data.licenseType,
        originalStoryId,
        originalTitle: (originalStory as { title: string })?.title,
        originalAuthor: (originalStory as { author: string })?.author,
      };

      const registrationResult = await registerStoryAsIP(remixData);

      if (registrationResult.success && registrationResult.ipId) {
        setSubmitStatus({
          type: "success",
          message: `Remix successfully registered! IP ID: ${registrationResult.ipId}`,
        });

        console.log("Remix registered successfully:", {
          ipId: registrationResult.ipId,
          txHash: registrationResult.txHash,
          tokenId: registrationResult.tokenId,
          explorerUrl: registrationResult.explorerUrl,
          originalStoryId,
        });

        // Show success modal
        setSuccessResult(registrationResult);

        // Add to published stories store
        addPublishedStory({
          ipId: registrationResult.ipId,
          title: data.title,
          description: data.description,
          author: {
            name: authorName,
            address: address,
          },
          contentCID: pinataResult.contentCID,
          imageCID: pinataResult.imageCID,
          nftMetadataCID: pinataResult.contentCID, // Using contentCID as fallback
          ipMetadataCID: pinataResult.contentCID, // Using contentCID as fallback
          txHash: registrationResult.txHash || "",
          tokenId: registrationResult.tokenId || "",
          licenseTypes: [data.licenseType], // Convert single license to array
          publishedAt: Date.now(),
          explorerUrl: registrationResult.explorerUrl || "",
          originalStoryId, // Track as remix
        });

        form.reset();
        resetForm();
        onSuccess?.(registrationResult);
      } else {
        throw new Error(
          registrationResult.error || "Registration failed - no IP ID returned"
        );
      }
    } catch (error) {
      console.error("Remix submission error:", error);
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / remixSteps.length) * 100;
  const currentStepData = remixSteps.find((step) => step.id === currentStep);

  // Loading state for original story
  if (loadingOriginalStory) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='flex items-center gap-3 text-foreground'>
          <Loader2 className='h-8 w-8 animate-spin' />
          <span className='text-lg'>Loading original story...</span>
        </div>
      </div>
    );
  }

  // Error state if no original story found
  if (originalStoryId && !originalStory) {
    return (
      <Card className='w-full max-w-6xl mx-auto'>
        <CardContent className='p-8'>
          <Alert>
            <Info className='h-4 w-4' />
            <AlertDescription>
              Original story not found. Please navigate from a valid story page
              to create a remix.
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => router.back()}
            className='mt-4 cursor-pointer'
            variant='outline'
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!isConnected || !address) {
    return (
      <Card className='w-full max-w-6xl mx-auto'>
        <CardContent className='p-8'>
          <Alert>
            <Info className='h-4 w-4' />
            <AlertDescription>
              Please connect your wallet to create a remix.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {successResult && (
        <SuccessModal
          result={successResult}
          onClose={() => setSuccessResult(null)}
        />
      )}

      {/* Header */}
      <br />
      <br />
      <div className='text-center space-y-4'>
        <div className='flex items-center justify-center gap-2 mb-4'>
          <h1 className='text-3xl font-bold'>Remix. Transform. Inspire.</h1>
        </div>
        <p className='text-xl text-muted-foreground'>
          Take inspiration from great stories and make them your own.
        </p>
        {formData.lastSaved && (
          <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
            <Save className='h-4 w-4' />
            Auto-saved {new Date(formData.lastSaved).toLocaleTimeString()}
          </div>
        )}
      </div>
      <br />
      <br />

      {/* Original Story Context
      {originalStory && <OriginalStoryCard originalStory={originalStory} />} */}

      <Card className='w-full max-w-6xl mx-auto'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Sparkles className='h-5 w-5' />
                Create Your Remix
              </CardTitle>
              <CardDescription>
                Create a remix of &quot;
                {(originalStory as { title: string })?.title ||
                  "the original story"}
                &quot; and register it as intellectual property.
              </CardDescription>
            </div>
            <Badge variant='outline'>
              Step {currentStep} of {remixSteps.length}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className='space-y-2'>
            <Progress value={progress} className='h-2' />
            <div className='flex justify-between text-sm text-muted-foreground'>
              {remixSteps.map((step) => (
                <div key={step.id} className='flex flex-col items-center gap-1'>
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      step.id === currentStep
                        ? "border-primary bg-primary text-primary-foreground"
                        : step.id < currentStep
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-muted-foreground/20"
                    }`}
                  >
                    {step.id < currentStep ? (
                      <CheckCircle className='h-4 w-4' />
                    ) : (
                      <step.icon className='h-4 w-4' />
                    )}
                  </div>
                  <span
                    className={`text-xs ${
                      step.id === currentStep ? "font-medium" : ""
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* Current Step Header */}
              {currentStepData && (
                <div className='flex items-center gap-3 p-4 bg-muted/50 rounded-lg'>
                  <currentStepData.icon className='h-6 w-6 text-primary' />
                  <div>
                    <h3 className='font-semibold'>{currentStepData.title}</h3>
                    <p className='text-sm text-muted-foreground'>
                      {currentStepData.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Step 1: License Inheritance */}
              {currentStep === 1 && (
                <div className='space-y-6'>
                  {parentLicenseInfo && licenseInheritance && (
                    <div className='space-y-4'>
                      {/* Parent Story Information */}
                      <div className='p-6 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-lg backdrop-blur-sm'>
                        <div className='flex items-start gap-4'>
                          <div className='p-2 bg-primary/20 rounded-lg'>
                            <LinkIcon className='h-6 w-6 text-primary' />
                          </div>
                          <div className='space-y-3 flex-1'>
                            <div className='text-lg font-semibold text-foreground'>
                              Remixing: "{parentLicenseInfo.title}"
                            </div>
                            <div className='text-sm text-muted-foreground'>
                              by {parentLicenseInfo.author}
                            </div>
                            <div className='text-sm text-foreground/80 leading-relaxed'>
                              {parentLicenseInfo.hasMultipleLicenses
                                ? "This parent asset has multiple licenses. You must select one for your remix."
                                : "Your remix will automatically inherit the license from the parent asset."}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* License Inheritance Logic */}
                      {!licenseInheritance.requiresSelection ? (
                        // Automatic inheritance - single license
                        <div className='p-6 border border-primary/30 rounded-lg bg-card/50 backdrop-blur-sm'>
                          <h3 className='text-lg font-semibold mb-4 text-foreground'>
                            License Automatically Inherited
                          </h3>

                          <div className='space-y-4'>
                            <div className='flex items-center justify-between p-4 bg-card/30 border border-primary/20 rounded-lg backdrop-blur-sm'>
                              <div className='space-y-1'>
                                <div className='font-medium text-foreground'>
                                  Parent Story
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                  "{parentLicenseInfo.title}" by{" "}
                                  {parentLicenseInfo.author}
                                </div>
                              </div>
                              <Badge
                                variant='outline'
                                className='bg-primary/10 text-primary border-primary/30'
                              >
                                Original
                              </Badge>
                            </div>

                            <div className='flex items-center justify-center'>
                              <div className='w-px h-8 bg-primary/30'></div>
                            </div>

                            <div className='flex items-center justify-between p-4 bg-primary/10 border-2 border-primary/40 rounded-lg backdrop-blur-sm'>
                              <div className='space-y-1'>
                                <div className='font-medium text-foreground'>
                                  Your Remix
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                  Will inherit:{" "}
                                  {licenseInheritance.inheritedLicense?.name}
                                </div>
                              </div>
                              <Badge className='bg-primary/20 text-primary border-primary/40'>
                                {
                                  formatLicenseForDisplay(
                                    licenseInheritance.inheritedLicense!
                                  ).badge
                                }
                              </Badge>
                            </div>
                          </div>

                          <div className='mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg backdrop-blur-sm'>
                            <div className='flex items-start gap-3'>
                              <div className='p-1 bg-green-500/20 rounded'>
                                <CheckCircle className='h-4 w-4 text-green-400' />
                              </div>
                              <div className='text-sm text-green-300'>
                                <strong>Automatic Inheritance:</strong> Since
                                the parent asset has a single license, your
                                remix will automatically inherit all terms,
                                ensuring compliance with Story Protocol.
                              </div>
                            </div>
                          </div>

                          {/* Hidden form field to store the inherited license */}
                          <FormField
                            control={form.control}
                            name='licenseType'
                            render={({ field }) => (
                              <input
                                type='hidden'
                                value={
                                  licenseInheritance.inheritedLicense?.type ||
                                  "non-commercial"
                                }
                                onChange={field.onChange}
                              />
                            )}
                          />
                        </div>
                      ) : (
                        // Multiple licenses - requires selection
                        <div className='p-6 border border-primary/30 rounded-lg bg-card/50 backdrop-blur-sm'>
                          <h3 className='text-lg font-semibold mb-4 text-foreground'>
                            Select License for Your Remix
                          </h3>

                          <div className='mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg backdrop-blur-sm'>
                            <div className='flex items-start gap-3'>
                              <div className='p-1 bg-amber-500/20 rounded'>
                                <AlertCircle className='h-4 w-4 text-amber-400' />
                              </div>
                              <div className='text-sm text-amber-300'>
                                <strong>Multiple Licenses Available:</strong>{" "}
                                The parent asset is published under multiple
                                licenses. You must choose one for your remix.
                              </div>
                            </div>
                          </div>

                          <FormField
                            control={form.control}
                            name='licenseType'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Available Licenses</FormLabel>
                                <FormControl>
                                  <div className='space-y-3'>
                                    {licenseInheritance.availableLicenses.map(
                                      (license) => {
                                        const displayInfo =
                                          formatLicenseForDisplay(license);
                                        return (
                                          <div
                                            key={license.id}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all backdrop-blur-sm ${
                                              field.value === license.type
                                                ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                                                : "border-primary/20 bg-card/30 hover:border-primary/40 hover:bg-card/50"
                                            }`}
                                            onClick={() => {
                                              field.onChange(license.type);
                                              setSelectedLicense(license.type);
                                            }}
                                          >
                                            <div className='flex items-start justify-between'>
                                              <div className='space-y-2 flex-1'>
                                                <div className='flex items-center gap-2'>
                                                  <div className='font-medium text-foreground'>
                                                    {displayInfo.title}
                                                  </div>
                                                  <Badge
                                                    variant='outline'
                                                    className='border-primary/30 text-primary'
                                                  >
                                                    {displayInfo.badge}
                                                  </Badge>
                                                </div>
                                                <div className='text-sm text-muted-foreground'>
                                                  {displayInfo.description}
                                                </div>
                                                <div className='flex flex-wrap gap-1'>
                                                  {displayInfo.features.map(
                                                    (feature, index) => (
                                                      <Badge
                                                        key={index}
                                                        variant='secondary'
                                                        className='text-xs bg-secondary/50 text-secondary-foreground border-secondary/30'
                                                      >
                                                        {feature}
                                                      </Badge>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                              <div
                                                className={`w-4 h-4 rounded-full border-2 ${
                                                  field.value === license.type
                                                    ? "border-primary bg-primary"
                                                    : "border-muted-foreground/30"
                                                }`}
                                              >
                                                {field.value ===
                                                  license.type && (
                                                  <div className='w-full h-full rounded-full bg-card scale-50'></div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {selectedLicense && (
                            <div className='mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg backdrop-blur-sm'>
                              <div className='flex items-start gap-3'>
                                <div className='p-1 bg-green-500/20 rounded'>
                                  <CheckCircle className='h-4 w-4 text-green-400' />
                                </div>
                                <div className='text-sm text-green-300'>
                                  <strong>License Selected:</strong> Your remix
                                  will inherit the selected license terms and
                                  comply with all associated requirements.
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {licenseInheritance.error && (
                        <div className='p-6 border border-red-500/30 bg-red-500/10 rounded-lg backdrop-blur-sm'>
                          <div className='flex items-center gap-3'>
                            <AlertCircle className='h-5 w-5 text-red-400' />
                            <div className='text-sm text-red-300'>
                              <strong>License Error:</strong>{" "}
                              {licenseInheritance.error}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!parentLicenseInfo && (
                    <div className='p-6 border border-red-500/30 bg-red-500/10 rounded-lg backdrop-blur-sm'>
                      <div className='flex items-center gap-3'>
                        <AlertCircle className='h-5 w-5 text-red-400' />
                        <div className='text-sm text-red-300'>
                          Unable to load parent story license information.
                          Please try again or contact support.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Create Remix Content */}
              {currentStep === 2 && (
                <StoryUploadFormStep1
                  form={form}
                  authorName={authorName}
                  fillSampleStory={fillSampleStory}
                />
              )}

              {/* Step 3: Review & Publish */}
              {currentStep === 3 && (
                <div className='space-y-6'>
                  <Alert>
                    <CheckCircle className='h-4 w-4' />
                    <AlertDescription>
                      Please review your remix details before registering as
                      intellectual property.
                    </AlertDescription>
                  </Alert>

                  <div className='space-y-4'>
                    {/* Original Story Attribution */}
                    {originalStory && (
                      <div className='grid gap-4 p-4 border rounded-lg bg-muted/20'>
                        <h3 className='font-semibold text-primary'>
                          Original Story Attribution
                        </h3>
                        <div className='grid gap-2 text-sm'>
                          <div>
                            <strong>Original Title:</strong>{" "}
                            {(originalStory as { title: string }).title}
                          </div>
                          <div>
                            <strong>Original Author:</strong>{" "}
                            {(originalStory as { author: string }).author}
                          </div>
                          <div>
                            <strong>Original License:</strong>{" "}
                            {(originalStory as { licenseType?: string })
                              .licenseType || "Non-Commercial"}
                          </div>
                          <div className='text-xs text-muted-foreground mt-2'>
                            This remix will automatically include proper
                            attribution to the original work.
                          </div>
                        </div>
                      </div>
                    )}

                    <div className='grid gap-4 p-4 border rounded-lg'>
                      <h3 className='font-semibold'>Your Remix Details</h3>
                      <div className='grid gap-2 text-sm'>
                        <div>
                          <strong>Title:</strong> {form.watch("title")}
                        </div>
                        <div>
                          <strong>Description:</strong>{" "}
                          {form.watch("description")}
                        </div>
                        <div>
                          <strong>Author:</strong> {authorName}
                        </div>
                        <div>
                          <strong>License:</strong>{" "}
                          {form.watch("licenseType") === "non-commercial"
                            ? "Non-Commercial Remix License"
                            : form.watch("licenseType") === "commercial-use"
                            ? "Commercial Use License"
                            : "Commercial Remix License"}
                        </div>
                        <div>
                          <strong>Content Type:</strong>{" "}
                          {form.watch("contentType") === "text"
                            ? "Text Content"
                            : "PDF File"}
                        </div>
                        {form.watch("contentType") === "text" && (
                          <div>
                            <strong>Content Length:</strong>{" "}
                            {form.watch("content")?.length || 0} characters
                          </div>
                        )}
                        {form.watch("contentType") === "pdf" &&
                          form.watch("storyFile") && (
                            <div>
                              <strong>PDF File:</strong>{" "}
                              {form.watch("storyFile")?.name} (
                              {(
                                (form.watch("storyFile")?.size || 0) /
                                1024 /
                                1024
                              ).toFixed(2)}{" "}
                              MB)
                            </div>
                          )}
                        <div>
                          <strong>Cover Image:</strong>{" "}
                          {form.watch("coverImage")
                            ? form.watch("coverImage")?.name
                            : "None"}
                        </div>
                      </div>
                    </div>

                    <div className='p-4 bg-muted/50 rounded-lg'>
                      <h4 className='font-medium mb-2'>What happens next?</h4>
                      <ol className='text-sm space-y-1 list-decimal list-inside text-muted-foreground'>
                        <li>Your remix and images will be uploaded to IPFS</li>
                        <li>
                          Original story attribution will be included in
                          metadata
                        </li>
                        <li>
                          Your remix will be registered as an IP Asset on Story
                          Protocol
                        </li>
                        <li>
                          Licensing relationships will be established with the
                          original work
                        </li>
                        <li>
                          You&apos;ll receive an NFT representing ownership of
                          your remix IP
                        </li>
                        <li>
                          Others can discover your remix based on your chosen
                          license
                        </li>
                      </ol>
                    </div>
                  </div>

                  {submitStatus.message && (
                    <Alert
                      className={
                        submitStatus.type === "error"
                          ? "border-destructive bg-destructive/10"
                          : "border-green-500/30 bg-green-500/10"
                      }
                    >
                      {submitStatus.type === "error" ? (
                        <div className='space-y-2'>
                          <div className='font-medium text-destructive'>
                            Registration Failed
                          </div>
                          <AlertDescription className='text-sm'>
                            {submitStatus.message}
                          </AlertDescription>
                          <div className='text-xs text-muted-foreground'>
                            This is usually due to license compatibility issues.
                            Please try again or contact support if the problem
                            persists.
                          </div>
                        </div>
                      ) : (
                        <AlertDescription className='text-green-300'>
                          {submitStatus.message}
                        </AlertDescription>
                      )}
                    </Alert>
                  )}
                </div>
              )}

              <Separator />

              {/* Navigation Buttons */}
              <div className='flex justify-between'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handlePrevious}
                  disabled={currentStep === 1 || isSubmitting}
                  className='flex items-center gap-2 cursor-pointer'
                >
                  <ChevronLeft className='h-4 w-4' />
                  Previous
                </Button>

                {currentStep < remixSteps.length ? (
                  <Button
                    type='button'
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    Next
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                ) : (
                  <Button
                    type='submit'
                    disabled={isSubmitting || !address}
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        {submitStatus.message || "Publishing Remix..."}
                      </>
                    ) : (
                      <>
                        <Upload className='mr-2 h-4 w-4' />
                        Publish Remix as IP
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
