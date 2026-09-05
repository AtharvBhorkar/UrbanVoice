import {
  CheckCircle2, XCircle, Camera, MapPin, MessageSquareText,
} from 'lucide-react';

const DOS = [
  'Add clear photos or a short video showing the actual issue.',
  'Mention the exact location — landmark, street, or area name.',
  'Write a short, specific description (what, where, since when).',
  'Select the correct category so it reaches the right department.',
  'Follow up with additional evidence if the issue worsens.',
];

const DONTS = [
  "Don't file duplicate complaints for the same issue — upvote the existing one instead.",
  "Don't use the platform to report personal disputes unrelated to public issues.",
  "Don't upload unrelated, misleading, or offensive media.",
  "Don't exaggerate severity — accurate reporting keeps priority scoring fair for everyone.",
];

export default function ReportingGuidelinesPage() {
  return (
    <div className="min-h-screen bg-[#f3e8d2] px-6 md:px-12 pt-24 md:pt-32 pb-20">
      <div className="max-w-[900px] mx-auto">
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase font-body text-black">
          <MessageSquareText size={14} className="text-black" /> Guidelines
        </span>
        <h1 className="font-display font-bold text-[30px] sm:text-[38px] md:text-[46px] leading-[1.1] mt-4 text-black">
          How to file a complaint that actually gets resolved
        </h1>
        <p className="font-body text-[15px] text-black mt-4 max-w-2xl leading-relaxed">
          Good reports move faster. Here's what makes a complaint easy for a
          department to act on.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[#f5f3cd]/30 bg-[#122951] p-6 md:p-7">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={20} className="text-[#f5f3cd]" />
              <h3 className="font-display font-bold text-[17px] text-[#f5f3cd]">Do</h3>
            </div>
            <ul className="mt-5 flex flex-col gap-3.5">
              {DOS.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#f5f3cd] shrink-0" />
                  <p className="font-body text-[14px] text-[#f5f3cd] leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[#f5f3cd]/30 bg-[#122951] p-6 md:p-7">
            <div className="flex items-center gap-2.5">
              <XCircle size={20} className="text-[#f5f3cd]" />
              <h3 className="font-display font-bold text-[17px] text-[#f5f3cd]">Don't</h3>
            </div>
            <ul className="mt-5 flex flex-col gap-3.5">
              {DONTS.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#f5f3cd] shrink-0" />
                  <p className="font-body text-[14px] text-[#f5f3cd] leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-[#f5f3cd]/30 bg-[#122951] p-6 md:p-7 flex flex-col sm:flex-row gap-6">
          <div className="flex items-start gap-3">
            <Camera size={18} className="text-[#f5f3cd] shrink-0 mt-0.5" />
            <p className="font-body text-[13.5px] text-[#f5f3cd] leading-relaxed">
              <strong className="text-[#f5f3cd]">Good media matters:</strong> a
              clear, well-lit photo of the actual issue helps departments
              verify and prioritize faster.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-[#f5f3cd] shrink-0 mt-0.5" />
            <p className="font-body text-[13.5px] text-[#f5f3cd] leading-relaxed">
              <strong className="text-[#f5f3cd]">Location accuracy:</strong>{' '}
              vague locations are the #1 reason complaints get delayed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}