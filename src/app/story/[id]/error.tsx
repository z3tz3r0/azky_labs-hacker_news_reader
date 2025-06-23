"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h2>Something went wrong!</h2>
      <p>There was an issue fetching data from the Hacker News API.</p>
      <button onClick={() => reset()} className="px-2 py-4 cursor-pointer">
        Try again
      </button>
    </div>
  );
}
