import {
  Droplet, Zap, Trash2, Construction, Building2, Home, HelpCircle,
} from 'lucide-react';

const DEPARTMENTS = [
  { name: 'Water', icon: Droplet, weight: 5, desc: 'Leakages, supply disruption, contamination, drainage issues.' },
  { name: 'Electricity', icon: Zap, weight: 5, desc: 'Outages, exposed wiring, faulty streetlights, transformer issues.' },
  { name: 'Sanitation', icon: Trash2, weight: 4, desc: 'Garbage collection, overflowing bins, public toilets, cleanliness.' },
  { name: 'Roads', icon: Construction, weight: 4, desc: 'Potholes, broken footpaths, damaged signage, encroachments.' },
  { name: 'Civic', icon: Building2, weight: 3, desc: 'Parks, public property damage, illegal construction, noise.' },
  { name: 'Society', icon: Home, weight: 2, desc: 'Society-level maintenance, common area disputes, security.' },
  { name: 'Other / General', icon: HelpCircle, weight: 1, desc: "Anything that doesn't fit the categories above." },
];

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen bg-[#f3e8d2] px-6 md:px-12 pt-24 md:pt-32 pb-20">
      <div className="max-w-[1100px] mx-auto">
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase font-body text-black">
          <span className="w-1.5 h-1.5 rounded-full bg-black" />
          Departments
        </span>
        <h1 className="font-display font-bold text-[32px] sm:text-[40px] md:text-[52px] leading-[1.1] mt-4 text-black">
          Who handles what
        </h1>
        <p className="font-body text-[15px] md:text-[17px] text-black mt-4 max-w-2xl leading-relaxed">
          Every complaint is auto-routed to one of these departments based on
          its category. Higher-weight categories get a priority boost.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEPARTMENTS.map((dept) => {
            const Icon = dept.icon;
            return (
              <div
                key={dept.name}
                className="rounded-2xl border border-[#f5f3cd]/30 bg-[#122951] p-6 hover:border-[#f5f3cd] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="w-11 h-11 rounded-xl bg-[#f5f3cd]/10 text-[#f5f3cd] flex items-center justify-center">
                    <Icon size={20} />
                  </span>
                  <span className="font-body text-[11px] font-semibold uppercase tracking-wide text-[#f5f3cd]/70">
                    Weight {dept.weight}
                  </span>
                </div>
                <h3 className="font-display font-bold text-[18px] text-[#f5f3cd] mt-4">
                  {dept.name}
                </h3>
                <p className="font-body text-[13.5px] text-[#f5f3cd] mt-2 leading-relaxed">
                  {dept.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}