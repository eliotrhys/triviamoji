import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white border-4 border-black rounded-lg p-6 lg:p-8">
        <h1 className="text-3xl lg:text-4xl mb-4">Contact</h1>

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

        <Link className="underline text-blue-500" href="/">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
