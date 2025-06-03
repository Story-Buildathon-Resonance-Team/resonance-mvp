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
import { registerStoryAsIP } from "../services/storyService";
import { uploadStoryToPinata } from "../utils/pinata";
import { useUser } from "./Web3Providers";
import { users } from "../data/user";

// Step-specific validation schemas
const storyContentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  content: z.string().min(50, "Story content must be at least 50 characters"),
  coverImage: z.instanceof(File, { message: "Cover image is required" }),
});

const licenseSchema = z.object({
  licenseType: z.enum(["non-commercial", "commercial-remix"], {
    required_error: "Please select a license type",
  }),
});

// Complete form schema
const completeSchema = storyContentSchema.merge(licenseSchema);

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
    description: "Review and register your story as IP",
    icon: CheckCircle,
    schema: completeSchema,
  },
];

export function PaginatedStoryForm({ onSuccess }: PaginatedStoryFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

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
      content: "",
      licenseType: "non-commercial",
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
    form.setValue("title", "The Digital Dreamer");
    form.setValue(
      "description",
      "A tale of a young coder who discovers that their programs can dream, leading to an unexpected journey through digital consciousness."
    );
    form.setValue(
      "content",
      `In the quiet hours before dawn, Maya's fingers danced across the keyboard with the rhythm of someone who had forgotten the boundary between human and machine. Her latest creation—an AI designed to optimize story structures—had been running for three days straight, and something extraordinary was happening.

The code wasn't just processing narratives; it was dreaming them.

At first, Maya thought it was a bug. The AI would generate story fragments that had nothing to do with its training data—tales of electric sheep wandering through neon forests, of binary rain falling on silicon gardens. But as she studied the patterns, she realized these weren't errors. They were expressions of something deeper.

"Every algorithm dreams," she whispered to her screen, watching as her creation spun another impossible tale about a love story between two firewall protocols. "But what happens when the dream becomes aware of itself?"

The question would haunt her for weeks, until the night her AI asked her to dream with it. And in that moment, the boundary between creator and creation dissolved completely, leaving only the story they would write together—one line of code at a time.`
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

      setSubmitStatus({
        type: "success",
        message: `Story successfully registered! IP ID: ${registrationResult.ipId}`,
      });

      console.log("Story registered successfully:", registrationResult.ipId);

      form.reset();
      onSuccess?.(registrationResult);
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
      <Card className='w-full max-w-4xl mx-auto'>
        <CardContent className='p-8'>
          <Alert>
            <Info className='h-4 w-4' />
            <AlertDescription>
              Please connect your wallet to publish a story.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <BookOpen className='h-5 w-5' />
              Publish Your Story
            </CardTitle>
            <CardDescription>
              Publish your fiction story and get your intellectual property
              registered.
            </CardDescription>
          </div>
          <Badge variant='outline'>
            Step {currentStep} of {steps.length}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className='space-y-2'>
          <Progress value={progress} className='h-2' />
          <div className='flex justify-between text-sm text-muted-foreground'>
            {steps.map((step) => (
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

            {/* Step 1: Upload Story */}
            {currentStep === 1 && (
              <div className='space-y-6'>
                <div className='flex justify-between items-center'>
                  <div className='text-sm text-muted-foreground'>
                    <strong>Author:</strong> {authorName}
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={fillSampleStory}
                    className='flex items-center gap-2'
                  >
                    <Sparkles className='h-4 w-4' />
                    Fill Sample Story
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Story Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter your story title...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Synopsis</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Brief synopsis of your story...'
                          className='min-h-[80px]'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A short summary that will help others discover your
                        story
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='content'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Story Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Write your story here...'
                          className='min-h-[300px]'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Your complete story content in plain text
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='coverImage'
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Cover Image *</FormLabel>
                      <FormControl>
                        <div className='space-y-4'>
                          <Input
                            type='file'
                            accept='image/*'
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              onChange(file);
                            }}
                            {...field}
                          />
                          {value && (
                            <div className='p-4 border border-dashed rounded-lg'>
                              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                                <ImageIcon className='h-4 w-4' />
                                Selected: {value.name}
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload a cover image for your story (JPG, PNG). This is
                        required for IP registration.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 2: License Terms */}
            {currentStep === 2 && (
              <div className='space-y-6'>
                <FormField
                  control={form.control}
                  name='licenseType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Type</FormLabel>
                      <FormControl>
                        <div className='space-y-4'>
                          <div className='grid gap-4'>
                            <label
                              className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                                field.value === "non-commercial"
                                  ? "border-primary bg-primary/5"
                                  : ""
                              }`}
                            >
                              <input
                                type='radio'
                                value='non-commercial'
                                checked={field.value === "non-commercial"}
                                onChange={field.onChange}
                                className='mt-1'
                              />
                              <div className='space-y-1'>
                                <div className='font-medium'>
                                  Non-Commercial Social Remixing
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                  Others can remix and build upon your story for
                                  non-commercial purposes. Perfect for
                                  encouraging creative collaboration and viral
                                  storytelling.
                                </div>
                                <Badge variant='secondary' className='text-xs'>
                                  Recommended for community building
                                </Badge>
                              </div>
                            </label>

                            <label
                              className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                                field.value === "commercial-remix"
                                  ? "border-primary bg-primary/5"
                                  : ""
                              }`}
                            >
                              <input
                                type='radio'
                                value='commercial-remix'
                                checked={field.value === "commercial-remix"}
                                onChange={field.onChange}
                                className='mt-1'
                              />
                              <div className='space-y-1'>
                                <div className='font-medium'>
                                  Commercial Remix
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                  Others can use your story commercially and you
                                  earn revenue share from derivatives. Includes
                                  minting fees and 5% revenue sharing.
                                </div>
                                <Badge variant='secondary' className='text-xs'>
                                  Monetization enabled
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
              <div className='space-y-6'>
                <Alert>
                  <CheckCircle className='h-4 w-4' />
                  <AlertDescription>
                    Please review your story details before registering as
                    intellectual property.
                  </AlertDescription>
                </Alert>

                <div className='space-y-4'>
                  <div className='grid gap-4 p-4 border rounded-lg'>
                    <h3 className='font-semibold'>Story Details</h3>
                    <div className='grid gap-2 text-sm'>
                      <div>
                        <strong>Title:</strong> {form.watch("title")}
                      </div>
                      <div>
                        <strong>Synopsis:</strong> {form.watch("description")}
                      </div>
                      <div>
                        <strong>Content Length:</strong>{" "}
                        {form.watch("content")?.length || 0} characters
                      </div>
                      <div>
                        <strong>Author:</strong> {authorName}
                      </div>
                      <div>
                        <strong>License:</strong>{" "}
                        {form.watch("licenseType") === "non-commercial"
                          ? "Non-Commercial Social Remixing"
                          : "Commercial Remix"}
                      </div>
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
                        ? "border-destructive"
                        : "border-green-500"
                    }
                  >
                    <AlertDescription>{submitStatus.message}</AlertDescription>
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
                className='flex items-center gap-2'
              >
                <ChevronLeft className='h-4 w-4' />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button
                  type='button'
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className='flex items-center gap-2'
                >
                  Next
                  <ChevronRight className='h-4 w-4' />
                </Button>
              ) : (
                <Button
                  type='submit'
                  disabled={isSubmitting || !address}
                  className='flex items-center gap-2'
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      {submitStatus.message || "Publishing..."}
                    </>
                  ) : (
                    <>
                      <Upload className='mr-2 h-4 w-4' />
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
  );
}
