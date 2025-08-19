// app/layout.js
import './globals.css';

export const metadata = {
  title: {
    default: 'LinkUnshorten - Check if Short Links Are Safe',
    template: '%s | LinkUnshorten'
  },
  description: 'Instantly expand and verify the safety of short links like bit.ly, tinyurl, t.co. Free tool to check if shortened URLs are phishing or malware.',
  keywords: 'unshorten link, bit.ly checker, tinyurl checker, is bit.ly safe, check short link, expand url, phishing checker, link safety',
  robots: 'index, follow',
  openGraph: {
    title: 'LinkUnshorten - See Where Short Links Really Go',
    description: 'Free tool to expand and check the safety of short links like bit.ly, tinyurl, and t.co.',
    url: 'https://linkunshorten.com',
    siteName: 'LinkUnshorten',
    images: [
      {
        url: 'https://linkunshorten.com/og-image.png', // Add your OG image later
        width: 1200,
        height: 630,
        alt: 'LinkUnshorten - Check Short Link Safety',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkUnshorten - Check Short Link Safety',
    description: 'See where bit.ly, tinyurl, and t.co links really go',
  },
  alternates: {
    canonical: 'https://linkunshorten.com',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}