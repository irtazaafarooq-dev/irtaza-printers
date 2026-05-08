export const metadata = {
  title: "Terms of Service | Irtaza Printers",
  description: "Terms and conditions for using our website and purchasing our products.",
};

export default function TermsOfServicePage() {
  return (
    // CHANGED: Added pt-32 md:pt-40 to clear the fixed navbar, and adjusted mobile padding/spacing
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-16 md:pt-40 md:pb-24 space-y-8 md:space-y-12">
      <div className="text-center space-y-3 md:space-y-4">
        {/* CHANGED: Smoother text scaling for mobile screens */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-neutral-900">Terms of Service</h1>
        <p className="text-xs sm:text-sm md:text-base text-neutral-500">Last updated: May 2026</p>
      </div>

      {/* CHANGED: Added prose-sm md:prose-base so text doesn't look gigantic on mobile */}
      <div className="prose prose-sm md:prose-base prose-neutral max-w-none prose-headings:font-serif prose-headings:text-neutral-900 prose-p:text-neutral-600 leading-relaxed">
        <h2>1. Agreement to Terms</h2>
        <p>
          By accessing our website and purchasing our products, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
        </p>

        <h2>2. Products and Customization</h2>
        <p>
          Irtaza Printers specializes in custom printing. While we strive to ensure that colors and designs match the digital proofs as closely as possible, slight variations in color and texture may occur due to the physical printing process. By placing an order, you acknowledge and accept these minor physical variations.
        </p>

        <h2>3. Orders and Payment</h2>
        <ul className="list-disc pl-6 space-y-2 text-neutral-600">
          <li>All orders are subject to acceptance and availability.</li>
          <li>For online transfers (JazzCash, Easypaisa, Bank Transfer), orders will only begin processing once the payment screenshot has been verified by our team.</li>
          <li>Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue a product without notice.</li>
        </ul>

        <h2>4. Shipping and Delivery</h2>
        <p>
          We aim to dispatch all orders within the specified processing time. However, delivery times are estimates and may be subject to delays beyond our control (e.g., courier issues, extreme weather). Irtaza Printers is not liable for delayed deliveries once the package has been handed over to the courier partner.
        </p>

        <h2>5. Returns and Refunds</h2>
        <p>
          Because our products (such as customized playing cards and personalized decor books) are made-to-order, we generally do not accept returns or offer refunds unless the item arrives damaged or there was a clear printing error on our part. If your item is defective, please contact us within 48 hours of delivery with photographic proof.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>
          Customers must ensure they have the right to use any images, logos, or text they submit for custom printing. Irtaza Printers holds no responsibility for copyright infringement resulting from customer-supplied artwork.
        </p>
      </div>
    </div>
  );
}