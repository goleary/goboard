import { MetadataRoute } from "next";
import { saunas, cities, getLatestUpdateDate } from "@/data/saunas/saunas";
import {
  getSortedWorksData,
  getSortedPostsData,
  getSortedTravelData,
} from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://goleary.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/travel`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/photos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Tool pages
  const toolPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/tools/current-map`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/lake-stats`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/marriage-tax-calculator`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];

  // Saunas pages - use the latest sauna update date for accurate lastModified
  const latestSaunaUpdate = new Date(getLatestUpdateDate());
  
  const saunaIndexPage: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/tools/saunas`,
      lastModified: latestSaunaUpdate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // City-specific sauna pages with SEO-optimized metadata
  const saunaCityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/tools/saunas/${city.slug}`,
    lastModified: latestSaunaUpdate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const saunaDetailPages: MetadataRoute.Sitemap = saunas.map(
    (sauna) => ({
      url: `${baseUrl}/tools/saunas?sauna=${sauna.slug}`,
      lastModified: new Date(sauna.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  // Dynamic content pages
  const works = getSortedWorksData();
  const workPages: MetadataRoute.Sitemap = works.map((work) => ({
    url: `${baseUrl}/works/${work.id}`,
    lastModified: new Date(work.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const posts = getSortedPostsData();
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const travels = getSortedTravelData();
  const travelPages: MetadataRoute.Sitemap = travels.map((travel) => ({
    url: `${baseUrl}/travel/${travel.id}`,
    lastModified: new Date(travel.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...toolPages,
    ...saunaIndexPage,
    ...saunaCityPages,
    ...saunaDetailPages,
    ...workPages,
    ...postPages,
    ...travelPages,
  ];
}
