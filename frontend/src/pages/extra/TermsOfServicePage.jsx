import { FileText } from 'lucide-react';

const SECTIONS = [
  {
    title: '1. Acceptance of terms',
    body: 'By creating an account on UrbanVoice, you agree to these Terms of Service and our Privacy Policy.',
  },
  {
    title: '2. Acceptable use',
    body: 'You agree not to post false, defamatory, or malicious complaints, and not to misuse the reporting system to harass individuals or spam departments.',
  },
  {
    title: '3. Content ownership',
    body: 'You retain ownership of the photos, videos, and text you submit, but grant UrbanVoice a license to display and use this content for resolving and showcasing public issues.',
  },
  {
    title: '4. Accuracy of complaints',
    body: 'You are responsible for the accuracy of the issues you report. Knowingly filing false complaints may result in account suspension.',
  },
  {
    title: '5. Priority scoring',
    body: 'Priority scores are calculated automatically based on category weight, community upvotes, complaint age, and repeat reports in the same area, and may be adjusted by administrators.',
  },
  {
    title: '6. Account suspension',
    body: 'We reserve the right to suspend or terminate accounts that repeatedly violate these terms or engage in abusive behavior.',
  },
  {
    title: '7. Changes to these terms',
    body: 'We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the updated terms.',
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#f3e8d2] px-6 md:px-12 pt-24 md:pt-32 pb-20">
      <div className="max-w-[820px] mx-auto">
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase font-body text-black">
          <FileText size={14} className="text-black" /> Legal
        </span>
        <h1 className="font-display font-bold text-[30px] sm:text-[38px] md:text-[46px] leading-[1.1] mt-4 text-black">
          Terms of Service
        </h1>
        <p className="font-body text-[13px] text-black mt-3">
          Last updated: September 2026
        </p>

        <div className="flex flex-col gap-8 mt-10">
          {SECTIONS.map((section) => (
            <div 
              key={section.title} 
              className="rounded-2xl border border-[#f5f3cd]/30 bg-[#122951] p-6 md:p-7"
            >
              <h2 className="font-display font-bold text-[18px] md:text-[20px] text-[#f5f3cd]">
                {section.title}
              </h2>
              <p className="font-body text-[14.5px] text-[#f5f3cd] mt-2 leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}