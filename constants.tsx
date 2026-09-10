
import React from 'react';

export const IMAGES = {
  SKYLINE: "https://storage.googleapis.com/vm-website/web%20images/bridging_gaps.jpg",
  LOGO: "https://storage.googleapis.com/vm-website/web%20images/vm-logo%402x.png",
  LOGO_CIRCLE: "https://storage.googleapis.com/vm-website/web%20images/VM%20logo.png"
};

export const COLORS = {
  NAVY: '#0B4C83',
  TEAL: '#00E5D1',
  WHITE: '#FFFFFF',
  SLATE: '#F8FAFC'
};

export const BOOKING_URLS = {
  DISCOVERY: "https://api.leadconnectorhq.com/widget/booking/u9ITLagwSXqANxwjhaAS",
  STRATEGY_CALL: "https://api.leadconnectorhq.com/widget/booking/Rblry3wONPt5B5yvAy0u",
  // Clean public booking link — /book redirects straight to the discovery-call scheduler
  BOOK: "https://visionmanagers.com/book",
};

export const SOLUTIONS = [
  {
    title: "AI Guardrails",
    who: "Clinics & Healthcare Practices",
    replaces: "Missed calls, manual follow-ups, and fragmented booking",
    includes: ["24/7 Voice Reception", "Auto-Reschedule Engine", "Insurance Verification"],
    timeline: "14-Day Install",
    description: "Start small with a pilot, then scale safely. We automate the friction so your staff can focus on the patient."
  },
  {
    title: "Strategic Decision Layer",
    who: "Multi-Location Practices",
    replaces: "Organization-wide labor bottlenecks and reporting lag",
    includes: ["Synthesis Engine", "Predictive Guardrails", "Safety Standards Monitoring"],
    timeline: "90-Day Deployment",
    description: "Deploy autonomous agents that adhere to your specific standards while improving response speed across all locations."
  }
];

/* Testimonials.
   `sourceUrl` / `sourceLabel` are optional but strongly preferred: NN/g's
   research finds visitors discount on-site proof by default ("the website
   would of course include only positive reviews") and trust the same words
   more when they can be verified somewhere the business doesn't control.
   A quote a reader can click through to is worth several they can't.

   ⚠️ Two of these three sell voice specifically, which now under-sells the
   range (positioning revised 2026-09-10: lead with the leak, voice is a
   shown capability). Replace as permissioned proof lands — see
   80-Content/proof-library.md; only David Vudragovich is GRANTED today. */
export const TESTIMONIALS = [
  {
    name: "Dr. Kymm Nelsen",
    title: "Ascend Leadership Partners",
    quote: "Suk designs next-level AI voice receptionists who can help you book appointments after hours so that you never miss an opportunity to get a new patient. His thoughtful approach to design and his heart-centered values make him the perfect person to hire if you're tired of missing opportunities because your office is closed for the day.",
    sourceUrl: "",
    sourceLabel: "Alignable",
  },
  {
    name: "Melissa ONeal, OTR/L",
    title: "Healthcare Professional",
    quote: "Sukhneet offers voice solutions to healthcare professionals using AI that is HIPAA compliant. He is friendly and easy to talk with and has so much amazing knowledge and experience to bring to any conversation.",
    sourceUrl: "",
    sourceLabel: "Alignable",
  },
  {
    name: "Devin Johnson",
    title: "Strategic Capital, M&A",
    quote: "He pulls real insights from customers, driving more conversions for our clients.",
    sourceUrl: "",
    sourceLabel: "Alignable",
  }
];
