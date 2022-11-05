import { Post } from "@/modules/post/PostModel";
import { postRepository } from "@/modules/post/PostRepository";
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import { ParsedUrlQuery } from "querystring";

export default function Page(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <pre className="dark:text-gray-200">{JSON.stringify(props, null, 2)} </pre>
  );
}

interface Param extends ParsedUrlQuery {
  slug: string;
}

type Result = {
  posts: Post[];
};

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<Param>): Promise<GetStaticPropsResult<Result>> => {
  if (typeof params?.slug !== "string") {
    return {
      notFound: true,
    };
  }

  const posts = await postRepository.getManyByTagSlug({ slug: params.slug });

  if (!posts.length) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      posts,
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
