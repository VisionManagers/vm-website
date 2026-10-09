
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
  // The ONE booking link sitewide (simplification audit §3, 2026-09-30): 20 minutes,
  // labeled "Book 20 minutes". Calendly since 2026-10-05 (GHL exit); bookings land in
  // Airtable through /api/booking-webhook. The clean alias visionmanagers.com/book (vercel.json)
  // 302s here and is what the Lab report emails print — it is not a second link.
  DISCOVERY: "https://calendly.com/sukhneet-visionmanagers/strategy-call-with-suk",
  // The 60-minute BNI 1-to-1 (members only). Empty until the Calendly event exists —
  // create it with `CALENDLY_PAT=… node scripts/calendly-event.mjs create-121`, paste the link here.
  BNI_121: "" as string,
};

/* /bni — the BNI members' page (vault 50-Website/pages/bni.md) */
export const REFERRAL_TEXT_NUMBER = "(425) 830-5678";           // from the 10/5 "Who to Send Me" handout
export const REFERRAL_TEXT_TEL = "+14258305678";
export const VOICE_DEMO_NUMBER: string = "";                              // the VM Voice demo line — empty until Suk supplies it
export const AI_COACH_URL = "https://phnxlog.com";

/* Testimonials — permissioned only (80-Content/proof-library.md gate: nothing
   ships without permission GRANTED). The old Alignable trio read as generic
   ("Suk builds XYZ") and was replaced 2026-09-14 per Sukh. Two entries for now;
   Piilani's ask is queued for her late-Sept review call — she's the natural
   third when it lands. Quotes verbatim; joins marked with ellipses. */
export const TESTIMONIALS = [
  {
    name: "Nate",
    title: "Electrician & general contractor — built the proposal for a $120,000 contract he won",
    quote: "It probably cuts my average proposal time in half… To get all of the fine print that I have, I would have needed a lawyer to help with it.",
    sourceUrl: "",
    sourceLabel: "",
  },
  {
    name: "David Vudragovich",
    title: "Owner, Agent David Cares — insurance",
    quote: "If Suk hadn't invited me to Casual Intelligence, I'd probably still be that guy from the 1900s worried about Skynet, not using AI today… It probably would have taken me 13 to 15 months to do it. And I did it in two.",
    sourceUrl: "",
    sourceLabel: "",
  },
  {
    // Said on the hand-over call, 2026-09-17, after he asked to pay his balance.
    // Permission GRANTED (name + company) on the recording — proof-library §A.
    name: "Chris Wolf",
    title: "Owner, Wolf & Wolf — roofing & exteriors contractor",
    quote: "This was a very easy process. I'm impressed with your professionalism and I'm excited to use my new AI helper.",
    sourceUrl: "",
    sourceLabel: "",
  },
];
