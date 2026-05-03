import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { Footer } from '@/components/Footer';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout {...baseOptions()}>
      <div
        className={`${GeistSans.className} ${GeistSans.variable} ${GeistMono.variable} home-page-font flex flex-col min-h-screen`}
      >
        {children}
        <Footer />
      </div>
    </HomeLayout>
  );
}
