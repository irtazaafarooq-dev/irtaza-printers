"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Pencil, X, Save } from "lucide-react";
import DeleteFAQButton from "./DeleteFAQButton";

type FAQ = {
  _id: string;
  question: string;
  answer: string;
  order: number;
};

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({ question: "", answer: "" });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ question: "", answer: "" });

  const fetchFaqs = async () => {
    try {
      const res = await fetch("/api/faqs");
      const data = await res.json();
      if (data.success) setFaqs(data.faqs);
    } catch (error) {
      setMessage("Failed to load FAQs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setMessage("FAQ added successfully!");
        setFormData({ question: "", answer: "" });
        fetchFaqs();
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("Failed to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (faq: FAQ) => {
    setEditingId(faq._id);
    setEditData({ question: faq.question, answer: faq.answer });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ question: "", answer: "" });
  };

  const saveEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/faqs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (data.success) {
        setEditingId(null);
        fetchFaqs();
      }
    } catch (error) {
      setMessage("Failed to update FAQ.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchFaqs();
    } catch (error) {
      setMessage("Failed to delete FAQ.");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-4xl mx-auto space-y-8">

      {/* ADD FORM */}
      <div className="bg-white p-5 sm:p-8 md:p-12 rounded-2xl md:rounded-3xl shadow-sm border border-neutral-200">
        <h1 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-6 md:mb-8">Add New FAQ</h1>

        {message && (
          <div className={`p-4 mb-6 md:mb-8 rounded-xl flex items-center gap-3 text-sm md:text-base ${message.includes("Error") ? "bg-red-50 text-red-700 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"}`}>
            {!message.includes("Error") && <CheckCircle2 size={20} className="shrink-0" />}
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1.5 md:mb-2">Question</label>
            <input
              required
              type="text"
              value={formData.question}
              onChange={e => setFormData({ ...formData, question: e.target.value })}
              className="w-full border border-neutral-300 rounded-lg p-3 text-sm md:text-base outline-none focus:border-neutral-900 transition-colors"
              placeholder="e.g., How long does delivery take?"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1.5 md:mb-2">Answer</label>
            <textarea
              required
              rows={4}
              value={formData.answer}
              onChange={e => setFormData({ ...formData, answer: e.target.value })}
              className="w-full border border-neutral-300 rounded-lg p-3 text-sm md:text-base outline-none focus:border-neutral-900 transition-colors resize-none"
              placeholder="e.g., Orders are delivered within 3-5 business days across Pakistan."
            />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-neutral-900 text-white py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-colors active:scale-[0.99] shadow-lg shadow-neutral-900/20 flex items-center justify-center gap-2">
            <Plus size={18} />
            {isSubmitting ? "Saving..." : "Add FAQ"}
          </button>
        </form>
      </div>

      {/* FAQ LIST */}
      <div className="bg-white border border-neutral-200 rounded-xl md:rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 md:p-6 border-b border-neutral-200">
          <h2 className="text-lg md:text-xl font-serif text-neutral-900">All FAQs ({faqs.length})</h2>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">These appear on your homepage in this order.</p>
        </div>

        <div className="divide-y divide-neutral-100">
          {loading ? (
            <p className="p-8 text-center text-sm text-neutral-500">Loading...</p>
          ) : faqs.length === 0 ? (
            <p className="p-8 text-center text-sm text-neutral-500">No FAQs added yet.</p>
          ) : (
            faqs.map((faq) => (
              <div key={faq._id} className="p-4 md:p-5">
                {editingId === faq._id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editData.question}
                      onChange={e => setEditData({ ...editData, question: e.target.value })}
                      className="w-full border border-neutral-300 rounded-lg p-3 text-sm font-medium"
                    />
                    <textarea
                      rows={3}
                      value={editData.answer}
                      onChange={e => setEditData({ ...editData, answer: e.target.value })}
                      className="w-full border border-neutral-300 rounded-lg p-3 text-sm resize-none"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(faq._id)} className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider">
                        <Save size={14} /> Save
                      </button>
                      <button onClick={cancelEdit} className="flex items-center gap-1.5 px-3 py-2 border border-neutral-200 rounded-lg text-xs font-bold uppercase tracking-wider text-neutral-600">
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-neutral-900">{faq.question}</p>
                      <p className="text-xs md:text-sm text-neutral-500 mt-1">{faq.answer}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => startEdit(faq)} className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                        <Pencil size={16} />
                      </button>
                      <DeleteFAQButton faqId={faq._id} onDeleted={() => {
                        // Refresh the FAQ list after deletion
                        fetchFaqs();
                      }} />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}