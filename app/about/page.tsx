import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Triviamoji, our emoji trivia mission, content standards, and update schedule.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white border-4 border-black rounded-lg p-6 lg:p-8">
        <h1 className="text-3xl lg:text-4xl mb-4">About Us</h1>
        <p className="mb-4">
          Triviamoji is an original emoji trivia game built to be fast, fun, and replayable
          on desktop and mobile.
        </p>

        <h2 className="text-2xl mb-2">Our Content Standards</h2>
        <p className="mb-4">
          We focus on high-quality, relevant puzzle content across multiple categories,
          and we avoid restricted content like adult material, graphic violence, and hate
          speech.
        </p>

        <h2 className="text-2xl mb-2">Diverse Formats</h2>
        <p className="mb-4">
          Our question sets cover films, TV, books, songs, landmarks, brands, and more,
          with image-led gameplay and category-based variety.
        </p>

        <h2 className="text-2xl mb-2">Regular Updates</h2>
        <p className="mb-4">
          We add and refresh question content on a consistent schedule to keep gameplay
          fresh for returning players.
        </p>

        <h2 className="text-2xl mb-2">Transparency</h2>
        <p className="mb-6">
          You can review our{" "}
          <Link className="underline text-blue-500" href="/privacy-policy">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link className="underline text-blue-500" href="/terms">
            Terms of Service
          </Link>
          . For support, visit our{" "}
          <Link className="underline text-blue-500" href="/contact">
            Contact page
          </Link>
          .
        </p>

        <Link className="underline text-blue-500" href="/">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
