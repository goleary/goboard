import { getTravelData } from "@/lib/posts";
import Head from "next/head";
import dayjs from "dayjs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page(props: PageProps) {
  const { params } = props;
  const { slug } = await params;
  const post = await getTravelData(slug);
  return (
    <article className="prose">
      <Head>
        <title>{post.title}</title>
      </Head>
      <h1 className="mb-0 text-2xl font-bold">{post.title}</h1>
      <sub className="text-sm text-gray-500">
        {dayjs(post.date).format("MMMM YYYY")}
      </sub>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }}></div>
    </article>
  );
}
