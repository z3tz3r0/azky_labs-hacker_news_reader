import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-4">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-lg text-center mb-8 max-w-md">
        Oops! The story you&apos;re looking for doesn&apos;t exist. It might
        have been removed or the link is incorrect.
      </p>
      <Link href="/" className="text-blue-500 hover:underline text-xl">
        &larr; Go back to Home
      </Link>
    </div>
  );
}
