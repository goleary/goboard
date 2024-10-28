import { getWorkData } from "@/lib/posts";
import Head from "next/head";
import { PageProps } from "@/.next/types/app/page";
import Link from "next/link";

const isLocalLink = (link: string) => link.startsWith("/");

export default async function Page(props: PageProps) {
  const { params } = props;
  const { slug } = await params;
  const work = await getWorkData(slug);
  const titleClassName = "mb-0 text-2xl font-bold";
  return (
    <article className="prose">
      <Head>
        <title>{work.title}</title>
      </Head>
      {work.link ? (
        isLocalLink(work.link) ? (
          <Link className={titleClassName} href={work.link}>
            {work.title}
          </Link>
        ) : (
          <a className={titleClassName} href={work.link} target="_blank">
            {work.title}
          </a>
        )
      ) : (
        <h1 className={titleClassName}>{work.title}</h1>
      )}
      {/* <sub className="text-sm text-gray-500">
        {dayjs(work.date).format("MMMM D, YYYY")}
      </sub> */}
      <div dangerouslySetInnerHTML={{ __html: work.contentHtml }}></div>
    </article>
  );
}
