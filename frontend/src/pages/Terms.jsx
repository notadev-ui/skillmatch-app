import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4 text-gray-700">
        Welcome to SkillMatch. By using our service you agree to the following terms and conditions. This
        placeholder page includes basic terms for demonstration purposes. Replace with your project's
        full legal terms before publishing.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Acceptance</h2>
        <p className="text-gray-700">You must be at least 13 years old to use the service. By registering you accept these terms.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Account Responsibility</h2>
        <p className="text-gray-700">Keep your account credentials safe. You are responsible for activity performed under your account.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Content & Conduct</h2>
        <p className="text-gray-700">Users must not post illegal, abusive or infringing content. Reviews and messages should follow community guidelines.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Liability</h2>
        <p className="text-gray-700">SkillMatch provides a platform to connect users. We are not liable for interactions between users or third-party venues.</p>
      </section>

      <p className="text-gray-600 text-sm">Last updated: November 26, 2025</p>
    </div>
  );
};

export default Terms;
