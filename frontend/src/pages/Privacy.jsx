import React from 'react';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4 text-gray-700">This is a placeholder privacy policy. Replace with your project's full privacy policy before publishing.</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
        <p className="text-gray-700">We collect profile information, location data (if provided), and content you upload or generate on the platform.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">How We Use Data</h2>
        <p className="text-gray-700">Data is used to match users, provide services, and improve the platform. We do not sell personal data to third parties.</p>
      </section>

      <p className="text-gray-600 text-sm">Last updated: November 26, 2025</p>
    </div>
  );
};

export default Privacy;
