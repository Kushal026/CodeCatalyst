import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── Pattern Libraries ──────────────────────────────────────────────

const URGENCY_WORDS = [
  "urgent", "immediately", "right now", "act now", "hurry",
  "expire", "expires", "expiring", "limited time", "last chance",
  "within 24 hours", "within 1 hour", "don't delay", "time sensitive",
  "account blocked", "account suspended", "account locked",
  "verify now", "confirm now", "update now", "click now",
  "respond immediately", "action required", "final warning",
  "your account will be closed", "unauthorized transaction",
  "security alert", "unusual activity", "suspicious activity",
];

const OTP_PATTERNS = [
  "otp", "one.time.password", "verification code", "security code",
  "pin number", "enter your pin", "share your pin",
  "cvv", "card number", "credit card", "debit card",
  "password", "login credentials", "bank details",
  "social security", "ssn", "aadhaar", "pan number",
  "send.*code", "share.*code", "tell.*code", "give.*code",
  "send.*otp", "share.*otp", "tell.*otp", "give.*otp",
  "send.*password", "share.*password", "tell.*password",
];

const EMOTIONAL_PATTERNS = [
  "legal action", "police", "arrest", "lawsuit", "court",
  "your account will be closed", "permanently banned",
  "you have won", "congratulations", "lucky winner", "selected",
  "claim your prize", "claim your reward",
  "we have detected", "someone tried to",
  "your family", "emergency", "accident",
  "fear", "worried", "scared",
];

const IMPERSONATION_PATTERNS = [
  "reserve bank", "rbi", "irs", "tax department", "income tax",
  "federal", "government", "ministry",
  "customer care", "helpdesk", "support team",
  "we are from", "calling from bank", "bank manager",
  "apple support", "microsoft support", "google support",
  "paypal", "netflix", "amazon prime",
];

const URL_PATTERNS = [
  /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i,         // IP-based URLs
  /https?:\/\/bit\.ly\//i,                                      // bit.ly
  /https?:\/\/tinyurl\.com\//i,                                  // tinyurl
  /https?:\/\/t\.co\//i,                                        // t.co
  /https?:\/\/goo\.gl\//i,                                      // goo.gl
  /https?:\/\/[a-z0-9-]+\.[a-z]{2,}\.[a-z]{2,}\.[a-z]{2,}/i,  // deeply nested subdomains
  /https?:\/\/[a-z]*(?:bank|pay|secure|verify|login|account|update)[a-z]*\.[a-z]+/i, // suspicious keywords in domains
  /[a-z0-9]+\.xyz\b/i,                                          // .xyz domains
  /[a-z0-9]+\.top\b/i,                                          // .top domains
  /[a-z0-9]+\.click\b/i,                                        // .click domains
  /[a-z0-9]+\.loan\b/i,                                         // .loan domains
];

// ── Analysis Engine ────────────────────────────────────────────────

interface AnalysisResult {
  risk_level: "Safe" | "Suspicious" | "High-Risk";
  risk_score: number;
  explanation: string[];
  suggested_action: string;
}

function analyzeMessage(message: string): AnalysisResult {
  const lower = message.toLowerCase();
  const explanations: string[] = [];
  let score = 0;

  // Urgency detection (weight: 15 per match, max 35)
  const urgencyMatches = URGENCY_WORDS.filter((w) => lower.includes(w));
  if (urgencyMatches.length > 0) {
    const pts = Math.min(urgencyMatches.length * 15, 35);
    score += pts;
    explanations.push(
      `Contains urgency/pressure language: "${urgencyMatches.slice(0, 3).join('", "')}"`
    );
  }

  // OTP / credential requests (weight: 25 per match, max 40)
  const otpMatches = OTP_PATTERNS.filter((p) => new RegExp(p, "i").test(lower));
  if (otpMatches.length > 0) {
    const pts = Math.min(otpMatches.length * 25, 40);
    score += pts;
    explanations.push(
      "Requests sensitive information (OTP, PIN, password, or card details)"
    );
  }

  // Suspicious URLs (weight: 20 per match, max 30)
  const urlMatches = URL_PATTERNS.filter((r) => r.test(message));
  if (urlMatches.length > 0) {
    const pts = Math.min(urlMatches.length * 20, 30);
    score += pts;
    explanations.push(
      "Contains suspicious or shortened URLs that may lead to phishing sites"
    );
  }

  // Emotional manipulation (weight: 12 per match, max 25)
  const emotionalMatches = EMOTIONAL_PATTERNS.filter((p) => lower.includes(p));
  if (emotionalMatches.length > 0) {
    const pts = Math.min(emotionalMatches.length * 12, 25);
    score += pts;
    explanations.push(
      "Uses emotional manipulation or fear-based language"
    );
  }

  // Impersonation (weight: 18 per match, max 30)
  const impersonationMatches = IMPERSONATION_PATTERNS.filter((p) =>
    lower.includes(p)
  );
  if (impersonationMatches.length > 0) {
    const pts = Math.min(impersonationMatches.length * 18, 30);
    score += pts;
    explanations.push(
      "Appears to impersonate a known organization or authority"
    );
  }

  // Clamp score
  score = Math.min(score, 100);

  // Classify
  let risk_level: AnalysisResult["risk_level"];
  let suggested_action: string;

  if (score >= 60) {
    risk_level = "High-Risk";
    suggested_action =
      "Do NOT respond to this message. Do not click any links or share any personal information. Report this message to your bank or local cyber-crime authority.";
  } else if (score >= 30) {
    risk_level = "Suspicious";
    suggested_action =
      "Exercise caution. Do not share sensitive information. Verify the sender through official channels before taking any action.";
  } else {
    risk_level = "Safe";
    suggested_action =
      "This message appears safe, but always stay vigilant. Never share OTPs or passwords with anyone.";
    if (explanations.length === 0) {
      explanations.push("No significant fraud indicators detected");
    }
  }

  return { risk_level, risk_score: score, explanation: explanations, suggested_action };
}

// ── HTTP Handler ───────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { message } = await req.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = analyzeMessage(message.trim());

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
