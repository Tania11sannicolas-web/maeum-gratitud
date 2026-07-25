import "./globals.css";

export const metadata = {
  title: "Maeum Gratitud",
  description: "Tu espacio de pausa visual",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased bg-white">{children}</body>
    </html>
  );
}