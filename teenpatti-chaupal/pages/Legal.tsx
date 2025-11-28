import React from 'react';

const LegalLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white min-h-screen py-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-200">{title}</h1>
      <div className="prose prose-slate max-w-none text-slate-600">
        {children}
      </div>
    </div>
  </div>
);

export const Disclaimer: React.FC = () => (
  <LegalLayout title="Disclaimer">
    <div className="space-y-6">
      <p><strong>Social Gaming Only:</strong> Chaupal App is strictly a social gaming platform intended for entertainment purposes only.</p>
      <p><strong>No Real Money:</strong> There is no opportunity to win real money or real-world prizes. The virtual currency (Chips/Coins) used in the games has no monetary value and cannot be exchanged for cash.</p>
      <p><strong>Age Restriction:</strong> All games on Chaupal App are intended for an adult audience (18+).</p>
      <p><strong>Practice:</strong> Success at social casino gaming does not imply future success at real money gambling.</p>
    </div>
  </LegalLayout>
);

export const PrivacyPolicy: React.FC = () => (
  <LegalLayout title="Privacy Policy">
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Privacy Policy</h2>
        <p>
          This Privacy Policy describes how <span className="font-semibold text-primary">Chaupal App</span> we collect, uses, stores and protects user information when you access our mobile game and website. By using our platform, you agree to this Privacy Policy.
        </p>
      </div>

      {/* Information We Collect */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Information We Collect</h3>
        <p>We may collect certain information to improve gameplay experience and provide secure access:</p>
        <div className="mt-5 space-y-3">
          <div>
            <h4 className="font-semibold text-slate-800">Personal Information</h4>
            <ul className="list-disc ml-6 text-slate-600 space-y-2">
              <li>Name or Username</li>
              <li>Mobile Number <span className="text-xs text-slate-500">(OTP login authentication)</span></li>
              <li>Email <span className="text-xs text-slate-500">(optional)</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">Gameplay &amp; Platform Usage Data</h4>
            <ul className="list-disc ml-6 text-slate-600 space-y-2">
              <li>Game statistics such as matches played, wins, losses, leaderboard details, virtual chips usage and player progress</li>
              <li>In-app activity such as buttons clicked, screens visited and play duration</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">Device &amp; Technical Information</h4>
            <ul className="list-disc ml-6 text-slate-600 space-y-2">
              <li>Device model, OS version &amp; hardware information</li>
              <li>IP address and approximate location <span className="text-xs text-slate-500">(city level)</span></li>
              <li>Crash logs, performance data and diagnostics</li>
            </ul>
          </div>
          <p className="mt-2 font-medium text-amber-700 bg-amber-50 p-3 rounded-xl border-l-4 border-amber-400">
            No financial, banking or identity documents are requested or stored as this is a virtual chips-based platform.
          </p>
        </div>
      </div>

      {/* How We Use the Information */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">How We Use the Information</h3>
        <ul className="list-disc ml-6 text-slate-600 space-y-2">
          <li>Enable secure account login</li>
          <li>Improve gameplay quality, fairness &amp; matchmaking</li>
          <li>Manage user profile, progress &amp; virtual chips</li>
          <li>Provide customer support and send updates/notifications</li>
          <li>Protect platform from misuse, cheating, hacking or bot-based gameplay</li>
          <li>Analyze usage trends and optimize experience</li>
        </ul>
      </div>

      {/* Data Sharing */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Data Sharing</h3>
        <p>We do not sell, rent or trade personal information with third parties.</p>
        <p>Data may only be shared with:</p>
        <ul className="list-disc ml-6 text-slate-600 space-y-2">
          <li>Server, analytics or hosting providers used for performance improvement</li>
          <li>Security partners for fraud prevention</li>
          <li>Legal authorities if required for misuse, cyber complaint or system safety</li>
        </ul>
      </div>

      {/* Data Security */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Data Security</h3>
        <ul className="list-disc ml-6 text-slate-600 space-y-2">
          <li>Encrypted communication</li>
          <li>Secure data storage</li>
          <li>Access restrictions &amp; monitoring protections</li>
        </ul>
        <p className="mt-2 text-slate-600">
          While we strive to keep information secure, no digital platform can guarantee absolute protection.
        </p>
      </div>

      {/* Age Eligibility */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Age Eligibility</h3>
        <p>
          The platform is designed only for users <strong>18+</strong> years. Players below the minimum age should not register or use the app. Accounts suspected of being created by minors may be restricted.
        </p>
      </div>

      {/* User Rights */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">User Rights</h3>
        <p>Users may request:</p>
        <ul className="list-disc ml-6 text-slate-600 space-y-2">
          <li>Account deletion</li>
          <li>Profile update</li>
          <li>Notification opt-out</li>
          <li>To stop using services anytime by uninstalling the app</li>
        </ul>
        <p>
          Requests can be made at: <span className="font-medium text-primary">support@chaupalapp.com</span>
        </p>
      </div>

      {/* Policy Updates */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Policy Updates</h3>
        <p>
          We may update this Privacy Policy periodically. Updates will be posted within the app or on the website.
        </p>
      </div>
    </div>
  </LegalLayout>
);

export const TermsConditions: React.FC = () => (
  <LegalLayout title="Terms & Conditions">
    <div className="space-y-10">

      <div>
        <p className="text-base text-slate-600 mb-4">
          By accessing our gaming service, you agree to the following Terms and Conditions.
        </p>
      </div>

      {/* Use of Service */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Use of Service</h3>
        <ul className="list-disc ml-6 text-slate-600 space-y-3">
          <li>
            The platform provides skill/casual games purely for entertainment using virtual chips that have no real-world monetary value.
          </li>
          <li>
            Virtual chips cannot be exchanged, transferred, withdrawn, redeemed or converted into real currency.
          </li>
        </ul>
      </div>

      {/* User Responsibility */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">User Responsibility</h3>
        <ul className="list-disc ml-6 text-slate-600 space-y-3">
          <li>OTP login must be secured by the user.</li>
          <li>Fake accounts, abusive behavior or cheating is not allowed.</li>
          <li>
            Attempts to manipulate gameplay, hack systems or use unauthorized tools may result in account suspension.
          </li>
        </ul>
      </div>

      {/* Fair Play */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Fair Play</h3>
        <ul className="list-disc ml-6 text-slate-600 space-y-3">
          <li>We use automated systems to ensure fairness and prevent cheating.</li>
          <li>
            The company may use system agents/bots to fill empty seats for smoother gameplay experience.
          </li>
        </ul>
      </div>

      {/* Virtual Chips */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Virtual Chips</h3>
        <ul className="list-disc ml-6 text-slate-600 space-y-3">
          <li>Virtual chips serve only for in-game participation and progression.</li>
          <li>
            Loss of chips due to connection problems or device failure cannot be compensated.
          </li>
        </ul>
      </div>

      {/* Limitation of Liability */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Limitation of Liability</h3>
        <p className="text-slate-600">We are not responsible for:</p>
        <ul className="list-disc ml-6 text-slate-600 space-y-3">
          <li>Network interruptions, lag or device malfunction</li>
          <li>Losses of virtual chips or game progress</li>
        </ul>
      </div>

      {/* Account Suspension */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Account Suspension</h3>
        <p className="text-slate-600">
          We may restrict or terminate accounts violating policies or harming user experience.
        </p>
      </div>

      {/* Governing Law */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Governing Law</h3>
        <p className="text-slate-600">
          These terms are governed by the laws of India.
        </p>
      </div>

      {/* Responsible Gaming */}
      <div className="rounded-2xl bg-purple-50 border-l-8 border-primary p-6 mt-8">
        <div className="flex items-center gap-2 mb-2">
          <span role="img" aria-label="controller" className="text-2xl">🎮</span>
          <span className="text-lg font-bold text-primary">Responsible Gaming</span>
        </div>
        <p className="mb-4 text-slate-700 font-medium">
          We encourage healthy and balanced gameplay. Gaming should be fun and not excessive.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Play Smart */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Play Smart</h4>
            <ul className="list-disc ml-5 text-slate-700 space-y-2">
              <li>Take regular breaks</li>
              <li>Maintain a balance between gaming and daily life</li>
              <li>Track your playtime and limit session hours</li>
            </ul>
          </div>
          {/* Avoid */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Avoid</h4>
            <ul className="list-disc ml-5 text-slate-700 space-y-2">
              <li>Playing when stressed or emotionally upset</li>
              <li>Excessive time investment affecting work or relationships</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </LegalLayout>
);