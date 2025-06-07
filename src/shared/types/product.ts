export interface TProduct {
    _id?: string;
    id?: string;
    categoryId: string;
    nameAR: string;
    nameHE: string;
    img: any;
    descriptionAR: string;
    descriptionHE: string;
    notInStoreDescriptionAR?: string;
    notInStoreDescriptionHE?: string;
    price: number;
    mediumPrice?: number;
    largePrice?: number;
    mediumCount?: number;
    largeCount?: number;
    isInStore: boolean;
    isWeight?: boolean;
    isHidden?: boolean;
    extras?: any;
    others?: any;
    hasDiscount?: boolean;
    discountQuantity?: string;
    discountPrice?: string;
    supportedCategoryIds?: string[];
}