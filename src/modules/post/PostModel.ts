import {
  Asset,
  AssetFields,
  Entry,
  EntryFields,
  EntryWithLinkResolutionAndWithoutUnresolvableLinks,
} from "contentful";

export type Post = {
  slug: string;
  title: string;
  description: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: TagFields[];
  mainImage: AssetFields;
};

export interface PostFields {
  slug: EntryFields.Text;
  title: EntryFields.Text;
  description: EntryFields.Text;
  content: EntryFields.Text;
  tags:
    | EntryWithLinkResolutionAndWithoutUnresolvableLinks<TagFields>[]
    | undefined;
  mainImage: Asset | undefined;
}

export interface TagFields {
  slug: EntryFields.Text;
  displayName: EntryFields.Text;
}

export function createPost(entry: Entry<PostFields>): Post {
  if (!entry.fields.mainImage) {
    throw Error("Invalid mainImage");
  }

  if (!entry.fields.tags) {
    throw Error("Invalid tags");
  }

  return {
    createdAt: entry.sys.createdAt,
    updatedAt: entry.sys.updatedAt,
    slug: entry.fields.slug,
    title: entry.fields.title,
    description: entry.fields.description,
    content: entry.fields.content,
    tags: entry.fields.tags.map((tag) => tag.fields),
    mainImage: entry.fields.mainImage.fields,
  };
}
