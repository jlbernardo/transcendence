import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen p-8 pb-20">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/home"
          className="text-gray-400 hover:text-gray-200 transition-colors mb-8 inline-block"
        >
          &larr; Back to Home
        </Link>

        <h1 className="text-4xl text-amber-100 mb-8">Terms of Service</h1>

        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using this service, you accept and agree to be
              bound by the terms and provisions of this agreement. If you do not
              agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              2. User Accounts
            </h2>
            <p>
              To access certain features of our service, you must create an
              account. You are responsible for:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              3. Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Use the service for any unlawful purpose</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use cheats, exploits, or automation software</li>
              <li>Impersonate other users or entities</li>
              <li>Share inappropriate or offensive content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              4. Game Rules and Fair Play
            </h2>
            <p>
              All users are expected to play fairly and respectfully. Violations
              of fair play guidelines may result in penalties including temporary
              or permanent account suspension.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              5. Intellectual Property
            </h2>
            <p>
              All content, features, and functionality of this service are owned
              by us and are protected by international copyright, trademark, and
              other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              6. Limitation of Liability
            </h2>
            <p>
              We shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use of or
              inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              7. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. We will
              notify users of any material changes by posting the new terms on
              this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us through our support channels.
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
