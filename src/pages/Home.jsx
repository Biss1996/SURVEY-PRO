import React from "react";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-indigo-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            Start Earning with Survey Pro
          </h1>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Join 50,000+ users earning real money daily
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Start Earning Now
            </a>
            <a
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-white shadow-sm"
            >
              Already a Member? Login
            </a>
          </div>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600">
            <li className="inline-flex items-center gap-2"><Check /> Free to join</li>
            <li className="inline-flex items-center gap-2"><Check /> Instant payouts</li>
            <li className="inline-flex items-center gap-2"><Check /> No experience needed</li>
          </ul>

          <dl className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Stat value="50K+" label="Active Users" />
            <Stat value="$2M+" label="Total Payouts" />
            <Stat
              value={
                <span>
                  4.9<span className="text-yellow-400">★</span>
                </span>
              }
              label="User Rating"
            />
          </dl>
        </div>
      </section>

      {/* Why Choose */}
      <section id="features" className="py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-indigo-600 text-2xl sm:text-3xl font-extrabold tracking-tight">
            Why Choose Survey Pro?
          </h2>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <Feature icon={<Dollar />} title={<span className="text-green-600">High Paying Surveys</span>} desc="Earn Kes 50 – Kes 100 per survey, among the best rates in the industry." />
  <Feature icon={<Users />} title={<span className="text-green-600">Referral Commission</span>} desc="Earn lifetime commissions from your referrals." />
  <Feature icon={<Zap />} title={<span className="text-green-600">Instant Payouts</span>} desc="Get paid to M-Pesa within 24 hours—no waiting." />
  <Feature icon={<NoThreshold />} title={<span className="text-green-600">No Minimum Threshold</span>} desc="Withdraw any amount, anytime." />
  <Feature icon={<Shield />} title={<span className="text-green-600">100% Legitimate</span>} desc="Trusted by 50,000+ users worldwide." />
  <Feature icon={<Star />} title={<span className="text-green-600">4.9★ Rating</span>} desc="Rated excellent by our community." />
</div>

        </div>
      </section>

      {/* Success Stories */}
      <section id="stories" className="relative py-16 sm:py-20">
        {/* soft gradient glow */}
        <div
          className="pointer-events-none absolute inset-x-0 -top-12 h-40 -z-10 bg-gradient-to-r from-indigo-100/70 via-fuchsia-100/60 to-sky-100/70 blur-2xl"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
              Real people. Real payouts.
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Success Stories
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              What members in Kenya say about Survey Pro.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="group relative overflow-hidden rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-sky-500" />
              <div className="mb-3 flex items-center gap-1 text-yellow-400" aria-hidden="true">
                <span>★</span><span>★</span><span>★</span><span>★</span><span className="opacity-70">★</span>
                <span className="ml-2 text-xs font-semibold text-slate-500">4.9/5</span>
              </div>
              <Testimonial
                name="Sarah Mwanza"
                nameClassName="text-green-600"
                amount="Kes 2,000"
                quote="Survey Pro changed my life! I earn 2000+ shillings weekly doing easy surveys."
              />
            </div>

            {/* Card 2 */}
            <div className="group relative overflow-hidden rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-sky-500" />
              <div className="mb-3 flex items-center gap-1 text-yellow-400" aria-hidden="true">
                <span>★</span><span>★</span><span>★</span><span>★</span><span className="opacity-70">★</span>
                <span className="ml-2 text-xs font-semibold text-slate-500">4.8/5</span>
              </div>
              <Testimonial
                name="John Kinyua"
                nameClassName="text-green-600"

                amount="Kes 4,500"
                quote="I'm so glad I found this. The extra income has helped me pay my bills!"
              />
            </div>

            {/* Card 3 */}
            <div className="group relative overflow-hidden rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-sky-500" />
              <div className="mb-3 flex items-center gap-1 text-yellow-400" aria-hidden="true">
                <span>★</span><span>★</span><span>★</span><span>★</span><span className="opacity-70">★</span>
                <span className="ml-2 text-xs font-semibold text-slate-500">4.9/5</span>
              </div>
              <Testimonial
                name="Maria Lemayan"
                nameClassName="text-green-600"
                amount="Kes 3,000"
                quote="As a student, this is perfect. I work whenever I want and get paid instantly!"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl text-indigo-600 font-extrabold tracking-tight">Ready to Start Earning?</h2>
          <a
            href="/register"
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-white font-semibold shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Join Now — It's Free!
          </a>
        </div>
      </section>
    </>
  );
}

/* ——— Small UI building blocks ——— */
function Stat({ value, label }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6 text-center">
      <dt className="text-3xl font-extrabold text-slate-900">{value}</dt>
      <dd className="mt-1 text-sm text-slate-600">{label}</dd>
    </div>
  );
}
function Feature({ icon, title, desc }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 grid place-items-center rounded-xl bg-indigo-600 text-white">
          {icon}
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-slate-600">{desc}</p>
    </div>
  );
}

function Testimonial({ name, amount, quote, nameClassName = "text-slate-900" }) {
  const full = String(name ?? "");
  const parts = full.trim().split(/\s+/);
  const initials =
    (parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "");

  return (
    <figure>
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 rounded-full bg-indigo-600/90 text-white grid place-items-center font-semibold">
          {initials}
        </span>
        <figcaption>
          <p className={`font-semibold text-green-400 leading-tight ${nameClassName}`}>{full}</p>
          {amount && <p className="text-sm text-slate-600">Earned: {amount}</p>}
        </figcaption>
      </div>
      <blockquote className="mt-3 text-sm text-slate-700">“{quote}”</blockquote>
    </figure>
  );
}

/* ——— Tiny inline icons ——— */
function Check() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="h-4 w-4 text-emerald-600">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}
function Dollar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M12 1v22M17 5c0-1.657-2.239-3-5-3S7 3.343 7 5s2.239 3 5 3 5 1.343 5 3-2.239 3-5 3-5 1.343-5 3 2.239 3 5 3 5-1.343 5-3"/>
    </svg>
  );
}
function Users() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 7a4 4 0 010 8"/>
    </svg>
  );
}
function Zap() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
    </svg>
  );
}
function NoThreshold() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <circle cx="12" cy="12" r="9"/>
      <path d="M8 12h8"/>
    </svg>
  );
}
function Shield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  );
}
function Star() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/>
    </svg>
  );
}
