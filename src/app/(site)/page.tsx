
import { sanityFetch } from "@/sanity/lib/live";
import { Hero } from '@/app/components/Hero'
import { QUERY_HOME } from '@/app/queries/homeQuery';
import type { CTAType } from '@/app/lib/types/content'
import type { ImageObject } from '@/app/lib/types/image';


export default async function Home() {

    // Fetch the data from Sanity
  const res = await sanityFetch({ query: QUERY_HOME });

  const heroData = res.data
  if (!heroData) {
    return <div>Hero data is missing. Please check Sanity content.</div>;
  }


  return (

    <main>
      <Hero
        image={heroData.heroImage as ImageObject | null}
        headline={heroData.heroHeadline}
        cta={heroData.heroCTA as CTAType | null}
      />
      <p>content</p>
    </main>

  );
}

