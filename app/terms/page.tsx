import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the Triviamoji terms for acceptable use, content, and liability.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white border-4 border-black rounded-lg p-6 lg:p-8">
        <h1 className="text-3xl lg:text-4xl mb-4">Terms of Service</h1>
        <p className="mb-4">Last updated: March 7, 2026</p>

        <h2 className="text-2xl mb-2">Use of the Site</h2>
        <p className="mb-4">
          You may use Triviamoji for personal, non-commercial use. Do not attempt to
          disrupt, abuse, or reverse engineer the service.
        </p>

        <h2 className="text-2xl mb-2">Content</h2>
        <p className="mb-4">
          Game content is provided for entertainment purposes only and may change at any
          time without notice.
        </p>

        <h2 className="text-2xl mb-2">No Warranty</h2>
        <p className="mb-4">
          The site is provided &quot;as is&quot; without warranties of any kind.
        </p>

        <h2 className="text-2xl mb-2">Limitation of Liability</h2>
        <p className="mb-4">
          We are not liable for any damages arising from use of the site to the fullest
          extent permitted by law.
        </p>

        <h2 className="text-2xl mb-2">Changes</h2>
        <p className="mb-6">
          We may update these terms at any time. Continued use of the site means you
          accept the updated terms.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link className="underline text-blue-500" href="/">
            Back to Home
          </Link>
          <Link className="underline text-blue-500" href="/about">
            About Us
          </Link>
          <Link className="underline text-blue-500" href="/contact">
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
