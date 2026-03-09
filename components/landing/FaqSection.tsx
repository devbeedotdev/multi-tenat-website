type Faq = {
  question: string;
  answer: string;
};

const faqs: Faq[] = [
  {
    question: "How much does an ecommerce website cost in Nigeria?",
    answer: "Our ecommerce website package is a flat fee of ₦50,000 – no surprise setup costs or hidden monthly charges from us.",
  },
  {
    question: "Can I accept payments with Paystack or GTBank?",
    answer: "Yes. Your store is built to work smoothly with modern Nigerian payment providers like Paystack and bank transfers, including GTBank accounts.",
  },
  {
    question: "Do I need a laptop to manage my store?",
    answer: "No. The admin dashboard and storefront are 100% mobile-friendly, so you can manage products and orders directly from your phone.",
  },
  {
    question: "How long does it take to go live?",
    answer: "Once you pay, your ecommerce website is typically ready within 24 hours with your store URL and login details.",
  },
];

export default function FaqSection() {
  return (
    <section
      aria-labelledby="people-also-ask-heading"
      className="border-t border-slate-800/60 bg-slate-950 px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-2 text-center">
          <h2
            id="people-also-ask-heading"
            className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl"
          >
            People also ask about ecommerce websites in Nigeria
          </h2>
          <p className="text-sm text-slate-300/90 sm:text-base">
            Clear answers to the most common questions Nigerian vendors ask
            before launching an online store.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-slate-100">
                <span>{faq.question}</span>
                <span className="text-xs text-slate-400 transition group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <div className="mt-2 text-xs leading-relaxed text-slate-300/90">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

