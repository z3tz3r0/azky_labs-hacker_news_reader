import Link from "next/link";

const fetchDetails = async (id: string) => {
  const storyResponse = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
    { cache: "no-store" }
  );
  if (!storyResponse.ok) return null;
  return storyResponse.json();
};

type Params = { id: string };

const StoryDetailPage = async ({ params }: { params: Params }) => {
  const { id } = params;

  // fetch the Detail page
  const story = await fetchDetails(id);

  if (!story) {
    return <div>404, Story not found</div>;
  }

  let comments = [];
  if (story.kids && story.kids.length > 0) {
    const commentPromises = story.kids.map((commentId: string) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`, {
        cache: "no-store",
      }).then((res) => (res.ok ? res.json() : null))
    );
    const settledComments = await Promise.all(commentPromises);
    comments = settledComments.filter((comment) => comment && !comment.deleted);
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
