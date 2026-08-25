import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 border-b bg-white flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600">Snippetz</div>
        <nav className="flex items-center gap-4">
          {session ? (
            <Link href="/dashboard" className="text-sm font-medium hover:text-indigo-600">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-medium hover:text-indigo-600">
              Sign In
            </Link>
          )}
          {session ? (
            <Link
              href="/dashboard"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Go to App
            </Link>
          ) : (
            <Link
              href="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Get Started
            </Link>
          )}
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-2xl">
          The cleanest way to organize your <span className="text-indigo-600">prompts and snippets</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-xl">
          Stop losing your best work in random notes apps. Save, tag, and copy your most used snippets in one click.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link
            href="/login"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 shadow-lg"
          >
            Start building your library
          </Link>
        </div>

        <div className="w-full max-w-5xl" id="pricing">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Simple Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Tier */}
            <div className="border border-gray-200 bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <div className="text-4xl font-extrabold mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8 text-left w-full">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Up to 3 snippets
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Basic search
                </li>
              </ul>
              <Link href="/login" className="mt-auto w-full border border-indigo-600 text-indigo-600 font-semibold py-2 rounded-lg hover:bg-indigo-50 transition text-center">
                Get Started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="border border-indigo-200 bg-indigo-50 rounded-2xl p-8 shadow-md flex flex-col items-center relative">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg rounded-tr-xl">POPULAR</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="text-4xl font-extrabold mb-6">$5<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8 text-left w-full">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Unlimited snippets
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Advanced tagging
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Priority support
                </li>
              </ul>
              <Link href="/login" className="mt-auto w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition text-center">
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-500 text-sm border-t">
        &copy; {new Date().getFullYear()} Snippetz. All rights reserved.
      </footer>
    </div>
  );
}
