## Multi-tenant Next.js App

This project is a minimal multi-tenant setup using **Next.js App Router**, **TypeScript**, and **Tailwind CSS**.

### Key concepts

- **Multi-tenancy via hostname**: `middleware.ts` inspects the incoming hostname and internally rewrites requests to `app/[domain]/...` without exposing tenant IDs in the URL.
- **File-system "DB"**: `lib/mock-db.ts` is the single source of truth for tenant configuration (business name, variant, primary color, description).
- **Dynamic theming**: Each tenant layout injects a `--primary` CSS variable on `body`; Tailwind's `primary` color is mapped to this variable.
- **Shared image asset**: All logo/product images currently use `https://images.unsplash.com/photo-1523275335684-37898b6baf30`.

### Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the dev server:
   ```bash
   npm run dev
   ```
3. Visit a tenant domain (e.g. when running locally):
   - `http://localhost:3000/` &rarr; rewritten to `/localhost`
   - `http://client-a.com:3000/` (with appropriate hosts file) &rarr; rewritten to `/client-a.com`

