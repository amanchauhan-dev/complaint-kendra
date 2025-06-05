'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function FAQSection() {
  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-extrabold text-center"
      >
        Frequently Asked Questions
      </motion.h1>

      {faqCategories.map((category, index) => (
        <motion.div
          key={category.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
        >
          <CategorySection title={category.title} color={category.color}>
            {category.items.map((item, i) => (
              <FAQItem key={i} question={item.q}>{item.a}</FAQItem>
            ))}
          </CategorySection>
        </motion.div>
      ))}
    </main>
  );
}

function CategorySection({ title, children }: { title: string; color: 'primary' | 'secondary' | 'accent' | 'warning' | 'muted' | 'destructive'; children: React.ReactNode }) {
  return (
    <Card className="shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Badge variant="outline" className={`capitalize`}>{title}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-2">
          {children}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function FAQItem({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <AccordionItem value={question}>
      <AccordionTrigger className="text-lg font-semibold">{question}</AccordionTrigger>
      <AccordionContent className="text-gray-700 dark:text-gray-300">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

const faqCategories: {
  title: string;
  color: 'primary' | 'secondary' | 'accent' | 'warning' | 'muted' | 'destructive';
  items: {
    q: string;
    a: string;
  }[]
}[] = [
    {
      title: "General",
      color: "secondary",
      items: [
        {
          q: "What is Complaint Kendra?",
          a: "Complaint Kendra is a centralized public grievance system that allows citizens to submit, track, and escalate complaints across various government departments and locations. It is available both on web and mobile apps."
        },
        {
          q: "Who can use this platform?",
          a: "Any citizen can file a complaint. Different levels of officers (Mamlatdar, SDM, Collector, Department Officer, etc.) can view and act on complaints based on their jurisdiction."
        }
      ]
    },
    {
      title: "Submitting Complaints",
      color: "primary",
      items: [
        {
          q: "How do I submit a complaint?",
          a: "Click on 'File a Complaint' on the dashboard. Fill in your details, select the relevant department, location, and provide all necessary information. You can also upload supporting documents."
        },
        {
          q: "Do I need to create an account to file a complaint?",
          a: "Yes. Creating an account helps track your complaint and receive updates."
        },
        {
          q: "Can I file complaints from the mobile app?",
          a: "Absolutely. The mobile app offers the same functionality as the web portal, optimized for smaller screens."
        }
      ]
    },
    {
      title: "Complaint Tracking",
      color: "accent",
      items: [
        {
          q: "How do I check the status of my complaint?",
          a: "Once logged in, go to 'My Complaints' to view status updates, responses, and resolution details."
        },
        {
          q: "Will I be notified when there's progress?",
          a: "Yes. You’ll receive notifications via email and/or SMS based on your contact preferences."
        }
      ]
    },
    {
      title: "Escalation Process",
      color: "warning",
      items: [
        {
          q: "What if my complaint isn't resolved in time?",
          a: "The system automatically escalates complaints to the higher authority (e.g., from Mamlatdar to SDM) based on set timeframes and roles."
        },
        {
          q: "Can I manually escalate my complaint?",
          a: "Manual escalation may not be necessary. However, you can request escalation through your complaint view if you're unsatisfied with the resolution."
        }
      ]
    },
    {
      title: "Roles & Responsibilities",
      color: "muted",
      items: [
        {
          q: "What roles exist in the system?",
          a: "The roles include Citizen, Mamlatdar Office, SDM Office, Collectorate, Department Officer, Admin, and Superadmin. Each has access to location-based complaints under their jurisdiction."
        },
        {
          q: "How are roles assigned?",
          a: "Roles are assigned by the system administrator during user creation or account verification."
        }
      ]
    },
    {
      title: "Technical Help",
      color: "destructive",
      items: [
        {
          q: "I'm facing issues using the platform. What should I do?",
          a: "Reach out to our technical support via the 'Support' section in the sidebar. You can also file a support ticket as a complaint."
        },
        {
          q: "Is my data safe?",
          a: "Yes. All your information is encrypted and securely stored. Only authorized roles can view complaints based on assigned access levels."
        },
        {
          q: "Can I delete my account?",
          a: "Account deletion requests can be made via support. Note that data may be retained for auditing and legal compliance."
        }
      ]
    }
  ];
