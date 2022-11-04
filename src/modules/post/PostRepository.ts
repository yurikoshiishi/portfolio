import { serverEnv } from "@/env/server.mjs";
import {
  createPost,
  Post,
  PostFields,
  TagFields,
} from "@/modules/post/PostModel";
import { ContentfulClientApi, createClient, Entry } from "contentful";

const contentTypes = {
  post: "post",
  tag: "tag",
};

export class PostRepository {
  private client: ContentfulClientApi;

  constructor(client: ContentfulClientApi) {
    this.client = client;
  }

  private async getTagBySlug({
    slug,
  }: {
    slug: string;
  }): Promise<Entry<TagFields> | null> {
    const entries =
      await this.client.withoutUnresolvableLinks.getEntries<TagFields>({
        content_type: contentTypes.tag,
        "fields.slug": slug,
      });

    if (!entries.items.length) {
      return null;
    }

    return entries.items[0];
  }

  async getOneBySlug({ slug }: { slug: string }): Promise<Post | null> {
    const entries =
      await this.client.withoutUnresolvableLinks.getEntries<PostFields>({
        content_type: contentTypes.post,
        "fields.slug": slug,
      });

    if (!entries.items.length) {
      return null;
    }

    return createPost(entries.items[0]);
  }

  async getAll(): Promise<Post[]> {
    const entries =
      await this.client.withoutUnresolvableLinks.getEntries<PostFields>({
        content_type: contentTypes.post,
      });

    return entries.items.map(createPost);
  }

  async getManyByTagSlug({ slug }: { slug: string }): Promise<Post[]> {
    const tag = await this.getTagBySlug({ slug });

    if (!tag) {
      return [];
    }

    const entries =
      await this.client.withoutUnresolvableLinks.getEntries<PostFields>({
        content_type: contentTypes.post,
        order: "-sys.createdAt",
        "fields.tags.sys.id": tag.sys.id,
      });

    return entries.items.map(createPost);
  }
}

export const postRepository = new PostRepository(
  createClient({
    space: serverEnv.CONTENTFUL_SPACE_ID,
    accessToken: serverEnv.CONTENTFUL_DELIVERY_API_KEY,
    //TODO: switch this for preview
    //host: "preview.contentful.com",
  })
);
