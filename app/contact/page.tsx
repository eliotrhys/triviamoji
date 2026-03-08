import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get support or contact Triviamoji for ads, policy, or gameplay questions.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white border-4 border-black rounded-lg p-6 lg:p-8">
        <h1 className="text-3xl lg:text-4xl mb-4">Contact Us</h1>

        <p className="mb-4">
          For support, ad issues, or policy questions, contact Triviamoji via X:
        </p>

        <p className="mb-6">
          <a
            className="underline text-blue-500 text-xl"
            href="https://x.com/eliothectorson"
            target="_blank"
            rel="noreferrer"
          >
            @eliothectorson
          </a>
        </p>

        <div className="flex flex-wrap gap-4">
          <Link className="underline text-blue-500" href="/">
            Back to Home
          </Link>
          <Link className="underline text-blue-500" href="/about">
            About Us
          </Link>
        </div>
      </div>
    </main>
  );
}
