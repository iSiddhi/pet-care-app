# Pet Care API

Node + Express + MongoDB (Mongoose) backend for the pet-care-app frontend.
Plain CommonJS — no TypeScript, no NestJS.

## Setup

```bash
cd backend
npm install
cp .env.example .env     # then fill in MONGODB_URI and JWT_SECRET
npm run seed             # loads pets, breeds, products, groomers, team, gallery, diseases
npm run dev              # http://localhost:5000
```

Seeding also creates an admin: `admin@petcare.com` / `admin123`. **Change it.**

### MongoDB Atlas

1. https://cloud.mongodb.com → create a free M0 cluster
2. Database Access → add a user
3. Network Access → add your IP (or `0.0.0.0/0` while developing)
4. Connect → Drivers → copy the string into `MONGODB_URI`, replacing `<password>`

### Gemini (optional)

Get a key at https://aistudio.google.com/app/apikey and set `GEMINI_API_KEY`.
Without it the chatbot and disease prediction still work — they fall back to
keyword matching against the `Disease` collection.

## Endpoints

| Method | Route | Auth |
|---|---|---|
| POST | `/api/auth/register` | — |
| POST | `/api/auth/login` | — |
| GET / PUT | `/api/auth/me` | user |
| GET | `/api/pets?type=Dog&breed=&minPrice=&maxPrice=` | — |
| GET | `/api/pets/:id` | — |
| POST / PUT / DELETE | `/api/pets[/:id]` | admin |
| GET | `/api/breeds?pet=Dog` | — |
| GET | `/api/essentials?petType=Dog&grouped=true` | — |
| POST / PUT / DELETE | `/api/essentials[/:id]` | admin |
| GET / POST / DELETE | `/api/cart` | user |
| PUT / DELETE | `/api/cart/:productId` | user |
| POST | `/api/orders` | user |
| GET | `/api/orders/my` | user |
| GET | `/api/orders/:id` | owner or admin |
| GET | `/api/orders` | admin |
| PUT | `/api/orders/:id/status` | admin |
| GET | `/api/groomers` | — |
| GET | `/api/bookings/slots?groomer=&date=` | — |
| POST | `/api/bookings` | user |
| GET | `/api/bookings/my` | user |
| PATCH | `/api/bookings/:id/cancel` | owner or admin |
| POST | `/api/contact` | — |
| GET / PATCH | `/api/contact[/:id]` | admin |
| GET | `/api/team` | — |
| GET | `/api/gallery?category=Dog` | — |
| POST | `/api/predict-disease` | — |
| POST | `/api/chatbot` | — |
| GET | `/api/ai/status` | — |
| GET | `/api/health` | — |

Protected routes take `Authorization: Bearer <token>`.

## Notes

- Order totals are computed server-side from DB prices; the client cannot set them.
- A unique index on `(groomer, date, timeSlot)` prevents double-booking.
- AI routes are rate-limited to 20 requests/minute per IP.
- `/api/groomers`, `/api/team` and `/api/gallery` return bare arrays because
  that is what the existing frontend `api.js` consumed.

## Deploying

### API on Render

New -> Web Service -> connect this repo, then:

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

Add these environment variables in the Render dashboard:

```
NODE_ENV=production
MONGODB_URI=<your Atlas string>
JWT_SECRET=<long random string>
JWT_EXPIRES_IN=7d
CLIENT_URLS=https://your-app.vercel.app
GEMINI_API_KEY=<your key>
GEMINI_MODEL=gemini-3.5-flash-lite
MERCHANT_VPA=<your UPI id>
MERCHANT_NAME=Pet Care Hub
USD_TO_INR=88
```

Do **not** set `PORT` — Render provides it and `server.js` reads it.

`CLIENT_URLS` must exactly match the browser origin, including `https://`
and no trailing slash, or every request fails CORS.

In Atlas, Network Access must allow `0.0.0.0/0`. Render's free tier has no
fixed outbound IP, so there is nothing narrower to allow-list.

After the first deploy, seed the database once from your own machine with
`MONGODB_URI` pointing at the same cluster:

```bash
npm run seed
```

The free plan sleeps after 15 minutes idle, so the first request after a
quiet spell takes ~50 seconds to wake. That is the plan, not a bug.

### Frontend on Vercel

Root Directory `frontend`. Set one environment variable:

```
VITE_API_URL=https://your-api.onrender.com/api
```

Vite inlines env vars at build time, so changing this needs a redeploy,
not just a restart.
