import type { Metadata, Viewport } from 'next';
import { Inter, Newsreader } from 'next/font/google';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const serif = Newsreader({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
    title: 'Cryptle',
    description: 'One cryptic crossword clue a day. Five guesses.',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#f6f4ef' },
        { media: '(prefers-color-scheme: dark)', color: '#121212' },
    ],
};

// Apply the saved theme before first paint to avoid a flash.
const themeScript = `try{var t=localStorage.getItem('cryptle_theme');if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body>{children}</body>
        </html>
    );
}
