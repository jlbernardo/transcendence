import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen p-8 pb-20">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/home"
          className="text-gray-400 hover:text-gray-200 transition-colors mb-8 inline-block"
        >
          &larr; Back to Home
        </Link>

        <h1 className="text-4xl text-amber-100 mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl text-amber-200 mb-3">1. Introduction</h2>
            <p>
              Welcome to our Privacy Policy. This document explains how we
              collect, use, and protect your personal information when you use
              our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              2. Information We Collect
            </h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Account information (username, email address)</li>
              <li>Game statistics and activity data</li>
              <li>Communication data (chat messages, friend requests)</li>
              <li>Technical data (IP address, browser type, device information)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              3. How We Use Your Information
            </h2>
            <p>Your information is used to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Provide and maintain our services</li>
              <li>Improve user experience</li>
              <li>Enable social features like friends and chat</li>
              <li>Track game statistics and leaderboards</li>
              <li>Ensure platform security and prevent abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">4. Data Protection</h2>
            <p>
              We implement appropriate security measures to protect your personal
              information against unauthorized access, alteration, disclosure, or
              destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact
              us through our support channels.
            </p>
          </section>

          <section className="pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-500">
              Last updated: January 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
