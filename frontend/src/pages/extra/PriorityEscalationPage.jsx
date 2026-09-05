import {
  Scale, TrendingUp, Users, Clock, RefreshCcw, AlertTriangle,
} from 'lucide-react';

const FACTORS = [
  {
    icon: Scale,
    title: 'Category weight',
    desc: 'Each department carries a base weight (e.g. Water & Electricity = 5, Sanitation & Roads = 4) contributing 10 points per weight unit to the score.',
  },
  {
    icon: TrendingUp,
    title: 'Community upvotes',
    desc: 'Every upvote a complaint receives adds 2 points — issues the community cares about naturally rise up.',
  },
  {
    icon: Clock,
    title: 'Time pending',
    desc: 'Score increases by 1.5 points for every day the complaint stays unresolved, so old, forgotten issues don\'t stay buried.',
  },
  {
    icon: RefreshCcw,
    title: 'Repeat reports',
    desc: 'If the same issue is reported multiple times in the same area, a bonus of up to 25 points is added — repetition signals real urgency.',
  },
];

const TIERS = [
  { label: 'Critical', color: 'text-red-400', bg: 'bg-red-400/10', desc: 'Immediate attention — flagged to department heads.' },
  { label: 'High', color: 'text-amber-400', bg: 'bg-amber-400/10', desc: 'Should be actioned within a few days.' },
  { label: 'Medium', color: 'text-[#f5f3cd]', bg: 'bg-[#f5f3cd]/10', desc: 'Queued for regular resolution cycles.' },
  { label: 'Low', color: 'text-[#f5f3cd]', bg: 'bg-[#f5f3cd]/10', desc: 'Minor issues handled as capacity allows.' },
];

export default function PriorityEscalationPage() {
  return (
    <div className="min-h-screen bg-[#f3e8d2] px-6 md:px-12 pt-24 md:pt-32 pb-20">
      <div className="max-w-[900px] mx-auto">
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase font-body text-black">
          <AlertTriangle size={14} className="text-black" /> Priority & Escalation
        </span>
        <h1 className="font-display font-bold text-[30px] sm:text-[38px] md:text-[46px] leading-[1.1] mt-4 text-black">
          How we decide what gets fixed first
        </h1>
        <p className="font-body text-[15px] text-black mt-4 max-w-2xl leading-relaxed">
          Every complaint gets a priority score, calculated automatically from
          four factors — so decisions stay objective, not political.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          {FACTORS.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-2xl border border-[#f5f3cd]/30 bg-[#122951] p-6">
                <span className="w-11 h-11 rounded-xl bg-[#f5f3cd]/10 text-[#f5f3cd] flex items-center justify-center">
                  <Icon size={20} />
                </span>
                <h3 className="font-display font-bold text-[16px] text-[#f5f3cd] mt-4">
                  {f.title}
                </h3>
                <p className="font-body text-[13.5px] text-[#f5f3cd] mt-2 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-14">
          <h2 className="font-display font-bold text-[22px] text-black">
            Escalation tiers
          </h2>
          <p className="font-body text-[14px] text-black mt-2">
            Based on the final score, complaints are grouped into these bands:
          </p>
          <div className="mt-6 flex flex-col gap-3">
            {TIERS.map((tier) => (
              <div
                key={tier.label}
                className="flex items-center gap-4 rounded-xl border border-[#f5f3cd]/30 bg-[#122951] p-4"
              >
                <span className={`px-3 py-1.5 rounded-full ${tier.bg} ${tier.color} font-semibold font-body text-[13px] shrink-0`}>
                  {tier.label}
                </span>
                <p className="font-body text-[13.5px] text-[#f5f3cd]">
                  {tier.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}