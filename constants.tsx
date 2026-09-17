
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
