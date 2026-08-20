import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Event Platform",
  description: "Fan & artist event, ticketing, and social platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
