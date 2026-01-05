import { getWorkData } from "@/lib/posts";
import { Metadata } from "next";
import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const work = await getWorkData(slug);
  return {
    title: `${work.title} | Gabe O'Leary`,
  };
}

const isLocalLink = (link: string) => link.startsWith("/");

export default async function Page(props: PageProps) {
  const { params } = props;
  const { slug } = await params;
  const work = await getWorkData(slug);
  const titleClassName = "mb-0 text-2xl font-bold";
  return (
    <article className="prose">
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
