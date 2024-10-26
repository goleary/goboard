import { getPostData } from "@/lib/posts";
import Head from "next/head";
import dayjs from "dayjs";
import { PageProps } from "@/.next/types/app/page";
export default async function Page(props: PageProps) {
  const { params } = props;
  const { slug } = await params;
  const post = await getPostData(slug);
  return (
    <article className="prose">
      <Head>
        <title>{post.title}</title>
      </Head>
      <h1 className="mb-0">{post.title}</h1>
      <sub>{dayjs(post.date).format("MMMM D, YYYY")}</sub>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }}></div>
    </article>
  );
}
