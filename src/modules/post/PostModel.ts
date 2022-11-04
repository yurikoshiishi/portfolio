import { Entry } from "contentful";

export interface ContentfulPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: Entry<ContentfulTag>[];
  mainImage: Entry<ContentfulImage>;
}

export interface ContentfulTag {
  slug: string;
  displayName: string;
}

export interface ContentfulImage {
  title: string;
  description: string;
  file: {
    url: string;
    details: {
      size: number;
      image?: {
        width: number;
        height: number;
      };
    };
    fileName: string;
    contentType: string;
  };
}
