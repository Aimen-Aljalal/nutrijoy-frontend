# NutriJoy - Frontend

The frontend for **NutriJoy**, a nutrition tracking and meal planning app.  
This application allows users to calculate their ideal weight, BMI, and daily calories, plan meals, and track their nutrition history.  
Admins can manage meals and monitor users from a dedicated dashboard.

---

## Features
- User login & registration.
- Display ideal weight, BMI, and daily calorie needs.
- Meal list with calories per meal.
- Daily meal planning with history tracking.
- Admin dashboard:
  - Add meals.
  - View users and usage statistics.

---

## Tech Stack
- **Next.js 15**
- **React 19**
- **TailwindCSS** for styling
- **JWT** for authentication
- **mongoose** for database integration
- **lucide-react** for icons

---

## Installation

1. Clone the repository:
   git clone <your-frontend-repo-url>
   cd nutrijoy-frontend

2. Install dependencies:
npm install

3. Start the development server:
npm run dev

4. Build for production:
npm run build
npm start


**Backend Connection
Make sure the backend API is running and update the API URLs inside the frontend code if necessary.
You will need your JWT_SECRET and MONGO_URI set up in the backend first.