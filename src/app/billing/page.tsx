"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function BillingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID; 
      
      if (!priceId) {
        alert("Stripe price ID is missing from environment variables.");
        setLoading(false);
        return;
      }
      
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to start checkout: " + (data.error || "Unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // @ts-ignore
  const userPlan = session?.user?.plan || "FREE";
  const isFree = userPlan === "FREE";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Billing & Plan</h1>
          <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Current Plan</p>
          <div className="flex items-center">
            <span className={`text-xl font-bold ${isFree ? 'text-gray-700' : 'text-indigo-600'}`}>
              {userPlan} Plan
            </span>
            {!isFree && (
              <span className="ml-3 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                Active
              </span>
            )}
          </div>
        </div>

        {isFree ? (
          <div>
            <h2 className="text-lg font-semibold mb-2">Upgrade to Pro</h2>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>✓ Unlimited snippets</li>
              <li>✓ Advanced tagging</li>
              <li>✓ Priority support</li>
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Redirecting..." : "Upgrade for $5/month"}
            </button>
            <p className="text-xs text-center text-gray-400 mt-4">
              Requires setting <code>NEXT_PUBLIC_STRIPE_PRICE_ID</code> in <code>.env</code>
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-6">
              You are on the Pro plan! Enjoy unlimited snippets.
            </p>
            <button
              disabled
              className="w-full bg-gray-200 text-gray-500 font-semibold py-3 rounded-lg cursor-not-allowed"
            >
              Manage Subscription (Coming soon)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
