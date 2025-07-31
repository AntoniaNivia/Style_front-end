
'use client';

import type { ClothingItem } from "@/lib/types";
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface WardrobeContextType {
    wardrobe: ClothingItem[];
    setWardrobe: Dispatch<SetStateAction<ClothingItem[]>>;
    addClothingItem: (item: ClothingItem) => void;
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export const WardrobeProvider = ({ children }: { children: ReactNode }) => {
    const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);

    const addClothingItem = (item: ClothingItem) => {
        setWardrobe(prevWardrobe => [...prevWardrobe, item]);
    };

    return (
        <WardrobeContext.Provider value={{ wardrobe, setWardrobe, addClothingItem }}>
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
