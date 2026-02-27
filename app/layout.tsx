import type { Metadata } from 'next';
import './ui/global.css';

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'Une application de gestion de tâches',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {children}
      </body>
    </html>
  );
}
