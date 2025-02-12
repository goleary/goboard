import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

import { z } from "zod";

const postsDirectory = path.join(process.cwd(), "posts");
const worksDirectory = path.join(process.cwd(), "works");
const travelDirectory = path.join(process.cwd(), "travel");
const postSchema = z.object({
  title: z.string(),
  link: z.string().optional(),
  date: z.string(),
  description: z.string().optional(),
});

function getSortedData(directory: string) {
  // Get file names under /posts
  const fileNames = fs.readdirSync(directory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(directory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    const postData = postSchema.parse(matterResult.data);

    // Combine the data with the id
    return {
      id,
      ...postData,
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getSortedPostsData() {
  return getSortedData(postsDirectory);
}

export function getSortedTravelData() {
  return getSortedData(travelDirectory);
}

export function getSortedWorksData() {
  return getSortedData(worksDirectory);
}

async function getFileData(directory: string, slug: string) {
  const fullPath = path.join(directory, `${slug}.md`);
  console.log("fullPath: ", fullPath);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  const postData = postSchema.parse(matterResult.data);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html, {
      sanitize: false,
    })
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id: slug,
    ...postData,
    contentHtml,
  };
}

export async function getPostData(slug: string) {
  return getFileData(postsDirectory, slug);
}
export async function getWorkData(slug: string) {
  return getFileData(worksDirectory, slug);
}

export async function getTravelData(slug: string) {
  return getFileData(travelDirectory, slug);
}
