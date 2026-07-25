import "./globals.css";

export const metadata = {
  title: "Maeum Gratitud",
  description: "Espacio de contemplación y pausa visual.",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased bg-white">{children}</body>
    </html>
  );
}