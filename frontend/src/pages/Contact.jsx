import React from 'react';

const Contact = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-4 text-gray-700">For support, partnerships or press, reach out to us at <a href="mailto:hello@skillmatch.example" className="text-blue-600">hello@skillmatch.example</a>.</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">General Inquiries</h2>
        <p className="text-gray-700">Use the email above for general inquiries. For sensitive issues, include details and we'll respond within 2 business days.</p>
      </div>

      <p className="text-gray-600 text-sm mt-6">Last updated: November 26, 2025</p>
    </div>
  );
};

export default Contact;
