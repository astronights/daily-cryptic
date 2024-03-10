import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Cryptle',
  description: 'Cryptic Crossword Daily Word Game',
}

export const RootLayout = ({ children, }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
                <meta name="theme-color" content="#000000" />
                <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
            </head>
            <body>
                <noscript>You need to enable JavaScript to run this app.</noscript>
                <div id="root">{children}</div>
            </body>
        </html>
    )
}