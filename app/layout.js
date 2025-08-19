import "./global.css";
import Header from "../components/header.jsx";
import Footer from "../components/Footer";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "NutriJoy",
  description: "Healthy eating made simple and joyful.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800">
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
