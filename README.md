# 📄 HireForge — AI-Powered Resume Builder

A full-stack AI-powered Resume Builder web application built with **React 19 + Vite 8** and **Express 5**. It lets users create, customize, and export professional resumes with AI assistance, multilingual support, voice input, interview preparation, job news, and payment integration.

---

## 🚀 Live Demo

> https://hireforge.onrender.com

---

## 📸 Screenshots

> <img width="1663" height="894" alt="image" src="https://github.com/user-attachments/assets/e9e30cd9-11e4-44e6-9869-c0a1c1790b8f" />
> <img width="1661" height="888" alt="image" src="https://github.com/user-attachments/assets/2cada02b-e280-4002-aacd-fe6f521b3f2c" />
> <img width="1653" height="895" alt="image" src="https://github.com/user-attachments/assets/ef757623-445a-4c3f-bdbd-822115f79299" />
> <img width="1664" height="891" alt="image" src="https://github.com/user-attachments/assets/4bc5879d-3bc1-428d-865b-221cda152606" />
> <img width="1653" height="893" alt="image" src="https://github.com/user-attachments/assets/1217aa33-1cc4-42b4-bc14-2c8469b1823d" />
> <img width="1666" height="884" alt="image" src="https://github.com/user-attachments/assets/6fda10b4-8245-403a-8da0-2b71bf184784" />
> <img width="1665" height="891" alt="image" src="https://github.com/user-attachments/assets/a926776c-7406-4d02-9b59-c0a535dcfab9" />
> <img width="1659" height="890" alt="image" src="https://github.com/user-attachments/assets/cad0c044-4e9d-4b25-a99a-bb101d1e4a9d" />
> <img width="1666" height="891" alt="image" src="https://github.com/user-attachments/assets/5c31b928-bc6f-40c2-83fb-c0dfbcca7857" />
> <img width="1653" height="884" alt="image" src="https://github.com/user-attachments/assets/13bd9cb0-b864-46ab-8a8d-1dd94570cdd1" />
> <img width="1652" height="884" alt="image" src="https://github.com/user-attachments/assets/1ba96d9b-2e16-4ca6-9cc4-019c1851c6bd" />
> <img width="1659" height="884" alt="image" src="https://github.com/user-attachments/assets/12cd1872-40ba-453a-8a0d-da96a507d846" />
> <img width="1658" height="883" alt="image" src="https://github.com/user-attachments/assets/6ff99b10-f49b-4957-a1a3-2d7c980c6e2a" />
> <img width="1658" height="888" alt="image" src="https://github.com/user-attachments/assets/5aac95a1-c540-479b-a563-698ab0251533" />
> <img width="1663" height="893" alt="image" src="https://github.com/user-attachments/assets/31c71b02-83e7-48c7-aece-2bc8622912bb" />
> <img width="1650" height="887" alt="image" src="https://github.com/user-attachments/assets/5993075c-2b94-442f-bc44-8a38dc575e03" />
> <img width="1663" height="882" alt="image" src="https://github.com/user-attachments/assets/4d6bd967-0880-4329-a76c-f6a06d03d8d5" />
> <img width="1668" height="892" alt="image" src="https://github.com/user-attachments/assets/11743c33-d1e7-4ef4-86bc-751d672fc3a2" />
> <img width="1660" height="890" alt="image" src="https://github.com/user-attachments/assets/45a0a85b-9a47-4fe0-9051-413c8354e295" />
> <img width="1666" height="886" alt="image" src="https://github.com/user-attachments/assets/8123bac7-0da5-4844-95e4-2e1a9aca2cb2" />
> <img width="1654" height="883" alt="image" src="https://github.com/user-attachments/assets/a7c1172d-21dd-419e-ad58-f45cd2f6f9f7" />

---

## ✨ Features

### 🔐 Authentication & User Management
- Email/password signup and login with **Passport.js** (local strategy)
- **Google OAuth 2.0** login (`passport-google-oauth20`)
- Protected routes — unauthenticated users are redirected via `AuthGate` and `ProtectedRoute`
- Password reset via email using **SendGrid** (`@sendgrid/mail`)
- Session management with **express-session** + **connect-mongo**
- Password hashing with **bcryptjs**

### 🤖 AI-Powered Resume Building
- AI resume content generation powered by **OpenRouter SDK**
- Smart suggestions for resume sections (summary, skills, experience descriptions)
- AI chat assistant to help refine and tailor resume content

### 📝 Resume Builder (Build Page)
- Multi-section resume form: Personal Info, Education, Work Experience, Skills, Projects, and more
- Real-time resume preview as you type
- Export resume as **PDF** using `html2pdf.js`
- Smooth animations via **Framer Motion** and **GSAP**

### 🎙️ Voice Input
- Fill in resume fields using your voice with **react-speech-recognition**
- Hands-free resume creation experience (requires `regenerator-runtime` polyfill)

### 🌐 Multilingual Support (i18n)
- Full internationalization using **i18next** and **react-i18next**
- Switch between multiple languages from the UI

### 📰 Job News Feed
- Browse latest job market news and career tips on the **News** page
- Stay informed about industry trends

### 🎯 Interview Preparation
- Dedicated **Interview Prep** page with AI-generated interview questions and tips
- Practice answers with AI feedback

### 💳 Payment Integration
- Premium features unlocked via **Razorpay** payment gateway

### 👤 User Profile
- Redesigned profile UI with a modern, polished layout
- View and update your profile information (name, email, avatar, and more)
- Manage your saved resume data

### 🛡️ Security
- Rate limiting on API endpoints with **express-rate-limit**
- HTTP security headers with **Helmet**
- CORS protection
- Cookie parsing with **cookie-parser**

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool & dev server |
| React Router DOM | 7 | Client-side routing |
| Tailwind CSS | 3 | Utility-first styling |
| Framer Motion | 12 | Animations |
| GSAP | 3 | Advanced animations |
| react-i18next | 16 | Internationalization |
| react-speech-recognition | 4 | Voice input |
| regenerator-runtime | 0.14 | Async/generator polyfill for voice |
| react-markdown | 10 | Markdown rendering |
| react-icons | 5 | Icon library |
| html2pdf.js | 0.14 | PDF export |
| Axios | 1 | HTTP client |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Express.js | 5 | Web server framework |
| Mongoose | 9 | MongoDB ODM |
| Passport.js | 0.7 | Authentication middleware |
| passport-local | 1 | Email/password auth strategy |
| passport-google-oauth20 | 2 | Google OAuth strategy |
| express-session | 1 | Session management |
| connect-mongo | 5 | MongoDB session store |
| bcryptjs | 3 | Password hashing |
| SendGrid (`@sendgrid/mail`) | — | Transactional email (password reset) |
| Multer | 1 | File upload handling |
| Helmet | 8 | Security headers |
| express-rate-limit | 8 | API rate limiting |
| CORS | 2 | Cross-origin resource sharing |
| dotenv | 17 | Environment variable management |

### AI & Services
| Technology | Purpose |
|---|---|
| OpenRouter SDK (`@openrouter/sdk`) | AI resume generation & chat |
| Supabase (`@supabase/supabase-js`) | Additional database & storage |
| Razorpay | Payment gateway |

---

## 📁 Project Structure

```
Resume-Builder/
├── models/                   # Mongoose database models
│   ├── User.js               # User schema (auth, profile)
│   └── Message.js            # Chat/message schema
├── public/                   # Static assets
├── scratch/                  # Development scratch files
├── src/                      # React frontend source
│   ├── assets/               # Images, fonts, static files
│   ├── components/           # React page components
│   │   ├── About.jsx         # About page
│   │   ├── AuthGate.jsx      # Auth boundary component
│   │   ├── Build.jsx         # Resume builder (main feature)
│   │   ├── Contact.jsx       # Contact page
│   │   ├── Home.jsx          # Landing/home page
│   │   ├── InterviewPrep.jsx # AI interview preparation
│   │   ├── Navbar.jsx        # Navigation bar
│   │   ├── News.jsx          # Job news feed
│   │   ├── Profile.jsx       # User profile page
│   │   ├── ProtectedRoute.jsx# Route protection HOC
│   │   ├── ResetPassword.jsx # Password reset page
│   │   └── i18n.js           # Internationalization config
│   ├── context/
│   │   └── AuthContext.jsx   # Global auth state (React Context)
│   ├── lib/
│   │   └── supabase.js       # Supabase client config
│   ├── App.jsx               # Root component & routes
│   ├── config.js             # App configuration
│   ├── index.css             # Global styles
│   └── main.jsx              # React entry point
├── .gitignore
├── eslint.config.js          # ESLint configuration
├── index.html                # HTML entry point
├── package.json              # Dependencies & scripts
├── postcss.config.js         # PostCSS configuration
├── server.js                 # Express backend server
├── tailwind.config.js        # Tailwind CSS configuration
├── test-openrouter.js        # OpenRouter API test script
└── vite.config.js            # Vite configuration
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **MongoDB** connection URI (local or MongoDB Atlas)
- A **Supabase** project URL and anon key
- An **OpenRouter** API key
- A **Google OAuth** client ID and secret
- A **Razorpay** key ID and secret
- A **SendGrid** API key (for password reset emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vickyxsg173/Resume-Builder.git
   cd Resume-Builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development

   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # Session
   SESSION_SECRET=your_session_secret_key

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

   # SendGrid (email)
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=your_verified_sender@example.com

   # OpenRouter AI
   OPENROUTER_API_KEY=your_openrouter_api_key

   # Supabase
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Razorpay
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

### Running the App

**Start the backend server:**
```bash
node server.js
```

**In a separate terminal, start the Vite dev server:**
```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

**Production build:**
```bash
npm run build
npm run preview
```

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm start` | Start the Express backend server (`node server.js`) |

---

## 🔌 API Endpoints

> Base URL: `http://localhost:5000`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login with email/password |
| GET | `/auth/logout` | Logout user |
| GET | `/auth/google` | Initiate Google OAuth |
| GET | `/auth/google/callback` | Google OAuth callback |
| POST | `/auth/reset-password` | Send password reset email |
| GET | `/api/user/profile` | Get current user profile |
| PUT | `/api/user/profile` | Update user profile |
| POST | `/api/ai/generate` | Generate AI resume content |
| POST | `/api/payment/order` | Create Razorpay payment order |
| POST | `/api/payment/verify` | Verify Razorpay payment |

---

## 🌍 Internationalization

The app supports multiple languages via `i18next`. Translation configuration lives in `src/components/i18n.js`. To add a new language, add a new locale object and register it in the i18n config.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Vickyxsg173**
- GitHub: [@Vickyxsg173](https://github.com/Vickyxsg173)

---

## 🙏 Acknowledgements

- [OpenRouter](https://openrouter.ai/) for AI API access
- [SendGrid](https://sendgrid.com/) for transactional email delivery
- [Supabase](https://supabase.com/) for backend-as-a-service
- [Razorpay](https://razorpay.com/) for payment processing
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Framer Motion](https://www.framer.com/motion/) for animations
