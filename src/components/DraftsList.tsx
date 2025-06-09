"use client";

import { useStoryStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Edit,
  Clock,
  FileText
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

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return 'Just now'
  }

  if (drafts.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No drafts yet</h3>
        <p className="text-muted-foreground mb-6">
          Start writing your first story and save it as a draft.
        </p>
        <Button onClick={handleCreateDraft} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Your First Draft
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {drafts.map((draft) => (
        <div 
          key={draft.id} 
          className="group p-4 hover:bg-muted/30 rounded-lg transition-colors border-l-2 border-transparent hover:border-primary/20"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-lg leading-tight mb-1 line-clamp-2">
                {draft.title || "Untitled Draft"}
              </h3>
              
              {draft.description && (
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                  {draft.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(draft.lastSaved)}
                </span>
                
                {draft.content && (
                  <span>{draft.content.length} characters</span>
                )}
                
                <Badge variant="outline" className="text-xs">
                  {draft.contentType === "text" ? "Text" : "PDF"}
                </Badge>
                
                {draft.isAutosaved && (
                  <Badge variant="secondary" className="text-xs">
                    Auto-saved
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link href="/publish-form">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleLoadDraft(draft.id)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
              </Link>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Draft</AlertDialogTitle>
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
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      ))}
      
      {/* Quick create new draft at bottom */}
      <div className="pt-4 border-t border-border/50 mt-6">
        <Button 
          variant="outline" 
          onClick={handleCreateDraft}
          className="w-full flex items-center gap-2 h-12 text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          Start New Draft
        </Button>
      </div>
    </div>
  );
} 