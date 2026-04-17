"use client";

import Link from "next/link";

export default function MusicVivdoesError({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="mb-4">{String(error?.message || "An unknown error occurred.")}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset?.()}
            className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
          >
            Try again
          </button>
          <Link href="/" className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
