import '../styles/globals.css';
import Header from '../components/Header';
import Head from './head';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Head />
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
