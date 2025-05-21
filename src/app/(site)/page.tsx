
import { sanityFetch } from "../../sanity/lib/live";
import { Hero } from './components/Hero'
import { QUERY_HOME } from './queries/homeQuery';
import type { imageType, CTAType } from '../types'



export default async function Home() {

    // Fetch the data from Sanity
  const res = await sanityFetch({ query: QUERY_HOME });

  console.log(res);
  const heroData = res.data
  if (!heroData) {
    return <div>Hero data is missing. Please check Sanity content.</div>;
  }


  return (

    <main>
      <Hero
        image={heroData.heroImage as imageType}
        headline={heroData.heroHeadline}
        cta={heroData.heroCTA as CTAType | null}
      />
    </main>

  );
}

