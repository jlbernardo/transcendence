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
              Welcome to the GIRL PONG Privacy Policy. This document explains how we
              collect, use, store, and protect your personal information when you use
              our multiplayer Pong game service. GIRL PONG is an academic project 
              developed for the 42 School curriculum (Transcendence).
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              2. Information We Collect
            </h2>
            <p>We collect the following types of information:</p>
            
            <h3 className="text-lg text-amber-100 mt-4 mb-2">Account Information (Required)</h3>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Email address - used as your unique identifier and for login</li>
              <li>Username - your display name visible to other players</li>
              <li>Password - securely hashed using PBKDF2 algorithm (we never store or see your plain-text password)</li>
            </ul>

            <h3 className="text-lg text-amber-100 mt-4 mb-2">Profile Information (Optional)</h3>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Bio - a short description about yourself (up to 300 characters)</li>
              <li>Avatar image - your profile picture (PNG format, max 2MB, resized to 256x256 pixels)</li>
            </ul>

            <h3 className="text-lg text-amber-100 mt-4 mb-2">Social Information</h3>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Friend relationships and friend requests</li>
              <li>Online status (whether you are currently active)</li>
            </ul>

            <h3 className="text-lg text-amber-100 mt-4 mb-2">What We Do NOT Collect</h3>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Game history or match results (game data is ephemeral and not stored)</li>
              <li>Chat messages (no chat feature exists)</li>
              <li>Payment information (this is a free, non-commercial service)</li>
              <li>Location data</li>
              <li>Device fingerprints or tracking identifiers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">
              3. How We Use Your Information
            </h2>
            <p>Your information is used to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Create and manage your user account</li>
              <li>Authenticate you when you log in</li>
              <li>Display your profile to other players</li>
              <li>Enable the friend system functionality</li>
              <li>Show your online status to friends</li>
              <li>Facilitate multiplayer game sessions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">4. Data Storage</h2>
            <p>Your data is stored in the following ways:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li><strong>Server-side:</strong> Account and profile data is stored in a SQLite database on our server</li>
              <li><strong>Client-side:</strong> Your session data (user ID, username, authentication token) is stored in your browser&apos;s localStorage to keep you logged in</li>
              <li><strong>Avatar images:</strong> Stored on the server file system</li>
            </ul>
            <p className="mt-2">
              Game session data (paddle positions, ball position, scores) exists only in memory 
              during active gameplay and is not permanently stored.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">5. Cookies and Tracking</h2>
            <p>
              We do <strong>not</strong> use cookies for tracking, analytics, or advertising purposes. 
              We use token-based authentication stored in localStorage instead of session cookies.
            </p>
            <p className="mt-2">
              We do <strong>not</strong> use any third-party analytics services (such as Google Analytics), 
              advertising networks, or social media tracking pixels.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">6. Third-Party Services</h2>
            <p>
              We do not share your personal data with any third parties for marketing, 
              advertising, or data brokerage purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">7. Real-Time Communication</h2>
            <p>
              The game uses WebSocket connections for real-time multiplayer gameplay. 
              Data transmitted through WebSocket includes only game state information 
              (paddle positions, ball position, scores, ready status) and does not 
              include any personally identifiable information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">8. Data Protection</h2>
            <p>
              We implement the following security measures to protect your information:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Passwords are hashed using Django&apos;s PBKDF2 algorithm with a secure salt</li>
              <li>Token-based API authentication</li>
              <li>Rate limiting to prevent abuse (100 requests/day for anonymous users, 1000 requests/day for authenticated users)</li>
              <li>File upload restrictions (2MB limit, automatic image resizing)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">9. Data Retention</h2>
            <p>
              Your account data is retained for as long as your account exists. 
              Authentication tokens are invalidated upon logout. Game session data 
              is not retained after a match ends.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">10. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li><strong>Access</strong> your personal data through your profile page</li>
              <li><strong>Correct</strong> your information by updating your profile</li>
              <li><strong>Delete</strong> your avatar image through profile settings</li>
              <li><strong>Request deletion</strong> of your entire account by contacting us</li>
              <li><strong>Log out</strong> at any time, which invalidates your authentication token</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">11. Children&apos;s Privacy</h2>
            <p>
              This Service is not directed at children under 13. We do not knowingly 
              collect personal information from children under 13. If you believe we 
              have collected information from a child under 13, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will 
              be posted on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-amber-200 mb-3">13. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or wish to exercise 
              your data rights, please contact us through our support channels.
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
