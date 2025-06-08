"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
} from "lucide-react";
import { registerStoryAsIP } from "../../services/storyService";
import { uploadStoryToPinata } from "../../utils/pinata";
import { useUser } from "../Web3Providers";
import { users } from "../../data/user";
import SuccessModal from "../../components/SuccessModal";
import StoryUploadFormStep1 from "../../components/StoryUploadFormStep1";

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
  licenseType: z.enum(["non-commercial", "commercial-use", "commercial-remix"], {
    required_error: "Please select a license type",
  }),
});

// Complete form schema with refinement
const completeSchema = baseSchema.refine((data) => {
  if (data.contentType === "text") {
    return data.content && data.content.length >= 50;
  } else if (data.contentType === "pdf") {
    return data.storyFile && data.storyFile.type === "application/pdf";
  }
  return false;
}, {
  message: "Please provide either text content (min 50 characters) or upload a PDF file",
  path: ["content"],
});

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

interface PaginatedStoryFormProps {
  onSuccess?: (result: any) => void;
}

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  schema: z.ZodSchema<any>;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Upload Story",
    description: "Upload your story content and cover image",
    icon: FileText,
    schema: storyContentSchema,
  },
  {
    id: 2,
    title: "Choose License",
    description: "Select how others can use your story",
    icon: Scale,
    schema: licenseSchema,
  },
  {
    id: 3,
    title: "Review & Publish",
    description: "Review and publish your story",
    icon: CheckCircle,
    schema: completeSchema,
  },
];

export default function PaginatedStoryForm({
  onSuccess,
}: PaginatedStoryFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [successResult, setSuccessResult] = useState<any>(null);

  const { address, isConnected, userName } = useUser();

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

  const form = useForm<FormData>({
    resolver: zodResolver(completeSchema),
    defaultValues: {
      title: "",
      description: "",
      contentType: "text" as const,
      content: "",
      licenseType: "non-commercial" as const,
    },
    mode: "onChange",
  });

  const getCurrentStepSchema = () => {
    return (
      steps.find((step) => step.id === currentStep)?.schema || completeSchema
    );
  };

  const validateCurrentStep = async () => {
    const currentSchema = getCurrentStepSchema();
    const formData = form.getValues();

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
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const fillSampleStory = () => {
    form.setValue("title", "Your story title here");
    form.setValue(
      "description",
      "A brief description of your story. 1-2 sentences is enough."
    );
    form.setValue("contentType", "text");
    form.setValue(
      "content",
      `Paste your story here. Make sure it is between 500 to 1000 words long. This is a test app, so you can use a short story, a scenario, or even a poem. The content should be in plain text format, without any special formatting or HTML tags. Just write your story as you would in a text editor.`
    );
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

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      setSubmitStatus({ type: null, message: "Uploading story to IPFS..." });

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
        message: "Registering IP on Story Protocol...",
      });

      const registrationResult = await registerStoryAsIP({
        title: data.title,
        description: data.description,
        contentCID: pinataResult.contentCID,
        imageCID: pinataResult.imageCID,
        author: {
          name: authorName,
          address: address,
        },
        licenseType: data.licenseType,
      });

      if (registrationResult.success && registrationResult.ipId) {
        setSubmitStatus({
          type: "success",
          message: `Story successfully registered! IP ID: ${registrationResult.ipId}`,
        });

        console.log("Story registered successfully:", {
          ipId: registrationResult.ipId,
          txHash: registrationResult.txHash,
          tokenId: registrationResult.tokenId,
          explorerUrl: registrationResult.explorerUrl,
        });

        // Show success modal
        setSuccessResult(registrationResult);
        
        form.reset();
        onSuccess?.(registrationResult);
      } else {
        throw new Error(registrationResult.error || "Registration failed - no IP ID returned");
      }
    } catch (error) {
      console.error("Story submission error:", error);
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

  const progress = (currentStep / steps.length) * 100;
  const currentStepData = steps.find((step) => step.id === currentStep);

  if (!isConnected || !address) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to publish a story.
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
      <br /><br />
      <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Publish Your Story
            </CardTitle>
            <CardDescription>
              Publish your fiction story and get your intellectual property
              registered.
            </CardDescription>
          </div>
          <Badge variant="outline">
            Step {currentStep} of {steps.length}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center gap-1">
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
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Step Header */}
            {currentStepData && (
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <currentStepData.icon className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">{currentStepData.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentStepData.description}
                  </p>
                </div>
              </div>
            )}

            {/* Step 1: Upload Story */}
            {currentStep === 1 && (
              <StoryUploadFormStep1 
                form={form}
                authorName={authorName}
                fillSampleStory={fillSampleStory}
              />
            )}

            {/* Step 2: License Terms */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="licenseType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Type</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="grid gap-4">
                            <label
                              className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 w-full overflow-hidden ${
                                field.value === "non-commercial"
                                  ? "border-primary bg-primary/5"
                                  : ""
                              }`}
                            >
                              <input
                                type="radio"
                                value="non-commercial"
                                checked={field.value === "non-commercial"}
                                onChange={field.onChange}
                                className="mt-1 flex-shrink-0"
                              />
                              <div className="space-y-2 min-w-0 flex-1 overflow-hidden">
                                <div className="font-medium">
                                  Non-Commercial Remix License
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Perfect for building your creative community:
                                </div>
                                <ul className="text-sm text-muted-foreground space-y-1 ml-2">
                                  <li className="break-words">• Writers and fans can remix your stories for free</li>
                                  <li className="break-words">• You receive full attribution for every derivative work</li>
                                  <li className="break-words">• Build passionate communities around your universe</li>
                                  <li className="break-words">• See which characters/plots resonate most with audiences</li>
                                </ul>
                                <Badge variant="secondary" className="text-xs">
                                  Ideal for: Community building and creative experimentation
                                </Badge>
                              </div>
                            </label>

                            <label
                              className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 w-full overflow-hidden ${
                                field.value === "commercial-use"
                                  ? "border-primary bg-primary/5"
                                  : ""
                              }`}
                            >
                              <input
                                type="radio"
                                value="commercial-use"
                                checked={field.value === "commercial-use"}
                                onChange={field.onChange}
                                className="mt-1 flex-shrink-0"
                              />
                              <div className="space-y-2 min-w-0 flex-1 overflow-hidden">
                                <div className="font-medium">
                                  Commercial Use License
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Turn your story universe into a thriving creative economy:
                                </div>
                                <ul className="text-sm text-muted-foreground space-y-1 ml-2">
                                  <li className="break-words">• Other creators pay you a 10% revenue share when they commercially use your characters, settings, or storylines</li>
                                  <li className="break-words">• Perfect for businesses that want to use your story in marketing, products, or services without creating remixes</li>
                                </ul>
                                <Badge variant="secondary" className="text-xs">
                                  Ideal for: Writers ready to build sustainable income from their fictional universes
                                </Badge>
                              </div>
                            </label>

                            <label
                              className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 w-full overflow-hidden ${
                                field.value === "commercial-remix"
                                  ? "border-primary bg-primary/5"
                                  : ""
                              }`}
                            >
                              <input
                                type="radio"
                                value="commercial-remix"
                                checked={field.value === "commercial-remix"}
                                onChange={field.onChange}
                                className="mt-1 flex-shrink-0"
                              />
                              <div className="space-y-2 min-w-0 flex-1 overflow-hidden">
                                <div className="font-medium">
                                  Commercial Remix License
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Turn your stories into revenue-generating universes:
                                </div>
                                <ul className="text-sm text-muted-foreground space-y-1 ml-2">
                                  <li className="break-words">• Creators pay you a 25% revenue share from commercial remixes</li>
                                  <li className="break-words">• You receive full attribution for every derivative work</li>
                                  <li className="break-words">• Your original work becomes more valuable with each adaptation</li>
                                </ul>
                                <Badge variant="secondary" className="text-xs">
                                  Ideal for: Proven story universes and scalable income
                                </Badge>
                              </div>
                            </label>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Choose how others can use your story. This will be
                        enforced on-chain through Story Protocol.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 3: Review & Publish */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please review your story details before registering as
                    intellectual property.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="grid gap-4 p-4 border rounded-lg">
                    <h3 className="font-semibold">Story Details</h3>
                    <div className="grid gap-2 text-sm">
                      <div>
                        <strong>Title:</strong> {form.watch("title")}
                      </div>
                      <div>
                        <strong>Synopsis:</strong> {form.watch("description")}
                      </div>
                      <div>
                        <strong>Author:</strong> {authorName}
                      </div>
                      <div>
                        <strong>License:</strong>{" "}
                        {form.watch("licenseType") === "non-commercial"
                          ? "Non-Commercial Remix License"
                          : form.watch("licenseType") === "commercial-use"
                          ? "Commercial Use License (10% revenue share)"
                          : "Commercial Remix License (25% revenue share)"}
                      </div>
                      <div>
                        <strong>Content Type:</strong>{" "}
                        {form.watch("contentType") === "text" ? "Text Content" : "PDF File"}
                      </div>
                      {form.watch("contentType") === "text" && (
                        <div>
                          <strong>Content Length:</strong>{" "}
                          {form.watch("content")?.length || 0} characters
                        </div>
                      )}
                      {form.watch("contentType") === "pdf" && form.watch("storyFile") && (
                        <div>
                          <strong>PDF File:</strong>{" "}
                          {form.watch("storyFile")?.name} ({((form.watch("storyFile")?.size || 0) / 1024 / 1024).toFixed(2)} MB)
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

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">What happens next?</h4>
                    <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                      <li>Your story and images will be uploaded to IPFS</li>
                      <li>
                        Metadata will be generated following IP Asset standards
                      </li>
                      <li>
                        Your story will be registered as an IP Asset on Story
                        Protocol
                      </li>
                      <li>
                        You'll receive an NFT representing ownership of your IP
                      </li>
                      <li>
                        Others can discover and potentially remix your story
                        based on your chosen license
                      </li>
                    </ol>
                  </div>
                </div>

                {submitStatus.message && (
                  <Alert
                    className={
                      submitStatus.type === "error"
                        ? "border-destructive bg-destructive/10"
                        : "border-green-500 bg-green-50"
                    }
                  >
                    {submitStatus.type === "error" ? (
                      <div className="space-y-2">
                        <div className="font-medium text-destructive">Registration Failed</div>
                        <AlertDescription className="text-sm">
                          {submitStatus.message}
                        </AlertDescription>
                        <div className="text-xs text-muted-foreground">
                          This is usually due to license configuration issues. Please try again or contact support if the problem persists.
                        </div>
                      </div>
                    ) : (
                      <AlertDescription className="text-green-700">
                        {submitStatus.message}
                      </AlertDescription>
                    )}
                  </Alert>
                )}
              </div>
            )}

            <Separator />

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isSubmitting}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white border-0"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || !address}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white border-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {submitStatus.message || "Publishing..."}
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Publish Story as IP
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
