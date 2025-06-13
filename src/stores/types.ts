// Shared types for all stores
export interface StoryDraft {
  id: string;
  title: string;
  description: string;
  content: string;
  contentType: "text" | "pdf";
  coverImage?: File;
  storyFile?: File;
  licenseType: "non-commercial" | "commercial-use" | "commercial-remix";
  lastSaved: number;
  isAutosaved: boolean;
}

export interface PublishedStory {
  ipId: string;
  title: string;
  description: string;
  author: {
    name: string;
    address: string;
  };
  contentCID: string;
  imageCID: string;
  nftMetadataCID: string;
  ipMetadataCID: string;
  txHash: string;
  tokenId: string;
  licenseTypes: ("non-commercial" | "commercial-use" | "commercial-remix")[];
  publishedAt: number;
  explorerUrl: string;
  originalStoryId?: string; // Optional field to track if this is a remix
}

export interface ReadingProgress {
  storyId: string;
  progress: number; // 0-100
  lastRead: number;
  bookmarked: boolean;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  readingSpeed: "slow" | "normal" | "fast";
  autoSave: boolean;
  notifications: {
    publishSuccess: boolean;
    newStories: boolean;
    derivatives: boolean;
  };
}

export interface RemixedStory {
  id: string;
  originalStoryId: string;
  originalTitle: string;
  originalAuthor: {
    name: string;
    address: string;
  };
  remixTitle: string;
  remixDescription: string;
  remixedAt: number;
  ipId?: string; // If the remix has been published
  status: "draft" | "published";
  contentCID?: string;
  imageCID?: string;
}

// Store interfaces
export interface AppStore {
  // UI State
  isLoading: boolean;
  currentPage: string;
  mobileMenuOpen: boolean;

  // Actions
  setIsLoading: (loading: boolean) => void;
  setCurrentPage: (page: string) => void;
  setMobileMenuOpen: (open: boolean) => void;

  // Navigation
  navigate: (page: string) => void;
}

export interface PublishStore {
  // Form State
  currentStep: number;
  formData: Partial<StoryDraft>;
  isSubmitting: boolean;
  submitStatus: {
    type: "success" | "error" | null;
    message: string;
  };

  // Actions
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<StoryDraft>) => void;
  setIsSubmitting: (submitting: boolean) => void;
  setSubmitStatus: (status: {
    type: "success" | "error" | null;
    message: string;
  }) => void;

  // Form Management
  saveFormData: () => void;
  loadFormData: () => void;
  resetForm: () => void;
  validateCurrentStep: () => Promise<boolean>;

  // Navigation
  nextStep: () => void;
  previousStep: () => void;
}

export interface UserPreferencesStore {
  preferences: UserPreferences;

  // Actions
  setTheme: (theme: UserPreferences["theme"]) => void;
  setReadingSpeed: (speed: UserPreferences["readingSpeed"]) => void;
  setAutoSave: (enabled: boolean) => void;
  updateNotificationSettings: (
    settings: Partial<UserPreferences["notifications"]>
  ) => void;

  // Persistence
  loadPreferences: () => void;
  savePreferences: () => void;
}

export interface StoryStore {
  // Drafts
  drafts: StoryDraft[];
  currentDraft: StoryDraft | null;

  // Reading
  readingProgress: ReadingProgress[];
  bookmarkedStories: string[];

  // Published Stories (cached)
  publishedStories: PublishedStory[];

  // Remixed Stories
  remixedStories: RemixedStory[];

  // Actions - Drafts
  createDraft: () => string;
  saveDraft: (id: string, data: Partial<StoryDraft>) => void;
  deleteDraft: (id: string) => void;
  loadDraft: (id: string) => void;
  setCurrentDraft: (draft: StoryDraft | null) => void;

  // Actions - Reading
  updateReadingProgress: (storyId: string, progress: number) => void;
  toggleBookmark: (storyId: string) => void;

  // Actions - Published Stories
  addPublishedStory: (story: PublishedStory) => void;
  publishStory: (formData: Partial<StoryDraft>) => Promise<void>;

  // Actions - Remixed Stories
  addRemixedStory: (story: RemixedStory) => void;
  remixStory: (formData: any) => Promise<void>;
  updateRemixedStory: (id: string, updates: Partial<RemixedStory>) => void;
  deleteRemixedStory: (id: string) => void;

  // Persistence
  loadFromStorage: () => void;
  saveToStorage: () => void;

  // Auto-save
  enableAutoSave: () => void;
  disableAutoSave: () => void;
}
