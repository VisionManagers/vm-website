
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-40 pb-20 px-6 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif text-vmNavy mb-12">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
          <p className="text-xl font-light italic">Last Updated: October 2024</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-vmNavy">1. Commitment to High-Trust Data Handling</h2>
            <p>
              Vision Managers LLC ("VM", "we", "us", or "our") is built upon a foundation of operational trust. We understand that our clients in Dentists, Optometrists, Specialty Contractors, and Portfolio Management sectors handle highly sensitive data. Our privacy posture is designed to exceed standard industry compliance.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-vmNavy">2. Information Collection</h2>
            <p>
              We collect information only as necessary to provide our high-trust Operational AI services. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Strategic Assessment Data provided during consultation.</li>
              <li>Professional contact information for operational sync.</li>
              <li>Technical logs necessary for the safeguarding of autonomous systems.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-vmNavy">3. Zero-Sharing Posture</h2>
            <p>
              Vision Managers maintains a zero-sharing policy. We do not sell, lease, or distribute your operational data to third-party advertisers or data brokers. All model training data is siloed and encrypted.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-vmNavy">4. Data Security & Encryption</h2>
            <p>
              Our systems utilize end-to-end encryption for all data at rest and in transit. Our infrastructure is designed to prevent "model drift" and unauthorized data leakage between enterprise clients.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-vmNavy">5. Contact Information</h2>
            <p>
              For inquiries regarding our privacy standards or to request a detailed security audit brief, please contact our Safeguard Officer at advisor@visionmanagers.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
