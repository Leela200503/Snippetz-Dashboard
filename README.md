# Snippetz

Snippetz is a full-stack SaaS application that allows users to save, organize, and retrieve text snippets and prompts. 

Built during the "Zero to Subscriber" Hackathon.

## Features
- **Authentication**: Secure email/password login using NextAuth.
- **Snippet Management**: Create, view, copy, and delete text snippets with tags.
- **Tiered Plans**: Free users are limited to 3 snippets.
- **Payments**: Stripe integration for upgrading to a Pro plan (unlimited snippets).

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: NextAuth.js
- **Payments**: Stripe Checkout & Webhooks

## Local Development

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Configure your environment variables in `.env`:
   ```env
   DATABASE_URL=postgresql://...
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PRICE_ID=price_...
   ```
3. Push the database schema:
   ```bash
   npx prisma db push
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
