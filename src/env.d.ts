/// <reference types="vite/client" />

interface Window {
  recipeAPI?: {
    saveRecord: (data: any, name: string) => Promise<{ success: boolean; error?: string }>;
    listRecords: () => Promise<{ success: boolean; files?: Array<{ name: string; date: string }>; error?: string }>;
    loadRecord: (name: string) => Promise<any>;
    deleteRecord: (name: string) => Promise<{ success: boolean; error?: string }>;
  };
}