import Link from "next/link";
import { getDb } from "../../lib/db";

export default async function Home() {
  const db = await getDb();

  const topStoriesRes = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
    { next: { revalidate: 60 } }
  );
  const topStoryIds = await topStoriesRes.json();
  const top10Ids = topStoryIds.slice(0, 10);

  let stories = [];
  const reValidate = Math.floor(Date.now() / 1000) - 5 * 60; // revalidate every 5 mins

  for (const id of top10Ids) {
    const cachedStory = await db.get(
      "SELECT id, title, score, author, comments_count, url FROM stories WHERE id = ? AND fetched_at > ?",
      id,
      reValidate
    );
    if (cachedStory) {
      stories.push({ ...cachedStory, descendants: cachedStory.comments_count });
    }
  }

  const storyPromises = top10Ids.map(async (storyId: string) => {
    const cachedStory = await db.get(
      "SELECT id, title, score, author, comments_count, url FROM stories WHERE id = ? AND fetched_at > ?",
      storyId,
      reValidate
    );
    if (cachedStory) {
      return { ...cachedStory, descendants: cachedStory.comments_count };
    } else {
      const res = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`,
        {
          cache: "no-store",
        }
      );
      if (res.ok) {
        const story = await res.json();
        if (story) {
          db.run(
            `INSERT OR REPLACE INTO stories (id, title, author, score, comments_count, url, fetched_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            story.id,
            story.title,
            story.by,
            story.score,
            story.descendants,
            story.url,
            Math.floor(Date.now() / 1000)
          );
          return story;
        }
      }
      return null;
    }
  });
  stories = await Promise.all(storyPromises);

  return (
    <main className="container mx-auto p-4">
      <h1 className="my-4 font-bold text-2xl text-center">
        Hacker News - Top 10 Stories
      </h1>
      <ol>
        {stories.map((story) => (
          <li key={story.id} className="mb-8 border-b border-b-[#eee]">
            <div>
              <Link
                href={`/story/${story.id}`}
                className="text-xl text-blue-500"
              >
                {story.title}
              </Link>
            </div>
            <div className="text-gray-600 mb-2">
              <span>{story.score} points</span>
              <span> by {story.by}</span>
              <span> | {story.descendants || 0} comments</span>{" "}
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
