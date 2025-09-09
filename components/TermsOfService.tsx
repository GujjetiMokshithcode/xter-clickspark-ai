import React, { memo } from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 animate-fadeIn">
      <div className="max-w-4xl mx-auto bg-glass-bg border border-glass-border rounded-2xl p-8 md:p-12 text-brand-text">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-6">Terms of Service</h1>
        <div className="space-y-6 text-brand-text leading-relaxed">
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-2xl font-bold text-white pt-4">1. Acceptance of Terms</h2>
            <p>
                By accessing or using ClickSpark AI (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.
            </p>

            <h2 className="text-2xl font-bold text-white pt-4">2. Description of Service</h2>
            <p>
                ClickSpark AI provides users with a tool to generate YouTube thumbnails using Google's latest generation of AI models (including the Gemini and Imagen families) via the Gemini API. The Service offers a limited number of free generations. To continue using the service beyond the free limit, users must provide their own Google Gemini API key.
            </p>

            <h2 className="text-2xl font-bold text-white pt-4">3. User Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2 pl-4">
                <li>
                    <strong>API Key:</strong> You are solely responsible for obtaining and securing your own Google Gemini API key. All API calls made with your key are subject to Google's terms and billing policies. We are not responsible for any charges you incur from Google.
                </li>
                <li>
                    <strong>Content:</strong> You are responsible for the prompts you submit and the content you generate. You agree not to use the Service to create any content that is unlawful, harmful, defamatory, obscene, or otherwise objectionable.
                </li>
                 <li>
                    <strong>Compliance:</strong> You agree to use the Service in compliance with all applicable laws and regulations, as well as the terms of service of Google Gemini.
                </li>
            </ul>

            <h2 className="text-2xl font-bold text-white pt-4">4. Intellectual Property</h2>
            <p>
                You retain all rights to the thumbnails you generate using the Service. We claim no ownership over your generated content. Our Service, including its original content, features, and functionality, are and will remain the exclusive property of ClickSpark AI and its licensors.
            </p>

            <h2 className="text-2xl font-bold text-white pt-4">5. Disclaimer of Warranties</h2>
            <p>
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, express or implied, regarding the operation or availability of the Service, or the accuracy, reliability, or content of any information or generated images.
            </p>

            <h2 className="text-2xl font-bold text-white pt-4">6. Limitation of Liability</h2>
            <p>
                In no event shall ClickSpark AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>

             <h2 className="text-2xl font-bold text-white pt-4">7. Termination</h2>
            <p>
                We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>

            <h2 className="text-2xl font-bold text-white pt-4">8. Changes to Terms</h2>
            <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
            </p>

            <h2 className="text-2xl font-bold text-white pt-4">9. Contact Us</h2>
            <p>
                If you have any questions about these Terms, please contact us at contact@clickspark.ai (placeholder email).
            </p>
        </div>
      </div>
    </div>
  );
};

export default memo(TermsOfService);