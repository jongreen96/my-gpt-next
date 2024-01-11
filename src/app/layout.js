import Navbar from '@/components/navbar';
import { ThemeProvider } from '@/components/themeProvider';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    template: 'My-GPT | %s',
    default: 'My-GPT',
  },
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={inter.className}>
          <ThemeProvider attribute='class' defaultTheme='light'>
            <Navbar />
            <div className='m-auto h-svh w-full pt-14 sm:pl-14 sm:pt-0'>
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
