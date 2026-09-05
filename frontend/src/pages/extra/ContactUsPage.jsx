import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#f3e8d2] px-6 md:px-12 pt-24 md:pt-32 pb-20">
      <div className="max-w-[1000px] mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-12">
        <div>
          <span className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase font-body text-black">
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
            Contact
          </span>
          <h1 className="font-display font-bold text-[30px] sm:text-[38px] md:text-[46px] leading-[1.1] mt-4 text-black">
            Get in touch
          </h1>
          <p className="font-body text-[15px] text-black mt-4 leading-relaxed">
            Questions, feedback, or a partnership idea for your municipality?
            We'd love to hear from you.
          </p>

          <div className="flex flex-col gap-4 mt-8">
            <a href="mailto:support@urbanvoice.app" className="flex items-center gap-3 font-body text-[14px] text-black hover:text-black/70 transition-colors">
              <Mail size={18} className="text-black shrink-0" />
              support@urbanvoice.app
            </a>
            <a href="tel:+911234567890" className="flex items-center gap-3 font-body text-[14px] text-black hover:text-black/70 transition-colors">
              <Phone size={18} className="text-black shrink-0" />
              +91 12345 67890
            </a>
            <div className="flex items-center gap-3 font-body text-[14px] text-black">
              <MapPin size={18} className="text-black shrink-0" />
              Nagpur, Maharashtra, India
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-ink-800 bg-[#122951] p-6 md:p-8">
          {sent ? (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <CheckCircle2 size={40} className="text-[#f5f3cd]" />
              <h3 className="font-display font-bold text-[18px] text-[#f5f3cd] mt-4">
                Message sent!
              </h3>
              <p className="font-body text-[14px] text-[#f5f3cd] mt-2">
                We'll get back to you within 1–2 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="font-body text-[13px] text-[#f5f3cd]">Name</label>
                <input
                  type="text" name="name" required value={form.name} onChange={handleChange}
                  className="w-full mt-1.5 px-4 py-3 rounded-xl bg-[#122951] border border-[#f5f3cd]/30 text-[#f5f3cd] font-body text-[14px] focus:outline-none focus:border-[#f5f3cd] transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-[13px] text-[#f5f3cd]">Email</label>
                <input
                  type="email" name="email" required value={form.email} onChange={handleChange}
                  className="w-full mt-1.5 px-4 py-3 rounded-xl bg-[#122951] border border-[#f5f3cd]/30 text-[#f5f3cd] font-body text-[14px] focus:outline-none focus:border-[#f5f3cd] transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-[13px] text-[#f5f3cd]">Message</label>
                <textarea
                  name="message" rows={5} required value={form.message} onChange={handleChange}
                  className="w-full mt-1.5 px-4 py-3 rounded-xl bg-[#122951] border border-[#f5f3cd]/30 text-[#f5f3cd] font-body text-[14px] resize-none focus:outline-none focus:border-[#f5f3cd] transition-colors"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 mt-2 px-6 py-3.5 rounded-xl bg-[#f5f3cd] text-black font-semibold font-body text-[14px] hover:-translate-y-0.5 transition-transform"
              >
                <Send size={16} /> Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}