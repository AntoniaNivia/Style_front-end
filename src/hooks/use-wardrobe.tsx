'use client';

import type { ClothingItem } from "@/lib/types";
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Using a subset of ClothingItem for adding new items, as some fields are generated.
export type ClothingItemWithoutId = Omit<ClothingItem, 'id' | 'userId' | 'photoUrl'>;

// Mock data to initialize the wardrobe
const mockWardrobe: ClothingItemWithoutId[] = [
    { photoDataUri: 'https://placehold.co/300x400.png', type: 'T-Shirt', color: 'White', season: 'Summer', occasion: 'Casual', tags: ['cotton', 'basic'] },
    { photoDataUri: 'https://placehold.co/300x400.png', type: 'Jeans', color: 'Blue', season: 'All', occasion: 'Casual', tags: ['denim', 'straight-leg'] },
    { photoDataUri: 'https://placehold.co/300x400.png', type: 'Sneakers', color: 'White', season: 'All', occasion: 'Casual', tags: ['leather', 'comfy'] },
    { photoDataUri: 'https://placehold.co/300x400.png', type: 'Dress', color: 'Floral', season: 'Spring', occasion: 'Party', tags: ['midi', 'romantic'] },
    { photoDataUri: 'https://placehold.co/300x400.png', type: 'Blazer', color: 'Black', season: 'All', occasion: 'Work', tags: ['professional', 'classic'] },
    { photoDataUri: 'https://placehold.co/300x400.png', type: 'Pants', color: 'Beige', season: 'Autumn', occasion: 'Work', tags: ['chinos', 'smart-casual'] },
];

interface WardrobeContextType {
    wardrobe: ClothingItemWithoutId[];
    addClothingItem: (item: ClothingItemWithoutId) => void;
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export const WardrobeProvider = ({ children }: { children: ReactNode }) => {
    const [wardrobe, setWardrobe] = useState<ClothingItemWithoutId[]>(mockWardrobe);

    const addClothingItem = (item: ClothingItemWithoutId) => {
        setWardrobe(prevWardrobe => [...prevWardrobe, item]);
    };

    return (
        <WardrobeContext.Provider value={{ wardrobe, addClothingItem }}>
            {children}
        </WardrobeContext.Provider>
    );
};

export const useWardrobe = () => {
    const context = useContext(WardrobeContext);
    if (context === undefined) {
        throw new Error('useWardrobe must be used within a WardrobeProvider');
    }
    return context;
};
