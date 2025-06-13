"use client";

import { useStoryStore, usePublishStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Clock, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

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
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);

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

  if (allDrafts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Drafts Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start writing your next story by creating a new draft.
          </p>
          <Button>Create New Draft</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {allDrafts.map((draft) => (
          <Card key={draft.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {draft.title || "Untitled Draft"}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  Last edited {new Date(draft.lastSaved).toLocaleDateString()}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDraftToDelete(draft.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {draft.description || "No description yet"}
              </p>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Continue Editing
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!draftToDelete} onOpenChange={() => setDraftToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Draft</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this draft? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (draftToDelete) {
                  handleDeleteDraft(draftToDelete, draftToDelete.includes("publish-form-draft") ? "publish-form" : "remix-form");
                  setDraftToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
