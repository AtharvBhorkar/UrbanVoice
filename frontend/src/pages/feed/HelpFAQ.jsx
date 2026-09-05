import { useState } from 'react';
import { ChevronDown, HelpCircle, Mail, Phone, MessageSquare } from 'lucide-react';
const FAQS = [
  { q: 'How do I file a complaint?', a: 'Go to Create, select "Post" or "Reel", add photos/video, description and location, then submit.' },
  { q: 'How long does it take for a complaint to be resolved?', a: 'Resolution time depends on the civic department and issue severity. You can track status from My Complaints.' },
  { q: 'How do badges work?', a: 'Badges are earned based on your activity — verified complaints, engagement, and community impact.' },
  { q: 'Can I edit or delete a post after posting?', a: 'Yes, open the post and use the More (···) menu to edit the caption or delete it.' },
  { q: 'How do I report inappropriate content?', a: 'Use the report option from the post options menu, or contact support via this page.' },
];

export default function HelpFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen ml-0 md:ml-[76px] bg-ink-950 px-8 py-10">
      <div className="max-w-[720px] mx-auto">
        <div className="flex items-center gap-2.5 mb-8">
          <HelpCircle size={22} className="text-volt" />
          <h1 className="text-[22px] font-display font-bold text-text-dark">Help &amp; FAQ</h1>
        </div>

        <div className="flex flex-col gap-2">
          {FAQS.map((item, i) => (
            <div key={i} className="rounded-xl border border-ink-800 bg-ink-900 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left"
              >
                <span className="text-[14px] font-semibold font-body text-text-dark">{item.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-text-dark-muted shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === i && (
                <p className="px-4 pb-3.5 text-[13px] font-body text-text-dark-muted leading-relaxed">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-ink-800 bg-ink-900 p-5">
          <h2 className="text-[14px] font-semibold font-body text-text-dark mb-4">Still need help?</h2>
          <div className="flex flex-col gap-3">
            <a href="mailto:support@urbanvoice.app" className="flex items-center gap-3 text-[13px] font-body text-text-dark-muted hover:text-text-dark transition-colors">
              <Mail size={16} className="text-volt shrink-0" />
              support@urbanvoice.app
            </a>
            <a href="tel:+911234567890" className="flex items-center gap-3 text-[13px] font-body text-text-dark-muted hover:text-text-dark transition-colors">
              <Phone size={16} className="text-volt shrink-0" />
              +91 12345 67890
            </a>
            <div className="flex items-center gap-3 text-[13px] font-body text-text-dark-muted">
              <MessageSquare size={16} className="text-volt shrink-0" />
              Live chat support: Mon–Sat, 9 AM – 7 PM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}