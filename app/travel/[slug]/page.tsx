import { getTravelData } from "@/lib/posts";
import { Metadata } from "next";
import dayjs from "dayjs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getTravelData(slug);
  return {
    title: `${post.title} | Gabe O'Leary`,
  };
}

export default async function Page(props: PageProps) {
  const { params } = props;
  const { slug } = await params;
  const post = await getTravelData(slug);
  return (
    <article className="prose">
      <h1 className="mb-0 text-2xl font-bold">{post.title}</h1>
      <sub className="text-sm text-gray-500">
        {dayjs(post.date).format("MMMM YYYY")}
      </sub>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }}></div>
    </article>
  );
}
