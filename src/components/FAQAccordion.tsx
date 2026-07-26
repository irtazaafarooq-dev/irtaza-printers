"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQ = {
  _id: string;
  question: string;
  answer: string;
};

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-3 md:space-y-4">
      {faqs.map((faq) => {
        const isOpen = openId === faq._id;
        return (
          <div key={faq._id} className="border border-neutral-200 rounded-xl md:rounded-2xl overflow-hidden bg-white">
            <button
              onClick={() => setOpenId(isOpen ? null : faq._id)}
              className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left"
            >
              <span className="text-sm md:text-base font-bold text-neutral-900">{faq.question}</span>
              <ChevronDown
                size={20}
                className={`shrink-0 text-neutral-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="px-4 md:px-5 pb-4 md:pb-5 text-xs md:text-sm text-neutral-600 leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}