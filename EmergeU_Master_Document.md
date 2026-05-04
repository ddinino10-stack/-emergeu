# EmergeU — Master Project Document
### Last Updated: 04/05/2026
---

## 1. The Vision

EmergeU is an AI-powered personal trainer marketplace platform — the BetterHelp of fitness. Clients are matched with the perfect PT based on their goals, personality, lifestyle and budget using AI. Everything happens inside the platform — messaging, video sessions, workout plans, payments and reviews.

**Tagline:** Become Unrecognisable

---

## 2. The Founder

- Senior Network Engineer at a major tech company
- Lost 40kg personal transformation — this is the brand story
- Level 3 PT qualification in progress
- Best friend owns a gym — first PT recruitment ground
- Building with Claude as development partner

---

## 3. Why EmergeU Exists — The Gap

After market research, no platform combines:
- AI-powered personality and goal-based matching
- Subscription model (not pay-per-session)
- Everything contained inside one platform
- Both online AND in-person PT options
- Vetted, approved PTs only

**Closest competitor:** MatchMyTrainer (UK) — basic directory with booking, no AI, no subscription, no in-platform sessions. Not a real competitor to what EmergeU is building.

---

## 4. Business Model

### Client Subscription Tiers
| Tier | What's Included | Price |
|------|----------------|-------|
| Essential | Messaging + workout plans | £49–£79/month |
| Standard | Above + weekly video session | £99–£149/month |
| Premium | Above + unlimited video + onsite | £149–£249/month |

### PT Subscription Tiers
| Tier | Monthly Cost | What They Get |
|------|-------------|---------------|
| Basic | £29/mo | Listed on platform, basic profile, 5 client matches |
| Pro | £59/mo | Priority matching, unlimited clients, analytics |
| Elite | £99/mo | Featured placement, marketing tools, dedicated support |

### Revenue Streams
1. PT monthly subscriptions — recurring income from day one
2. 20% commission on all client subscriptions
3. Premium PT placement fees

### Payment Model
- Clients pay monthly upfront via Stripe
- PTs paid weekly automatically via Stripe
- Session-based model within subscription (cleaner than pro-rata)
- Transparent — PTs know exactly what they earn

---

## 5. The Platform

### Three User Types
1. **Client** — looking for a PT
2. **PT** — looking for clients (vetted and approved by admin)
3. **Admin (Founder)** — managing the platform

### Client Journey
1. Lands on EmergeU website/app
2. Signs up / creates account
3. AI chat intake — goals, personality, budget, location, availability
4. Gets shown top 3 matched PTs with reasons why
5. Views PT profiles
6. Selects a tier (online / hybrid / onsite)
7. Books and pays via Stripe
8. Gets connected with their PT inside EmergeU
9. Ongoing — sessions, check ins, progress tracking
10. Reviews their PT after

### PT Journey
1. Applies to join EmergeU
2. Admin approves (quality control — this is the moat)
3. Builds profile — specialisms, style, location, availability, pricing tier
4. Goes live and starts receiving matches
5. Accepts or declines client matches
6. Delivers sessions inside the platform
7. Gets paid weekly minus commission

### Key Principle — Everything Inside EmergeU
No phone numbers shared, no WhatsApp, no going around the platform. All messaging, video, plans and payments happen inside EmergeU. This protects both parties and the business.

---

## 6. AI Matching

### Client Intake
- Conversational AI chat (not a boring form)
- Asks about goals, injuries, motivation style, budget, location, availability
- Builds a full client profile from the conversation

### PT Profiling
- Specialisms and experience
- Coaching style
- Reviews and client outcomes over time
- Availability and location
- Types of clients they've succeeded with

### Matching Engine
Ranks best PT fits based on:
- Goal alignment
- Personality compatibility
- Location / travel willingness
- Budget match
- Availability overlap

Client sees **top 3 matches** with explanation of why each PT suits them.

### Self-Learning
Platform learns from outcomes — if a client switched from PT A to PT B and got results, the AI adjusts. Gets smarter over time. This is the competitive moat.

---

## 7. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React | Clean, widely supported |
| Backend/Database | Supabase | Handles DB, auth, zero server management |
| Payments | Stripe | Industry standard, handles commission splits |
| AI Matching | Anthropic API | Powers intake chat and matching logic |
| Hosting | Vercel | Free to start, scales easily |
| Video Calling | Daily.co (future) | Reliable video API |

### Monthly Infrastructure Costs at Scale
| Cost | Monthly |
|------|---------|
| Anthropic AI API | £300 |
| Supabase | £50 |
| Vercel Hosting | £50 |
| Video calling | £200 |
| Stripe fees (~1.5%) | £600 |
| Marketing | £500 |
| **Total** | **~£1,700/mo** |

---

## 8. Profit Potential

| Stage | Revenue | Costs | Profit |
|-------|---------|-------|--------|
| 6 months (50 PTs, 100 clients) | £4,130/mo | £500 | **£3,630/mo** |
| 12 months (200 PTs, 450 clients) | £17,710/mo | £1,000 | **£16,710/mo** |
| 2-3 years (500 PTs, 2300 clients) | £65,040/mo | £1,700 | **£63,340/mo** |

---

## 9. Branding

- **Platform Name:** EmergeU (Emerge You)
- **Tagline:** Become Unrecognisable
- **Domain:** emergeu.co.uk ✅ (registered)
- **Instagram:** @emergeufit ✅ (secured)
- **Colours:** Black (#0a0a0a) and Orange (#FF6B00)
- **Logo:** Black background, orange U shape with person emerging and upward arrow
- **Font:** Arial / Sans-serif

---

## 10. Go-To-Market Strategy

### Phase 1 — Build PT Supply (Before Launch)
- Start at best friend's gym — recruit founding PTs
- Approach other local gyms directly
- Facebook PT professional groups
- Instagram @emergeufit — document the build journey
- Offer 0% commission for first 3 months to founding PTs
- Target: 50+ PTs registered before opening to clients

### Phase 2 — Waiting List
- Landing page live at emergeu.co.uk ✅
- Capture PT and client emails via Supabase ✅
- Build launch day audience

### Phase 3 — Client Acquisition at Launch
- Email waiting list
- Instagram and TikTok launch content
- Founder's personal transformation story as marketing content
- Facebook and Instagram ads (start at £5/day)
- Fitness influencer outreach
- Target press coverage with founder story

---

## 11. Legal & Protection

- **Trademark:** File EmergeU trademark via GOV.UK Intellectual Property Office (~£170-£200)
- **NDA:** Use before discussing details with any partners or investors
- **GDPR:** Important — platform handles personal health data (special category)
- **Insurance:** Platform liability insurance needed before launch

---

## 12. Build Timeline

| Phase | Timeline | What Gets Built |
|-------|----------|----------------|
| Foundation | Month 1 | Landing page ✅, Supabase setup ✅, waiting list ✅ |
| Core Build | Months 2-3 | Authentication, PT/client profiles, AI matching |
| Complete Platform | Months 4-5 | Video calling, dashboards, payments, reviews |
| Soft Launch | Month 5 | Invite waiting list PTs, onboard founding PTs |
| Public Launch | Month 6 | Marketing push, full public access |

---

## 13. What's Been Built — Session 1 (04/05/2026)

### Completed Tonight ✅
- Development environment set up (Node.js, VS Code, Git)
- React app created and running locally
- Professional landing page built with:
  - EmergeU logo in navbar
  - Brand video background on hero (optional)
  - Hero section with Find My PT and Join As A PT buttons
  - Problem section — why finding a PT is broken
  - Solution section — how EmergeU fixes it
  - How It Works — 3 step process
  - Features section — AI Matching, Expert Trainers, Online or In Person, Transform
  - For PTs section — selling the platform to trainers
  - Final CTA section
  - Footer
- Supabase database connected
- Waiting list form working — captures name, email, client or PT
- Tested on mobile ✅
- Data flowing into Supabase waiting_list table ✅

### Files & Structure
```
Documents/emergeu/
├── src/
│   ├── App.js          (main landing page — all code lives here)
│   ├── supabase.js     (database connection)
│   └── logo.jpg        (EmergeU logo — may need moving to public)
├── public/
│   ├── logo.jpg        (EmergeU logo)
│   └── video.mp4       (brand video)
└── package.json
```

### Supabase Details
- Project URL: https://hcgelonzczmkglpopsua.supabase.co
- Table: waiting_list (columns: id, name, email, type, created_at)

---

## 14. Next Steps — Session 2

### Priority Order
1. **Deploy live on emergeu.co.uk** via Vercel
2. **Authentication** — sign up and login for clients and PTs
3. **PT profile page** — what a PT's profile looks like
4. **Client onboarding flow** — AI intake chat
5. **Admin dashboard** — manage signups, approve PTs

### How To Start Each Session
Paste this into Claude at the start of every session:

*"We are building EmergeU — an AI powered PT marketplace platform. The tech stack is React frontend, Supabase database, Stripe payments, Anthropic API for AI matching, hosted on Vercel. Domain is emergeu.co.uk. Last session we built the landing page with a working waiting list form connected to Supabase. Today we are working on [INSERT NEXT TASK]. Here is the current App.js code: [PASTE CODE]"*

---

## 15. Useful Links

| Resource | URL |
|----------|-----|
| Domain | emergeu.co.uk (Namecheap) |
| Supabase Dashboard | supabase.com/dashboard |
| Vercel (when set up) | vercel.com |
| Anthropic API | console.anthropic.com |
| Instagram | @emergeufit |
| Local dev server | localhost:3000 |

---

*This document should be updated at the end of every build session.*
