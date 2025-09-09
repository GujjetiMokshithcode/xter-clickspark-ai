import React, { memo } from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 animate-fadeIn">
      <div className="max-w-4xl mx-auto bg-glass-bg border border-glass-border rounded-2xl p-8 md:p-12 text-brand-text">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-6">Privacy Policy</h1>
        <div className="space-y-6 text-brand-text leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <p>
            Welcome to ClickSpark AI ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we handle your information when you use our web application (the "Service").
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">1. Information We Collect</h2>
          <p>
            Our Service is designed with your privacy as a priority. We do not collect or store any personal information on our servers. All data processing and storage happens directly in your web browser.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Gemini API Key:</strong> If you choose to use your own Google Gemini API key, it is stored exclusively in your browser's local storage. Your API key is never transmitted to our servers or seen by us. It is used directly by your browser to communicate with the Google Gemini API.
            </li>
            <li>
              <strong>Generation History:</strong> The thumbnails you generate and their corresponding prompts are saved in your browser's local storage to provide you with a "History" feature. This data remains on your computer and is not uploaded to our servers.
            </li>
             <li>
              <strong>Usage Data:</strong> We do not use cookies or tracking technologies to collect information about your interaction with our service.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-white pt-4">2. How We Use Information</h2>
          <p>
            Since we do not collect personal information on our servers, we do not use it for any purpose. The data stored in your browser's local storage is used solely to provide the core functionality of the Service, such as:
          </p>
           <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Enabling unlimited thumbnail generation with your personal API key.</li>
            <li>Displaying your past creations in the history view.</li>
            <li>Tracking your remaining free credits.</li>
          </ul>


          <h2 className="text-2xl font-bold text-white pt-4">3. Third-Party Services</h2>
          <p>
            Our Service interacts with the Google Gemini API. When you generate a thumbnail, your prompt and API key are sent directly from your browser to Google's servers. We are not responsible for Google's privacy practices. We recommend you review the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">Google Privacy Policy</a> to understand how they handle your data.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">4. Data Security</h2>
          <p>
            We take reasonable measures to protect the integrity of our application. However, the security of the data stored in your browser's local storage (including your API key and history) is your responsibility. We recommend using a secure browser and keeping your system updated.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">5. Children's Privacy</h2>
          <p>
            Our Service is not intended for individuals under the age of 13. We do not knowingly collect personal information from children.
          </p>
          
          <h2 className="text-2xl font-bold text-white pt-4">6. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at contact@clickspark.ai (placeholder email).
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(PrivacyPolicy)