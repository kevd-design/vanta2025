
import { SanityLive } from "@/sanity/lib/live";
import { sanityFetch } from "../../sanity/lib/live";
import { QUERY_LOGO } from './queries/logoQuery';
import { QUERY_NAV } from './queries/navQuery';
import { Navigation } from './components/Navigation';
import type { LogoType, NavLabelsType, SanityImageObject } from '../types'
import { DebugProvider } from '@/debug'
import { DebugLayoutProvider } from '@/debug'
import { DebugKeyboardProvider } from '@/debug'
import { DebugLayout } from '@/debug'
import { ColorMapProvider } from './context/ColorMapContext'

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
              <Navigation
                logo={logo as LogoType}
                navLabels={navData as NavLabelsType}
                mobileBackgroundImage={navData.mobileBackgroundImage as SanityImageObject | undefined}
              />
                {children}
                <SanityLive />
              </DebugLayout>
            </DebugKeyboardProvider>
          </ColorMapProvider>
      </DebugLayoutProvider>
    </DebugProvider>
  );
}
