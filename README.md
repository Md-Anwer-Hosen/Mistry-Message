MistryMessage 📬
Link : https://mistry-message-kappa.vercel.app/


An anonymous messaging platform (inspired by NGL / Sarahah) where users receive honest, anonymous messages through a shareable link. Built with a distinctive postal/letter-themed design.


✨ Features


🔐 Authentication — Email/password sign-up with OTP verification, powered by NextAuth.js
✉️ Anonymous Messaging — Anyone with your link can send you an anonymous message
🎚️ Accept/Reject Toggle — Turn message-receiving on or off anytime
🤖 AI Message Suggestions — Get AI-generated conversation starters using the Vercel AI SDK + Groq
🗑️ Message Management — View and delete received messages
📧 Email Verification — OTP delivery via Resend
🎨 Postal/Letter UI — Custom design system with a sealed-letter carousel homepage and wax-seal branding



🛠️ Tech Stack

LayerTechnologyFrameworkNext.js (App Router)LanguageTypeScriptDatabaseMongoDB with MongooseAuthenticationNextAuth.js (Credentials Provider, JWT strategy)ValidationZodUI Componentsshadcn/uiStylingTailwind CSS v4EmailResendAIVercel AI SDK + Groq (llama-3.1-8b-instant)FontsPetrona, Inter, JetBrains Mono
🎨 Design System

TokenValueEspresso (primary dark)#12100EAged Paper (background)#F2EBDDSealing Wax Red (accent)#C44536

mistrymessage/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── sign-up/
│   │   │   ├── verify-code/
│   │   │   ├── send-message/
│   │   │   ├── get-messages/
│   │   │   ├── delete-message/[messageid]/
│   │   │   ├── accept-messages/
│   │   │   └── suggest-messages/
│   │   ├── u/[username]/        # Public profile to send messages
│   │   ├── dashboard/
│   │   └── layout.tsx
│   ├── components/
│   │   └── ui/                  # shadcn/ui components
│   ├── lib/
│   │   ├── dbConnect.ts
│   │   └── resend.ts
│   ├── model/
│   │   └── user.ts              # User & Message Mongoose schemas
│   ├── schemas/                 # Zod validation schemas
│   ├── types/
│   │   └── next-auth.d.ts       # NextAuth type extensions
│   └── helpers/
├── components.json               # shadcn/ui config
├── .env.local
└── package.json

Acknowledgements


Inspired by NGL and Sarahah
Built with Next.js, shadcn/ui, and Vercel AI SDK
