import { getSortedPostsData } from "@/lib/posts";
import dayjs from "dayjs";
import Link from "next/link";
const Posts: React.FC = () => {
  const posts = getSortedPostsData();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Posts</h1>
      <p>
        Various ramblings on technologies I&apos;ve used, experiences I&apos;ve
        had and things I&apos;ve built.
      </p>
      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`} className="grid grid-cols-5 group">
              <sub className="text-sm text-gray-500">
                {dayjs(post.date).format("MMMM D, YYYY")}
              </sub>
              <h1 className="text-lg font-bold col-span-4 group-hover:underline text-slate-900">
                {post.title}
              </h1>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Posts;
