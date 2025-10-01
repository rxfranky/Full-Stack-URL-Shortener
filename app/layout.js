import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Providers from '@/root-components/providers';
import { GoogleOAuthProvider } from '@react-oauth/google';
import StoreProvider from '@/root-components/storeProvider';

import "./globals.css";


export const metadata = {
  title: "URL-Shortner",
  description: "This is best URL-Shortner",
};


export default async function RootLayout({ children }) {

  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={'antialiased'}>

        <Providers session={session}>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            <StoreProvider>
              {children}
            </StoreProvider>
          </GoogleOAuthProvider>
        </Providers>
      </body>
    </html>
  );
}
