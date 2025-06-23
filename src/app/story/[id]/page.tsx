import Link from "next/link";

interface Story {
  id: number;
  by: string;
  kids: number[];
  score: number;
  title: string;
  url: string;
  type: "story";
}

interface Comment {
  id: number;
  by: string;
  text: string;
  type: "comment";
  deleted?: boolean;
}

const fetchItem = async function <T>(id: string | number): Promise<T | null> {
  try {
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      console.error(`Failed to fetch item ${id}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`Network or other error fetching item ${id}:`, error);
    return null;
  }
};

type StoryPageProps = {
  params: Promise<{ id: string }>;
};

const StoryDetailPage = async ({ params }: StoryPageProps) => {
  const { id } = await params;

  const story = await fetchItem<Story>(id);

  if (!story || story.type !== "story") {
    return <div>404, Story not found</div>;
  }

  let comments: Comment[] = [];
  if (story.kids && story.kids.length > 0) {
    const commentPromises = story.kids.map((commentId) =>
      fetchItem<Comment>(commentId)
    );
    const settledComments = await Promise.all(commentPromises);
    comments = settledComments.filter(
      (comment): comment is Comment => comment !== null && !comment.deleted
    );
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{story.title}</h1>
      <div className="mb-8 text-gray-500">
        <span>{story.score} points</span>
        <span> by {story.by}</span>
        {story.url && (
          <span>
            {" "}
            |{" "}
            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              Visit Link
            </a>
          </span>
        )}
      </div>

      <p className="text-xl border-b border-b-[#eee] pb-2">
        Comments ({comments.length})
      </p>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} className="border-b border-b-[#eee] py-4">
            <div className="text-sm text-gray-600 mb-2">By: {comment.by}</div>
            <div dangerouslySetInnerHTML={{ __html: comment.text }} />
          </li>
        ))}
      </ul>
      <Link href="/" className="text-blue-600 mt-4 inline-block">
        &larr; Back to stories
      </Link>
    </main>
  );
};

export default StoryDetailPage;
