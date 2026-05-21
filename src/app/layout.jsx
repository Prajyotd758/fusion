import "./globals.css";

export const metadata = {
  title: "Fusion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
