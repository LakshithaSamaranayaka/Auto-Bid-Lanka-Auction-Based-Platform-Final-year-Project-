# AutoBid Lanka

AutoBid Lanka is a full-stack web platform developed as a final year project to modernize the vehicle buying and selling experience in Sri Lanka. The system allows users to list vehicles, participate in live auctions, place bids in real time, purchase vehicles directly, and manage transactions through a secure digital workflow.

The platform was designed to solve common problems in traditional vehicle trading, such as limited transparency, poor trust between buyers and sellers, manual negotiation, and inefficient auction processes. By combining modern web technologies with real-time features, secure authentication, KYC-based access control, and digital payment integration, AutoBid Lanka provides a more structured and reliable online vehicle marketplace.

## Project Objective

The main objective of this project is to build a centralized online auction-based vehicle trading platform that supports both auction listings and direct purchases, while improving transparency, usability, and trust for all users involved.

## Key Features

- User registration and login with JWT authentication
- Role-based access for buyers, sellers, and admin users
- Vehicle listing submission with detailed specifications
- Auction-based selling with bidding support
- Direct buy functionality for fixed-price vehicles
- Real-time bidding updates using Socket.IO
- KYC verification workflow for secure participation
- Buyer dashboard and seller dashboard
- Watchlist and purchase management
- Admin panel for managing listings, users, and approvals
- Stripe payment integration for transaction flow
- AI-assisted vehicle description generation using Google Gemini API
- Responsive modern user interface for desktop and mobile devices

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Socket.IO
- Stripe API
- Google Gemini API

## System Modules

### Buyer Module
Buyers can browse available vehicles, join live auctions, place bids, add vehicles to a watchlist, and purchase vehicles through direct buy or successful bidding.

### Seller Module
Sellers can submit vehicle listings, provide technical details and photos, set auction conditions, and monitor the performance of their listed vehicles.

### Admin Module
Admins can review vehicle listings, manage KYC verification, oversee user activity, and monitor overall platform operations through a dedicated dashboard.

### Auction Module
The auction module handles real-time bidding, live updates, bid history tracking, and auction-end logic.

### Transaction Module
The transaction module manages payment workflows, escrow-related logic, and purchase handling using Stripe integration.

## How the System Works

1. A seller registers and submits a vehicle listing.
2. The admin reviews and approves the listing.
3. Buyers can browse the vehicle and either:
   - place bids in a live auction, or
   - purchase directly if direct buy is enabled.
4. Real-time updates are sent through Socket.IO during auction activity.
5. Payment and transaction details are processed through the platform workflow.
6. Users can manage their activity through personalized dashboards.

## Project Structure

```bash
AutoBid-Lanka/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── sockets/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md

Installation and Setup

Prerequisites

Make sure the following are installed on your machine:

* Node.js
* npm
* MongoDB Atlas account
* Stripe account
* Google AI Studio API key

1. Clone the Repository
git clone https://github.com/your-username/AutoBid-Lanka.git
cd AutoBid-Lanka

2. Setup Backend
cd backend
npm install

Creata .env file inside the backend folder and your enviroment veriables.

Example:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://127.0.0.1:6379
FRONTEND_URL=http://localhost:3000

SMTP_HOST=your_smtp_host
SMTP_PORT=2525
SMTP_EMAIL=your_smtp_email
SMTP_PASSWORD=your_smtp_password
FROM_EMAIL=noreply@example.com
FROM_NAME=AutoBid Lanka Support

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
GOOGLE_API_KEY=your_google_api_key

Run Backend:
npm run dev

3.setup Frontend 
open new terminal
cd frontend
npm install
npm run dev

Frontend will run on :
http://localhost:3000


Environment Variables

This project uses sensitive credentials for database access, authentication, AI services, and payment integration. These values are stored in .env files and are not included in the repository for security reasons.

Challenges Addressed

During development, several practical issues were addressed, including:

* managing secure API keys and environment configuration
* handling Stripe checkout validation issues
* integrating AI-generated content with fallback logic
* handling real-time bidding updates reliably
* maintaining separate user roles and protected routes
* designing a responsive and modern user interface

Future Improvements

Some future enhancements that could further improve the system include:

* advanced recommendation system for buyers
* deployment to production environment
* cloud image storage integration
* stronger payment escrow automation

Academic Context

This system was developed as a final year undergraduate project and demonstrates practical knowledge in:

* full-stack web development
* REST API development
* real-time systems
* database design
* secure authentication
* third-party API integration
* software project structuring

Author

Lakshitha Samaranayaka
Final Year Undergraduate
Software Engineering / Computing Project

License

This project is created for academic and educational purposes.

Final Note

AutoBid Lanka is more than a technical project; It is an attempt to bring structure, trust, and convenience into the local vehicle marketplace by using modern software engineering practices. The project reflects both the technical and practical challenges involved in building a real-world auction platform from scratch.