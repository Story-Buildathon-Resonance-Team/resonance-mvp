"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../Web3Providers";
import { useRemixStore } from "../../stores/remixStore";
import { useStoryStore } from "@/stores/storyStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RemixFormPage() {
  const { isConnected } = useUser();
  const router = useRouter();
  const { formData, setFormData, resetForm } = useRemixStore();
  const { remixStory } = useStoryStore();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Automatically redirect non-logged-in users to home
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  // Don't render the form if user is not connected (they'll be redirected)
  if (!isConnected) {
    return null;
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await remixStory(formData);
      resetForm();
      router.push("/dashboard");
    } catch (error) {
      console.error("Error remixing story:", error);
    }
  };

  return (
    <div className='w-full'>
      {/* Animated Background Elements */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none z-0'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute top-3/4 right-1/4 w-[32rem] h-[32rem] bg-accent/6 rounded-full blur-3xl animate-pulse delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 w-64 h-64 bg-primary/12 rounded-full blur-2xl animate-bounce delay-500'></div>
        <div className='absolute top-10 right-10 w-48 h-48 bg-accent/8 rounded-full blur-2xl animate-pulse delay-700'></div>
        <div className='absolute bottom-20 left-10 w-80 h-80 bg-primary/6 rounded-full blur-3xl animate-pulse delay-300'></div>
      </div>

      {/* Form Content */}
      <div className='relative z-10 min-h-screen px-6 py-10'>
        <div className='container mx-auto max-w-7xl'>
          {/* Header Section */}
          <div className='text-center space-y-12 mb-16'>
            <div className='space-y-8'>
              <h1 className='text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-foreground leading-[0.9] animate-fade-in-up tracking-tight'>
                Remix a Story
              </h1>

              <p className='text-xl md:text-2xl text-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200 font-light'>
                Create a new version of an existing story while respecting the
                original creator&apos;s terms.
              </p>
            </div>

            {/* Progress Steps */}
            <div className='flex items-center justify-center gap-4'>
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index + 1 === currentStep
                      ? "bg-primary scale-125"
                      : index + 1 < currentStep
                      ? "bg-primary/50"
                      : "bg-primary/20"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Form Steps */}
          <div className='max-w-3xl mx-auto'>
            {currentStep === 1 && (
              <Card className='border-0 bg-card/50 backdrop-blur-sm'>
                <CardHeader>
                  <CardTitle>Step 1: Original Story</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Original Story Title
                      </label>
                      <input
                        type='text'
                        value={formData.originalTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            originalTitle: e.target.value,
                          })
                        }
                        className='w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors'
                        placeholder='Enter the original story title'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Original Story Description
                      </label>
                      <textarea
                        value={formData.originalDescription}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            originalDescription: e.target.value,
                          })
                        }
                        className='w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors min-h-[100px]'
                        placeholder='Enter the original story description'
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className='border-0 bg-card/50 backdrop-blur-sm'>
                <CardHeader>
                  <CardTitle>Step 2: Remix Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Remix Title
                      </label>
                      <input
                        type='text'
                        value={formData.remixTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            remixTitle: e.target.value,
                          })
                        }
                        className='w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors'
                        placeholder='Enter your remix title'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Remix Description
                      </label>
                      <textarea
                        value={formData.remixDescription}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            remixDescription: e.target.value,
                          })
                        }
                        className='w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors min-h-[100px]'
                        placeholder='Enter your remix description'
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className='border-0 bg-card/50 backdrop-blur-sm'>
                <CardHeader>
                  <CardTitle>Step 3: Remix Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Content
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        className='w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors min-h-[300px]'
                        placeholder='Enter your remix content'
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <Card className='border-0 bg-card/50 backdrop-blur-sm'>
                <CardHeader>
                  <CardTitle>Step 4: Review & Publish</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-6'>
                    <div>
                      <h3 className='text-lg font-medium mb-2'>
                        Original Story Details
                      </h3>
                      <div className='space-y-2'>
                        <p>
                          <span className='font-medium'>Title:</span>{" "}
                          {formData.originalTitle}
                        </p>
                        <p>
                          <span className='font-medium'>Description:</span>{" "}
                          {formData.originalDescription}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className='text-lg font-medium mb-2'>
                        Remix Story Details
                      </h3>
                      <div className='space-y-2'>
                        <p>
                          <span className='font-medium'>Title:</span>{" "}
                          {formData.remixTitle}
                        </p>
                        <p>
                          <span className='font-medium'>Description:</span>{" "}
                          {formData.remixDescription}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className='text-lg font-medium mb-2'>Content Preview</h3>
                      <div className='bg-white/5 rounded-lg p-4 max-h-[200px] overflow-y-auto'>
                        <p className='text-sm'>{formData.content}</p>
                      </div>
                    </div>

                    <div className='flex items-center gap-4'>
                      <Button
                        variant='outline'
                        onClick={handleBack}
                        className='flex-1'
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        className='flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90'
                      >
                        Publish Remix
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            {currentStep < totalSteps && (
              <div className='flex items-center justify-between mt-6'>
                <Button
                  variant='outline'
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  Back
                </Button>
                <Button onClick={handleNext}>Next</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
