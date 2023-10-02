import { Nunito } from "next/font/google";
import Navbar from './components/navbar/Navbar';

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientOnly from "./components/ClientOnly";
import ToasterProvider from "./providers/ToasterProvider";
import getCurrentUser from "./actions/getCurrentUser";

import LoginModal from "./components/modals/LoginModal";
import RegisterModal from "./components/modals/RegisterModal";
import RentModal from "./components/modals/RentModal";
import SearchModal from "./components/modals/SearchModal";


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Airbnb clone',
  description: 'Airbnb practice',
}

const font = Nunito ({
  subsets: ["latin"]
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <LoginModal />
          <RegisterModal />
          <SearchModal />
          <RentModal />
          <Navbar currentUser={currentUser}/>
        </ClientOnly>
        <div className="pb-20 pt-28">
          {children}
        </div>
        </body>
    </html>
  )
}
