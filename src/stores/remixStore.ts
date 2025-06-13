import { create } from "zustand";

interface RemixFormData {
  originalTitle: string;
  originalDescription: string;
  remixTitle: string;
  remixDescription: string;
  content: string;
}

interface RemixStore {
  formData: RemixFormData;
  setFormData: (data: Partial<RemixFormData>) => void;
  resetForm: () => void;
}

const initialFormData: RemixFormData = {
  originalTitle: "",
  originalDescription: "",
  remixTitle: "",
  remixDescription: "",
  content: "",
};

export const useRemixStore = create<RemixStore>((set) => ({
  formData: initialFormData,
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  resetForm: () => set({ formData: initialFormData }),
})); 