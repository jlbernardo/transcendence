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
              By accessing and using GIRL PONG, you accept and agree to be
              bound by the terms and provisions of this agreement. If you do not
              agree to these terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              2. Description of Service
            </h2>
            <p>
              GIRL PONG is a web-based multiplayer Pong game developed as an academic 
              project for the 42 School curriculum (Transcendence). The Service provides:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Real-time 1v1 multiplayer Pong matches</li>
              <li>User account registration and authentication</li>
              <li>Profile customization (username, bio, avatar)</li>
              <li>Friend system for social interactions</li>
              <li>Private game rooms with shareable room codes</li>
            </ul>
            <p className="mt-2">
              This is a non-commercial, educational project. No monetary transactions, 
              betting, or gambling features are offered.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              3. User Accounts
            </h2>
            <p>
              To access certain features of our Service, you must create an
              account. You are responsible for:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Providing accurate and truthful registration information</li>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
            <p className="mt-2">
              Your password is securely hashed and stored. We never have access to 
              your plain-text password.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              4. Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Use the Service for any unlawful purpose</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use cheats, exploits, bots, or automation software</li>
              <li>Impersonate other users or entities</li>
              <li>Upload inappropriate, offensive, or illegal content as your avatar or bio</li>
              <li>Attempt to manipulate game mechanics or exploit bugs</li>
              <li>Overload the Service through excessive requests or denial-of-service attacks</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              5. Game Rules and Fair Play
            </h2>
            <p>
              All users are expected to play fairly and respectfully. Game sessions 
              are temporary and game data (scores, match results) is not permanently 
              stored. Violations of fair play guidelines may result in penalties 
              including temporary or permanent account suspension.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              6. User Content
            </h2>
            <p>
              You are solely responsible for the content you upload to the Service, 
              including your profile bio and avatar image. By uploading content, you 
              confirm that:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>You own or have the right to use the content</li>
              <li>The content does not violate any laws or third-party rights</li>
              <li>The content is appropriate for all audiences</li>
            </ul>
            <p className="mt-2">
              Avatar images are limited to 2MB and will be automatically resized to 
              256x256 pixels.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              7. Intellectual Property
            </h2>
            <p>
              The Service, including its design, code, and features, is developed as 
              part of the 42 School curriculum. The original Pong game concept is in 
              the public domain.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              8. Service Availability
            </h2>
            <p>
              As an academic project, we do not guarantee continuous availability of 
              the Service. The Service may be modified, suspended, or discontinued at 
              any time without prior notice. We are not liable for any interruptions 
              or data loss.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              9. Limitation of Liability
            </h2>
            <p>
              The Service is provided &quot;as is&quot; without warranties of any kind. We shall 
              not be liable for any indirect, incidental, special, consequential, or 
              punitive damages resulting from your use of or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              10. Account Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your account at any time 
              for violations of these Terms of Service. You may also request deletion 
              of your account by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              11. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. We will
              notify users of any material changes by posting the new terms on
              this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">12. Contact Us</h2>
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
