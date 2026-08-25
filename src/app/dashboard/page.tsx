"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, LogOut, Plus, Copy, Check } from "lucide-react";

type Snippet = {
  id: string;
  title: string;
  content: string;
  tags: string | null;
  createdAt: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  // New snippet state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchSnippets();
    }
  }, [status, router]);

  const fetchSnippets = async () => {
    try {
      const res = await fetch("/api/snippets");
      if (res.ok) {
        const data = await res.json();
        setSnippets(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError("");

    try {
      const res = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, tags }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create snippet");
      }

      const newSnippet = await res.json();
      setSnippets([newSnippet, ...snippets]);
      setTitle("");
      setContent("");
      setTags("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/snippets/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSnippets(snippets.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // @ts-ignore
  const userPlan = session?.user?.plan || "FREE";
  // @ts-ignore
  const isFree = userPlan === "FREE";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="px-6 py-4 bg-white border-b flex justify-between items-center shadow-sm">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          Snippetz Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            {/* @ts-ignore */}
            <span className="text-gray-500 mr-2">Plan:</span>
            <span className={`font-bold ${isFree ? "text-gray-700" : "text-indigo-600"}`}>
              {userPlan}
            </span>
          </div>
          {isFree && (
            <Link
              href="/billing"
              className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full hover:bg-indigo-200"
            >
              Upgrade
            </Link>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-gray-500 hover:text-gray-900"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* Left Column: Create Snippet Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Plus className="mr-2 h-5 w-5 text-indigo-600" />
              New Snippet
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                  {error}
                  {error.includes("Upgrade") && (
                    <Link href="/billing" className="block mt-2 font-bold underline">
                      Go to Billing
                    </Link>
                  )}
                </div>
              )}
              <div>
                <input
                  type="text"
                  placeholder="Snippet Title"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <textarea
                  placeholder="Paste your snippet or prompt here..."
                  required
                  rows={5}
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {isCreating ? "Saving..." : "Save Snippet"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: List of Snippets */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Your Library ({snippets.length})
          </h2>
          {snippets.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No snippets yet. Create your first one!</p>
            </div>
          ) : (
            snippets.map((snippet) => (
              <div key={snippet.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{snippet.title}</h3>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleCopy(snippet.id, snippet.content)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 rounded bg-gray-50 hover:bg-indigo-50"
                      title="Copy"
                    >
                      {copiedId === snippet.id ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    <button
                      onClick={() => handleDelete(snippet.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded bg-gray-50 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <pre className="text-sm bg-gray-50 p-3 rounded-lg overflow-x-auto font-mono text-gray-800 mb-3 whitespace-pre-wrap">
                  {snippet.content}
                </pre>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex gap-2">
                    {snippet.tags?.split(",").map((tag, i) => {
                      if (!tag.trim()) return null;
                      return (
                        <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium">
                          {tag.trim()}
                        </span>
                      );
                    })}
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(snippet.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
