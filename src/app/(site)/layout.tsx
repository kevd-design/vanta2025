import { SanityLive } from "@/sanity/lib/live";
import { sanityFetch } from "@/sanity/lib/live";
import { QUERY_LOGO } from '@/app/queries/logoQuery';
import { QUERY_NAV } from '@/app/queries/navQuery';
import { Navigation } from '@/app/components/Navigation';
import { Footer } from '@/app/components/Footer';
import { DebugProvider } from '@/debug'
import { DebugLayoutProvider } from '@/debug'
import { DebugKeyboardProvider } from '@/debug'
import { DebugLayout } from '@/debug'
import { ColorMapProvider } from '@/app/context/ColorMapContext'
import type { LogoType, NavLabelsType } from '@/app/lib/types/components/navigation';
import type { ImageObject } from '@/app/lib/types/image';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { data: logo } = await sanityFetch({ query: QUERY_LOGO });
  const { data: navData } = await sanityFetch({ query: QUERY_NAV });


if (!logo || !navData) {
  return <div>A logo or menu labels are missing. Please check Sanity content.</div>;
}


  return (
    <DebugProvider>
      <DebugLayoutProvider>
        <ColorMapProvider>
          <DebugKeyboardProvider>
            <DebugLayout>
              <div className="flex flex-col min-h-screen">
                <Navigation
                  logo={logo as LogoType}
                  navLabels={navData as NavLabelsType}
                  mobileBackgroundImage={navData.mobileBackgroundImage as ImageObject | undefined}
                />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer 
                  displayCopyright={navData.displayCopyright || false}
                  textBeforeCopyright={navData.textBeforeCopyright}
                  copyrightText={navData.copyrightText}
                  copyrightYear={navData.copyrightYear || false}
                  textAfterCopyright={navData.textAfterCopyright}
                />
                <SanityLive />
              </div>
            </DebugLayout>
          </DebugKeyboardProvider>
        </ColorMapProvider>
      </DebugLayoutProvider>
    </DebugProvider>
  );
}
