import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Irtaza Printers",
  description: "How we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    // CHANGED: Added pt-32 md:pt-40 to clear the fixed navbar, and adjusted mobile padding/spacing
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-16 md:pt-40 md:pb-24 space-y-8 md:space-y-12">
      <div className="text-center space-y-3 md:space-y-4">
        {/* CHANGED: Smoother text scaling for mobile screens */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-neutral-900">Privacy Policy</h1>
        <p className="text-xs sm:text-sm md:text-base text-neutral-500">Last updated: May 2026</p>
      </div>

      {/* CHANGED: Added prose-sm md:prose-base so text doesn't look gigantic on mobile */}
      <div className="prose prose-sm md:prose-base prose-neutral max-w-none prose-headings:font-serif prose-headings:text-neutral-900 prose-p:text-neutral-600 leading-relaxed">
        <h2>1. Introduction</h2>
        <p>
          Welcome to Irtaza Printers. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
        </p>

        <h2>2. The Data We Collect About You</h2>
        <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
        <ul className="list-disc pl-6 space-y-2 text-neutral-600">
          <li><strong>Identity Data:</strong> includes first name, last name, or similar identifier.</li>
          <li><strong>Contact Data:</strong> includes billing address, delivery address, email address, and telephone numbers.</li>
          <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us (e.g., payment screenshots).</li>
        </ul>

        <h2>3. How We Use Your Personal Data</h2>
        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
        <ul className="list-disc pl-6 space-y-2 text-neutral-600">
          <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., processing and shipping your order).</li>
          <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. We limit access to your personal data to those employees and agents who have a business need to know.
        </p>

        <h2>5. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our privacy practices, please contact us via our <Link href="/contact" className="text-neutral-900 underline underline-offset-4 font-medium">Contact Page</Link> or via WhatsApp.
        </p>
      </div>
    </div>
  );
}