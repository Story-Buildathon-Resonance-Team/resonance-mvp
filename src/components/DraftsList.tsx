"use client";

import { useStoryStore } from "@/stores";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Clock, 
  Edit,
  AlertTriangle 
} from "lucide-react";
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

export function DraftsList() {
  const { drafts, createDraft, deleteDraft, loadDraft } = useStoryStore();

  const handleCreateDraft = () => {
    const draftId = createDraft();
    console.log("Created new draft:", draftId);
  };

  const handleLoadDraft = (draftId: string) => {
    loadDraft(draftId);
    console.log("Loaded draft:", draftId);
  };

  const handleDeleteDraft = (draftId: string) => {
    deleteDraft(draftId);
    console.log("Deleted draft:", draftId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Story Drafts</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{drafts.length} drafts</Badge>
          <Button onClick={handleCreateDraft} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Draft
          </Button>
        </div>
      </div>

      {drafts.length === 0 ? (
        <Card className="w-full">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-semibold">No drafts yet</h3>
              <p className="text-muted-foreground">
                Create your first draft to start writing your story.
              </p>
              <Button onClick={handleCreateDraft} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create First Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {drafts.map((draft) => (
            <Card key={draft.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="line-clamp-1">
                      {draft.title || "Untitled Draft"}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {draft.description || "No description yet..."}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant="outline">
                      {draft.contentType === "text" ? "Text" : "PDF"}
                    </Badge>
                    {draft.isAutosaved && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Auto-saved
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <strong>Last saved:</strong>{" "}
                      {new Date(draft.lastSaved).toLocaleString()}
                    </div>
                    <div>
                      <strong>License:</strong>{" "}
                      {draft.licenseType === "non-commercial"
                        ? "Non-Commercial"
                        : draft.licenseType === "commercial-use"
                        ? "Commercial Use"
                        : "Commercial Remix"}
                    </div>
                    {draft.content && (
                      <div>
                        <strong>Content length:</strong> {draft.content.length} characters
                      </div>
                    )}
                    <div>
                      <strong>Cover image:</strong>{" "}
                      {draft.coverImage ? "Uploaded" : "None"}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link href="/publish-form">
                      <Button 
                        size="sm" 
                        onClick={() => handleLoadDraft(draft.id)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Continue Writing
                      </Button>
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            Delete Draft
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{draft.title || "Untitled Draft"}"? 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteDraft(draft.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete Draft
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 