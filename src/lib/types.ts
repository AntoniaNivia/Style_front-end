export type User = {
  id: string;
  name: string;
  email: string;
  type: 'user' | 'store';
  gender: 'female' | 'male' | 'other';
  mannequin: 'Woman' | 'Man' | 'Neutral';
  style: string;
  avatarUrl?: string;
};

export type ClothingItem = {
  id: string;
  userId: string;
  photoUrl: string;
  photoDataUri: string; // Base64
  type: string;
  color: string;
  season: string;
  occasion: string;
  tags: string[];
};

export type Outfit = {
  id: string;
  userId: string;
  items: ClothingItem[];
  mannequinUrl?: string;
  generatedAt: Date;
};

export type FeedPost = {
  id: string;
  storeId: string;
  storeName: string;
  storeAvatarUrl?: string;
  imageUrl: string;
  caption: string;
  hashtags: string[];
  likes: number;
};
