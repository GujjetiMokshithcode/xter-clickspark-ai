// types.ts

export interface GeneratedImage {
  id: string;
  prompt: string;
  src: string; // base64 data URL
  createdAt: number; // timestamp
}

export interface ReferenceImage {
  name: string;
  data: string; // base64 encoded string
  mimeType: string;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  supportsImageGeneration: boolean;
  supportsImageEditing: boolean;
}
