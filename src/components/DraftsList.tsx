"use client";

import { useStoryStore, usePublishStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Clock, FileText, GitFork, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Combined draft type for display
interface CombinedDraft {
  id: string;
  title: string;
  description: string;
  content?: string;
  contentType: "text" | "pdf";
  lastSaved: number;
  isAutosaved: boolean;
  type: "publish-form" | "remix-form";
  originalStoryId?: string; // For remix drafts
  originalTitle?: string; // For remix drafts
}

export function DraftsList() {
  const { remixedStories, deleteRemixedStory } = useStoryStore();

  const { formData: publishFormData, resetForm } = usePublishStore();

  const handleDeleteDraft = (
    draftId: string,
    type: "publish-form" | "remix-form"
  ) => {
    if (type === "publish-form") {
      resetForm();
      console.log("Cleared publish form draft");
    } else if (type === "remix-form") {
      deleteRemixedStory(draftId);
      console.log("Deleted remix draft:", draftId);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  // Combine autosaved drafts from forms
  const getAllDrafts = (): CombinedDraft[] => {
    const allDrafts: CombinedDraft[] = [];

    // Autosaved publish form data (if it has content and isn't published)
    if (
      publishFormData &&
      (publishFormData.title || publishFormData.content) &&
      publishFormData.lastSaved
    ) {
      allDrafts.push({
        id: "publish-form-draft",
        title: publishFormData.title || "Untitled Story",
        description: publishFormData.description || "",
        content: publishFormData.content,
        contentType: publishFormData.contentType || "text",
        lastSaved: publishFormData.lastSaved,
        isAutosaved: publishFormData.isAutosaved || false,
        type: "publish-form",
      });
    }

    // Remixed stories that are still drafts
    remixedStories
      .filter((remix) => remix.status === "draft")
      .forEach((remix) => {
        allDrafts.push({
          id: remix.id,
          title: remix.remixTitle || "Untitled Remix",
          description: remix.remixDescription || "",
          contentType: "text", // Remixes are typically text
          lastSaved: remix.remixedAt,
          isAutosaved: true,
          type: "remix-form",
          originalStoryId: remix.originalStoryId,
          originalTitle: remix.originalTitle,
        });
      });

    // Sort by last saved (most recent first)
    return allDrafts.sort((a, b) => b.lastSaved - a.lastSaved);
  };

  const allDrafts = getAllDrafts();

  const getEditLink = (draft: CombinedDraft) => {
    switch (draft.type) {
      case "publish-form":
        return "/publish-form";
      case "remix-form":
        return draft.originalStoryId
          ? `/remix-form?originalStoryId=${draft.originalStoryId}`
          : "/remix-form";
      default:
        return "/publish-form";
    }
  };

  const getDraftTypeIcon = (type: "publish-form" | "remix-form") => {
    switch (type) {
      case "remix-form":
        return <GitFork className='h-3 w-3' />;
      case "publish-form":
        return <Sparkles className='h-3 w-3' />;
    }
  };

  const getDraftTypeBadge = (type: "publish-form" | "remix-form") => {
    switch (type) {
      case "remix-form":
        return (
          <Badge variant='secondary' className='text-xs'>
            Remix
          </Badge>
        );
      case "publish-form":
        return (
          <Badge variant='outline' className='text-xs'>
            Story
          </Badge>
        );
    }
  };

  const getDraftTypeLabel = (type: "publish-form" | "remix-form") => {
    switch (type) {
      case "remix-form":
        return "remix draft";
      case "publish-form":
        return "story draft";
    }
  };

  if (allDrafts.length === 0) {
    return (
      <div className='text-center py-12'>
        <FileText className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
        <h3 className='text-lg font-medium mb-2'>No drafts yet</h3>
        <p className='text-muted-foreground mb-6'>
          Start writing your first story or remix. Your work will be
          automatically saved as you write.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-1'>
      {allDrafts.map((draft) => (
        <div
          key={`${draft.type}-${draft.id}`}
          className='group p-4 hover:bg-muted/30 rounded-lg transition-colors border-l-2 border-transparent hover:border-primary/20'
        >
          <div className='flex items-start justify-between gap-4'>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2 mb-1'>
                {getDraftTypeIcon(draft.type)}
                <h3 className='font-medium text-lg leading-tight line-clamp-2'>
                  {draft.title}
                </h3>
              </div>

              {draft.description && (
                <p className='text-muted-foreground text-sm line-clamp-2 mb-3'>
                  {draft.description}
                </p>
              )}

              {/* Show original story info for remixes */}
              {draft.type === "remix-form" && draft.originalTitle && (
                <div className='bg-muted/50 rounded-md p-2 mb-3'>
                  <p className='text-xs text-muted-foreground'>
                    <GitFork className='h-3 w-3 inline mr-1' />
                    Remix of &quot;{draft.originalTitle}&quot;
                  </p>
                </div>
              )}

              <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                <span className='flex items-center gap-1'>
                  <Clock className='h-3 w-3' />
                  {formatTimeAgo(draft.lastSaved)}
                </span>

                {draft.content && (
                  <span>{draft.content.length} characters</span>
                )}

                {getDraftTypeBadge(draft.type)}

                {draft.isAutosaved && (
                  <Badge variant='secondary' className='text-xs'>
                    Auto-saved
                  </Badge>
                )}
              </div>
            </div>

            <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
              <Link href={getEditLink(draft)}>
                <Button
                  size='sm'
                  variant='outline'
                  className='flex items-center gap-1 cursor-pointer'
                >
                  <Edit className='h-3 w-3' />
                  {draft.type === "remix-form"
                    ? "Continue Remix"
                    : "Continue Story"}
                </Button>
              </Link>

              {/* Show delete for both draft types */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-muted-foreground hover:text-destructive cursor-pointer'
                  >
                    <Trash2 className='h-3 w-3' />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete {getDraftTypeLabel(draft.type)}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete &quot;{draft.title}&quot;? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteDraft(draft.id, draft.type)}
                      className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      ))}

      {/* Quick create new content at bottom */}
      <div className='pt-4 border-t border-border/50 mt-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
          <Link href='/publish-form'>
            <Button
              variant='outline'
              className='w-full flex items-center gap-2 h-12 text-muted-foreground hover:text-foreground cursor-pointer'
            >
              <Sparkles className='h-4 w-4' />
              Start Original Story
            </Button>
          </Link>
          <Link href='/stories'>
            <Button
              variant='outline'
              className='w-full flex items-center gap-2 h-12 text-muted-foreground hover:text-foreground cursor-pointer'
            >
              <GitFork className='h-4 w-4' />
              Find Stories to Remix
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
