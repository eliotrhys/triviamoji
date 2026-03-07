import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white border-4 border-black rounded-lg p-6 lg:p-8">
        <h1 className="text-3xl lg:text-4xl mb-4">Privacy Policy</h1>
        <p className="mb-4">Last updated: March 7, 2026</p>

        <h2 className="text-2xl mb-2">What We Collect</h2>
        <p className="mb-4">
          Triviamoji stores gameplay preferences and scores in your browser local storage.
          We also use analytics and advertising services that may collect technical data
          such as IP address, browser/device data, and usage events.
        </p>

        <h2 className="text-2xl mb-2">Advertising</h2>
        <p className="mb-4">
          This site uses Google AdSense to display ads. Google and its partners may use
          cookies and similar technologies to show ads and measure performance.
        </p>

        <h2 className="text-2xl mb-2">Analytics</h2>
        <p className="mb-4">
          We use Google Analytics to understand traffic and improve gameplay experience.
        </p>

        <h2 className="text-2xl mb-2">Your Choices</h2>
        <p className="mb-4">
          You can clear browser storage and adjust cookie settings in your browser at any
          time.
        </p>

        <h2 className="text-2xl mb-2">Contact</h2>
        <p className="mb-6">
          For privacy questions, contact us via X at{" "}
          <a
            className="underline text-blue-500"
            href="https://x.com/eliothectorson"
            target="_blank"
            rel="noreferrer"
          >
            @eliothectorson
          </a>
          .
        </p>

        <Link className="underline text-blue-500" href="/">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
