/**
 * MOCK AI SERVICE
 *
 * generateFollowUp() is the single seam between the UI and the "AI".
 * Components and the Redux slice only call this function and never know
 * whether the answer is mocked or real.
 *
 * To connect a real LLM later, replace the body of generateFollowUp() with a
 * fetch/axios call to your own serverless endpoint (for example a Vercel
 * function at /api/follow-up). That function holds the model API key as a
 * server-side environment variable and returns the generated text.
 * Never call an LLM provider directly from the browser: any key placed in
 * frontend code (including VITE_* variables) is public.
 *
 * Demo tip: put the words "simulate error" in the name or destination to
 * trigger the error state.
 */
import { formatINR } from "../../utils/formatCurrency.js";
import { formatDate, parseDate } from "../../utils/formatDate.js";

export const TONE_OPTIONS = ["Friendly", "Formal", "Persuasive"];
export const CHANNEL_OPTIONS = ["Email", "WhatsApp"];

const MIN_DELAY_MS = 1000;
const MAX_DELAY_MS = 2000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const clean = (value) => String(value ?? "").trim();

const buildContext = ({ name, destination, budget, travelDate }) => {
  const fullName = clean(name);
  const date = parseDate(travelDate) ? formatDate(travelDate) : null;

  return {
    name: fullName || "Customer",
    first: fullName.split(/\s+/)[0] || "there",
    destination: clean(destination) || "your dream trip",
    budgetPhrase:
      Number(budget) > 0 ? ` within your budget of ${formatINR(budget)}` : "",
    datePhrase: date ? ` around ${date}` : "",
  };
};

const GREETINGS = {
  Friendly: (c) => `Hi ${c.first}!`,
  Formal: (c) => `Dear ${c.name},`,
  Persuasive: (c) => `Hi ${c.first},`,
};

const SIGN_OFFS = {
  Friendly: "Warm regards,",
  Formal: "Yours sincerely,",
  Persuasive: "Best wishes,",
};

const SUBJECTS = {
  New: (c) => `Your ${c.destination} trip - let's plan it together`,
  Contacted: (c) => `Following up on your ${c.destination} trip`,
  Interested: (c) => `Your personalised ${c.destination} package`,
  Converted: (c) => `Thank you for booking your ${c.destination} trip!`,
  Lost: (c) => `Still thinking about ${c.destination}?`,
};

const BODIES = {
  New: {
    Friendly: (c) =>
      `Thanks so much for your interest in ${c.destination}! We'd love to help you plan a trip${c.datePhrase}${c.budgetPhrase}.`,
    Formal: (c) =>
      `Thank you for your enquiry regarding travel to ${c.destination}. We would be pleased to assist you in planning your trip${c.datePhrase}${c.budgetPhrase}.`,
    Persuasive: (c) =>
      `${c.destination} is a fantastic choice, and the best deals${c.datePhrase} go quickly! Let us put together a trip${c.budgetPhrase} that you'll remember for years.`,
  },
  Contacted: {
    Friendly: (c) =>
      `Just checking in after our last chat about ${c.destination}. Have you had a chance to think about the trip${c.datePhrase}?`,
    Formal: (c) =>
      `I am writing to follow up on our recent conversation about your travel to ${c.destination}${c.datePhrase}. Please let me know if you have any questions.`,
    Persuasive: (c) =>
      `Spots for ${c.destination}${c.datePhrase} are filling up fast, and I'd hate for you to miss the best options${c.budgetPhrase}.`,
  },
  Interested: {
    Friendly: (c) =>
      `I'm so glad you're excited about ${c.destination}! I've shortlisted a few packages${c.budgetPhrase} that I think you'll love.`,
    Formal: (c) =>
      `Further to your interest in ${c.destination}, we have prepared a selection of packages${c.budgetPhrase}${c.datePhrase} for your consideration.`,
    Persuasive: (c) =>
      `Good news: we have a great ${c.destination} package${c.budgetPhrase} ready for you. Prices and availability${c.datePhrase} can change quickly, so now is the best time to lock it in.`,
  },
  Converted: {
    Friendly: (c) =>
      `Thank you for booking your ${c.destination} trip with us! We're so excited for you${c.datePhrase}.`,
    Formal: (c) =>
      `Thank you for confirming your booking to ${c.destination}${c.datePhrase}. We appreciate your trust in our services.`,
    Persuasive: (c) =>
      `Congratulations on booking ${c.destination}! You're going to have an amazing time${c.datePhrase}, and we'll make sure every detail is taken care of.`,
  },
  Lost: {
    Friendly: (c) =>
      `It's been a while since we spoke about ${c.destination}, and I wanted to say hello! If your plans have changed, I'd love to help again.`,
    Formal: (c) =>
      `I am writing to follow up regarding your earlier enquiry about ${c.destination}. Should your plans have changed, we would be glad to assist you.`,
    Persuasive: (c) =>
      `We've put together some fresh ${c.destination} offers${c.budgetPhrase} that weren't available before. It could be the perfect time to reconsider your trip!`,
  },
};

const CALLS_TO_ACTION = {
  default: {
    Friendly:
      "Shall I send over some details? Just reply here and we'll take it from there!",
    Formal:
      "Please let us know a convenient time to discuss, and we will be happy to share the details.",
    Persuasive:
      "Reply today and I'll reserve the best option for you before it's gone!",
  },
  Converted: {
    Friendly:
      "We'll share your itinerary and travel documents soon. Reach out anytime if you need anything!",
    Formal:
      "Our team will share your itinerary and travel documents shortly. Please do not hesitate to contact us with any questions.",
    Persuasive:
      "Your itinerary and documents are on the way, and we're here whenever you need us. Get ready for a great trip!",
  },
};

/**
 * Generates a suggested follow-up message for a customer.
 * @param {{
 *   details: { name?: string, destination?: string, budget?: number|string, travelDate?: string },
 *   status?: string,
 *   tone?: string,
 *   channel?: string,
 * }} input
 * @returns {Promise<string>}
 */
export const generateFollowUp = async ({
  details = {},
  status = "New",
  tone = "Friendly",
  channel = "Email",
}) => {
  await wait(MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS));

  if (/simulate error/i.test(`${details.name} ${details.destination}`)) {
    throw new Error("Could not generate a message. Please try again.");
  }

  const statusKey = BODIES[status] ? status : "New";
  const toneKey = TONE_OPTIONS.includes(tone) ? tone : "Friendly";
  const context = buildContext(details);

  const greeting = GREETINGS[toneKey](context);
  const body = BODIES[statusKey][toneKey](context);
  const callToAction = (CALLS_TO_ACTION[statusKey] || CALLS_TO_ACTION.default)[
    toneKey
  ];

  // WhatsApp: short and casual, no subject line or sign-off.
  if (channel === "WhatsApp") {
    const emoji = toneKey === "Friendly" ? " ✈️" : "";
    return [`${greeting}${emoji}`, "", body, "", callToAction].join("\n");
  }

  return [
    `Subject: ${SUBJECTS[statusKey](context)}`,
    "",
    greeting,
    "",
    body,
    "",
    callToAction,
    "",
    SIGN_OFFS[toneKey],
    "Trailpilot Travel Team",
  ].join("\n");
};
