'use client';

import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15 },
  }),
};

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing or using Complaint Kendra, you agree to be bound by these Terms and all applicable laws and regulations. If you do not agree, please do not use our services.`,
  },
  {
    title: '2. Use of Service',
    body: `You agree to use the platform only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the platform.`,
  },
  {
    title: '3. User Responsibilities',
    body: `You are responsible for ensuring that all information provided is accurate and truthful. Complaints with fraudulent or harmful intent may lead to account suspension or legal action.`,
  },
  {
    title: '4. Privacy Policy',
    body: `Your use of the platform is also governed by our Privacy Policy, which explains how we collect, use, and store your personal data.`,
  },
  {
    title: '5. Limitation of Liability',
    body: `Complaint Kendra is not liable for any indirect, incidental, or consequential damages arising from your use of the platform.`,
  },
  {
    title: '6. Changes to Terms',
    body: `We reserve the right to update or modify these terms at any time. Continued use of the service constitutes acceptance of those changes.`,
  },
];

export function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <motion.h1
        className="text-4xl font-bold mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Terms and Conditions
      </motion.h1>

      <div className="space-y-10">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{section.body}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <p className="text-sm text-muted-foreground">
          These terms are effective as of June 5, 2025.
        </p>
      </motion.div>
    </div>
  );
}

