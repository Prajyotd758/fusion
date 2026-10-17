import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  metadataBase: new URL("https://arceus.ind.in"),
  title: {
    default: "AirGrip Air Mouse | Arceus AI",
    template: "%s | Arceus",
  },
  description:
    "AirGrip is a gyroscopic USB-dongle air mouse with push-to-talk voice. Arceus is the AI desktop agent for Windows.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Arceus",
    url: "https://arceus.ind.in",
    images: ["/og.png"],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Arceus",
  url: "https://arceus.ind.in",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '15492254414992630');
fbq('track', 'PageView');
`,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=15492254414992630&ev=PageView&noscript=1"
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
