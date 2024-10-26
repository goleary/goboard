import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";
const Posts: React.FC = () => {
  const posts = getSortedPostsData();

  return (
    <div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Posts;
