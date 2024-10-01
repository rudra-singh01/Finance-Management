import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import './globals.css';
import { Lilita_One } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const lilitaOne = Lilita_One({
  weight: '400',
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={lilitaOne.className}>
        <body className={lilitaOne.className}>
          <header style={{ display: 'none', justifyContent: 'flex-end', padding: '10px' }}>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <main>{children}</main>
          <Toaster/>
        </body>
      </html>
    </ClerkProvider>
  );
}
