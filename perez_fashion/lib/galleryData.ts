// Gallery data structure
// In production, this should be moved to a database (e.g., Supabase, MongoDB, PostgreSQL)

export interface GalleryItem {
  id: number;
  title: string;
  before: string; // URL or path to before image
  after: string;  // URL or path to after image
  description: string;
  createdAt?: string;
  isVisible?: boolean;
}

// Temporary hardcoded data - will be replaced with database/API
export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Wedding Dress Alteration",
    before: "https://placehold.co/600x800/e2e8f0/64748b?text=Before",
    after: "https://placehold.co/600x800/dcfce7/16a34a?text=After",
    description: "Custom fitting for bridal gown",
    isVisible: true
  },
  {
    id: 2,
    title: "Custom Nigerian Attire",
    before: "https://placehold.co/600x800/e2e8f0/64748b?text=Before",
    after: "https://placehold.co/600x800/dcfce7/16a34a?text=After",
    description: "Traditional Aso Ebi design and tailoring",
    isVisible: true
  },
  {
    id: 3,
    title: "Suit Tailoring",
    before: "https://placehold.co/600x800/e2e8f0/64748b?text=Before",
    after: "https://placehold.co/600x800/dcfce7/16a34a?text=After",
    description: "Professional suit alterations",
    isVisible: true
  },
  {
    id: 4,
    title: "Evening Gown",
    before: "https://placehold.co/600x800/e2e8f0/64748b?text=Before",
    after: "https://placehold.co/600x800/dcfce7/16a34a?text=After",
    description: "Custom evening wear tailoring",
    isVisible: true
  },
  {
    id: 5,
    title: "Dress Hemming",
    before: "https://placehold.co/600x800/e2e8f0/64748b?text=Before",
    after: "https://placehold.co/600x800/dcfce7/16a34a?text=After",
    description: "Professional hemming and resizing",
    isVisible: true
  },
  {
    id: 6,
    title: "Traditional Wedding Outfit",
    before: "https://placehold.co/600x800/e2e8f0/64748b?text=Before",
    after: "https://placehold.co/600x800/dcfce7/16a34a?text=After",
    description: "Complete wedding ensemble design",
    isVisible: true
  }
];

// Helper functions for gallery management
export function getVisibleGalleryItems(): GalleryItem[] {
  return galleryItems.filter(item => item.isVisible !== false);
}

export function getGalleryItemById(id: number): GalleryItem | undefined {
  return galleryItems.find(item => item.id === id);
}
