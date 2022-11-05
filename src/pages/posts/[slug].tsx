import { formatISO } from "@/lib/date-helper";
import { markdownToHtml } from "@/lib/markdown";
import { getReadTimeInMinute, Post } from "@/modules/post/PostModel";
import { postRepository } from "@/modules/post/PostRepository";
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import { ParsedUrlQuery } from "querystring";

export default function Page({
  post,
  html,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="flex justify-center py-10 lg:py-20 w-full px-4">
      <main className="max-w-full">
        <article className="prose prose-slate lg:prose-lg dark:prose-invert">
          <header>
            <h1>{post.title}</h1>
            <div className="flex gap-2 items-center">
              <time dateTime={post.updatedAt || post.createdAt}>
                {formatISO(post.updatedAt || post.createdAt)}
              </time>
              <span>-</span>
              <span>{getReadTimeInMinute(post.content)} min read</span>
            </div>
          </header>
          <div
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          />
        </article>
      </main>
    </div>
  );
}

interface Param extends ParsedUrlQuery {
  slug: string;
}

type Result = {
  post: Post;
  html: string;
};

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<Param>): Promise<GetStaticPropsResult<Result>> => {
  if (typeof params?.slug !== "string") {
    return {
      notFound: true,
    };
  }

  const post = await postRepository.getOneBySlug({ slug: params.slug });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
      html: await markdownToHtml(post.content),
    },
  };
};

export const getStaticPaths = async (): Promise<GetStaticPathsResult> => {
  const posts = await postRepository.getAll();
  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: "blocking",
  };
};
