import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "../context/Web3Provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TrustWork - Decentralized Freelance Platform",
  description: "A blockchain-based freelance platform with escrow functionality",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {children}
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Web3Provider>
      </body>
    </html>
  );
}
