This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## 📦 Project Packages & Setup

### 1. Core Dependencies

| Command | Purpose |
|---|---|
| `npm install clsx tailwind-merge class-variance-authority` | Utility packages for clean Tailwind class handling and reusable UI variants |
| `npm install lucide-react` | Icon library |
| `npm install framer-motion` | Animations and transitions |
| `npm install react-hook-form zod @hookform/resolvers` | Forms and validation |
| `npm install next-themes sonner` | Theme switching and toast notifications |
| `npm install swr date-fns` | Data fetching/cache and date formatting |
| `npm install mongoose bcrypt` | MongoDB connection/models and password hashing |
| `npm install recharts` | Charts for dashboards/statistics |

Full command:

```bash
npm install clsx tailwind-merge class-variance-authority lucide-react framer-motion react-hook-form zod @hookform/resolvers next-themes sonner swr date-fns mongoose bcrypt recharts

Searched codebase for "project purpose components features API routes database schema", no results

Read [](file:///c%3A/Users/12500031/Desktop/Portfolio/README.md#1-1), lines 1 to 50

Read [](file:///c%3A/Users/12500031/Desktop/Portfolio/package.json)

Read [](file:///c%3A/Users/12500031/Desktop/Portfolio/src)

Read [](file:///c%3A/Users/12500031/Desktop/Portfolio/next.config.ts)

---

## **Project Resume**

### **Project Name:** UMS (Portfolio)

### **Overview**    analyse that project and give me a resume about it
--- A modern, full-stack portfolio website built with **Next.js 16** and **MongoDB**. The application showcases a developer's profile with real-time data management capabilities, including a profile visibility toggle feature that allows users to show/hide their profile from the public.

---

### **Tech Stack**

**Frontend:**
- **Next.js 16.2.4** (React 19.2.4) with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4** with PostCSS for styling
- **Framer Motion** for smooth animations
- **Radix UI** for accessible components
- **shadcn** for pre-built UI components
- **Lucide React** for icon library
- **React Hook Form** + **Zod** for form handling & validation

**Backend:**
- **Next.js API Routes** (serverless endpoints)
- **MongoDB** with **Mongoose** ODM for data persistence
- **bcrypt** for password hashing

**Developer Experience:**
- **ESLint** for code linting
- **React Compiler** (Babel plugin) for optimizations
- **SWR** for data fetching and caching
- **Sonner** for toast notifications
- **Next Themes** for dark mode support

---

### **Key Features**

1. **Dynamic Profile Display**
   - Server-rendered profile component that pulls data from MongoDB
   - Customizable bio sections, social links, and contact information
   - Avatar image with fallback support

2. **Profile Visibility Control**
   - Client-side toggle switch to show/hide the entire profile
   - Real-time database updates via API
   - State persists in MongoDB Atlas
   - Smooth page refresh after visibility changes

3. **Responsive Design**
   - Mobile-first approach with Tailwind breakpoints
   - Canvas animated background with particles and lines
   - Floating animated bio cards

4. **Dark Mode Support**
   - Theme switching via Next Themes
   - Persisted theme preference

5. **API Endpoints**
   - `GET /api/profile` - Fetch profile data
   - `PATCH /api/profile` - Update profile fields (including visibility)

---

### **Project Structure**

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page (renders profile + visibility toggle)
│   ├── layout.tsx                # Root layout with theme provider
│   ├── globals.css               # Global styles
│   └── api/profile/route.ts       # Profile API (GET, PATCH)
├── components/
│   ├── layout/                   
│   │   ├── header.tsx            # Navigation header
│   │   └── Profil.tsx            # Server component for profile rendering
│   ├── ui/                       # Reusable UI components (buttons, cards, dialogs, etc.)
│   ├── CanvasBackground.tsx      # Animated particle/line background
│   ├── ProfileVisibilityToggle.tsx # Client-side toggle switch
│   └── theme-provider.tsx        # Theme wrapper
├── models/
│   └── Profile.ts                # Mongoose schema for profile data
├── types/
│   └── profile.ts                # TypeScript interfaces
├── hooks/
│   └── useProfile.ts             # Custom hook for fetching profile via SWR
├── lib/
│   ├── mongodb.ts                # MongoDB connection handler
│   └── utils.ts                  # Utility functions
└── scripts/
    └── seed.ts                   # Database seeding script
```

---

### **Database Schema**

**Profile Model** (MongoDB):
- `_id`: Custom string ID (default: `'prof_001'`)
- `full_name`, `title`, `short_bio`: Basic info
- `email`, `phone`, `location`: Contact details
- `avatar_url`, `website_logo`: Image URLs
- `github_url`, `linkedin_url`, `website_url`: Social links
- `bio_1`, `bio_2`, `bio_3`: Floating bio sections
- `isVisible`: Boolean flag to control profile visibility
- `created_at`, `updated_at`: Timestamps

---

### **Recent Fixes Applied**
1. ✅ Profile visibility toggle now properly updates and persists in MongoDB
2. ✅ Page refreshes after visibility changes
3. ✅ Boolean/string type normalization across API, page, and components
4. ✅ Checkbox validation errors resolved
5. ✅ Build system now compiles successfully

---

### **Scripts Available**
```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm start        # Run production server
npm run lint     # Run ESLint
```

---

### **Notable Implementation Details**
- Uses `force-dynamic` + `revalidate: 0` for real-time profile data
- Server-side rendering for profile with client-side toggle
- Debounced API updates with error handling and rollback
- Canvas background for visual appeal
- Accessible toggle component with loading states










Start white header.tsx