import { Link } from 'react-router-dom';
import {
  FileText, ListChecks, Building2, Bell, CheckCircle2, ArrowRight,
} from 'lucide-react';

const STEPS = [
  {
    icon: FileText,
    title: 'Report the issue',
    desc: 'Snap a photo or short video, add a description and location, and submit it in under a minute — anonymously if you prefer.',
  },
  {
    icon: ListChecks,
    title: 'Categorize & prioritize',
    desc: 'Every complaint is auto-tagged by category and scored using upvotes, age, and repeat reports in the same area — so urgent issues rise to the top.',
  },
  {
    icon: Building2,
    title: 'Route to the right department',
    desc: 'Based on category (Water, Electricity, Sanitation, Roads, Civic, Society), the complaint is assigned to the responsible department automatically.',
  },
  {
    icon: Bell,
    title: 'Track progress in real time',
    desc: 'Follow the status timeline — Pending, In Progress, Resolved or Rejected — with notes from the team handling it.',
  },
  {
    icon: CheckCircle2,
    title: 'Resolution & feedback',
    desc: 'Once resolved, you get a proof update and can rate whether the fix actually solved the problem — feeding back into public trust scores.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#f3e8d2] px-6 md:px-12 pt-24 md:pt-32 pb-20">
      <div className="max-w-[880px] mx-auto">
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase font-body text-black">
          <span className="w-1.5 h-1.5 rounded-full bg-black" />
          Process
        </span>
        <h1 className="font-display font-bold text-[32px] sm:text-[40px] md:text-[52px] leading-[1.1] mt-4 text-black">
          How UrbanVoice works
        </h1>
        <p className="font-body text-[15px] md:text-[17px] text-black mt-4 max-w-xl leading-relaxed">
          From "someone should fix this" to "it's fixed" — five simple steps
          that keep every public issue visible and accountable.
        </p>

        <div className="mt-14 flex flex-col gap-5">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-2xl border border-[#f5f3cd]/30 bg-[#122951] p-5 md:p-7"
              >
                <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-3 shrink-0">
                  <span className="w-11 h-11 rounded-xl bg-[#f5f3cd]/10 text-[#f5f3cd] flex items-center justify-center shrink-0">
                    <Icon size={20} />
                  </span>
                  <span className="font-display font-bold text-[13px] text-[#f5f3cd]">
                    Step {i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-[18px] md:text-[20px] text-[#f5f3cd]">
                    {step.title}
                  </h3>
                  <p className="font-body text-[14px] md:text-[15px] text-[#f5f3cd] mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 rounded-2xl border border-[#f5f3cd]/30 bg-[#122951] p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h3 className="font-display font-bold text-[18px] text-[#f5f3cd]">
              Ready to raise your first issue?
            </h3>
            <p className="font-body text-[14px] text-[#f5f3cd] mt-1">
              It takes less than a minute to file a complaint.
            </p>
          </div>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#f5f3cd] text-black font-semibold font-body text-[14px] whitespace-nowrap hover:-translate-y-0.5 transition-transform"
          >
            Get started <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}