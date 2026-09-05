import { ShieldCheck } from 'lucide-react';

const SECTIONS = [
  {
    title: '1. Information we collect',
    body: 'We collect account details (name, username, email), complaint content (photos, videos, descriptions, location), and usage data (likes, views, follows) needed to operate the platform.',
  },
  {
    title: '2. How we use your information',
    body: 'Your data is used to route complaints to the right department, calculate priority scores, show relevant feeds, and improve the overall reporting experience.',
  },
  {
    title: '3. Anonymous complaints',
    body: 'If you choose to file a complaint anonymously, your identity is hidden from public view, though it remains linked to your account internally for moderation and fraud prevention.',
  },
  {
    title: '4. Data sharing',
    body: 'We do not sell personal data. Complaint details relevant to resolution may be shared with the concerned civic department or administrator handling your issue.',
  },
  {
    title: '5. Data retention',
    body: 'Complaint records are retained to maintain public transparency and historical tracking. You may request deletion of your account and associated personal data at any time from Settings.',
  },
  {
    title: '6. Your rights',
    body: 'You can access, export, or delete your data via the Settings page. Contact support if you need help exercising these rights.',
  },
  {
    title: '7. Security',
    body: 'We use industry-standard practices including encrypted passwords and token-based authentication to protect your account.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f3e8d2] px-6 md:px-12 pt-24 md:pt-32 pb-20">
      <div className="max-w-[820px] mx-auto">
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase font-body text-black">
          <ShieldCheck size={14} className="text-black" /> Legal
        </span>
        <h1 className="font-display font-bold text-[30px] sm:text-[38px] md:text-[46px] leading-[1.1] mt-4 text-black">
          Privacy Policy
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