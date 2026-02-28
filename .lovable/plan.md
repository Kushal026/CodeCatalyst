

# Codecatalyst — AI-Powered Fraud Detection Assistant

## Overview
A fintech-style fraud detection assistant where users paste suspicious messages and get instant risk analysis powered by a Supabase Edge Function backend.

## Pages & Layout

### Landing / Analysis Page
- Dark, trust-building fintech design with a gradient hero section
- App name "Codecatalyst" with shield/security branding
- Large text input area for pasting suspicious SMS/email/message
- "Analyze Message" button with loading state
- Results card that appears after analysis showing:
  - **Risk Level** badge (Safe = green, Suspicious = yellow, High-Risk = red)
  - **Risk Score** as a percentage with animated progress bar
  - **Explanation** — bullet list of detected risk factors (urgency language, OTP requests, suspicious URLs, etc.)
  - **Suggested Action** — clear guidance for the user
- Recent analysis history section (stored in local storage)

### How It Works Page
- Simple explainer of the detection methodology
- Examples of common scam patterns

## Backend — Supabase Edge Function

### `analyze-message` Edge Function
- Accepts POST with `{ message: string }`
- Performs rule-based NLP analysis:
  - **Keyword detection**: urgency words ("urgent", "immediately", "account blocked", "verify now")
  - **OTP/credential requests**: detects phrases asking for OTP, PIN, password, CVV
  - **Suspicious URL detection**: regex for shortened URLs, misspelled domains, IP-based links
  - **Emotional manipulation**: fear/pressure language ("your account will be closed", "legal action")
  - **Impersonation patterns**: fake bank/govt references
- Computes a weighted risk score (0-100%)
- Classifies as Safe / Suspicious / High-Risk based on thresholds
- Returns JSON with risk_level, risk_score, explanation array, and suggested_action

## Design
- Dark mode fintech aesthetic with green/red accent colors for safe/danger
- Card-based result display with smooth reveal animation
- Mobile-responsive layout
- Shield icon branding throughout

## Features
- Instant message analysis with visual feedback
- Analysis history stored locally
- Copy results to clipboard
- Clear, actionable explanations for non-technical users

