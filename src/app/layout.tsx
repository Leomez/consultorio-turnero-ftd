import type { Metadata } from "next";
import { AuthProvider } from "./providers/AuthProvider";
import "./globals.css";




export const metadata: Metadata = {
  title: "Consultorio Odontológico",
  description: "Sistema de gestión para consultorios odontológicos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`antialiased flex h-screen bg-gray-100 text-gray-900`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
