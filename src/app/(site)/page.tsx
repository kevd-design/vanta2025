// import Cta from "./components/common/Cta";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../../sanity/lib/live";
import { Hero } from './components/Hero'
import { QUERY_HOME } from './queries/homeQuery';





const QUERY_CTAs = defineQuery(`*[_type == "siteSettingsSingleton"][0]{
  reviewCTA,
  heroCTA,
  viewReviewsCTA,
  submitReviewCTA,
  servicesCTA,
  projectCTA {
    // keep all the normal CTA fields…
    linkLabel, linkType,
    // then pull in the referenced page’s slug
    "toProjectSlug": toProject->projectSlug.current,
   
  }
}`);








export default async function Home() {


    // Fetch the data from Sanity
  const resCTAs = await sanityFetch({ query: QUERY_CTAs });
  const resHome = await sanityFetch({ query: QUERY_HOME });

  // Check if both data sets are available
  if (!resCTAs?.data || !resHome?.data) {
    console.error("Missing data in response:", { resCTAs, resHome });
    return <div>No data available</div>;
  }

  // const dataCTA = resCTAs.data;
  const { hero } = resHome.data;

  console.log("hero data", hero);

  


//   // Destructure the data to get the CTAs

//   const { reviewCTA, heroCTA, projectCTA,  viewReviewsCTA, submitReviewCTA, servicesCTA } = dataCTA;


//   const arrayOfAllCTAs = [
//     reviewCTA,
//     heroCTA,
//     projectCTA,
//     viewReviewsCTA,
//     submitReviewCTA,
//     servicesCTA
//   ];

//   const normalizedCTAs = arrayOfAllCTAs.map((cta) => {
//   if (!cta) return null;
//   return {
//     label: cta.linkLabel ?? undefined,
//     linkType: cta.linkType ?? undefined,
//     toPage: 'toPage' in cta ? cta.toPage ?? undefined : undefined,
//     externalLink: 'externalLink' in cta ? cta.externalLink ?? undefined : undefined,
//     toProjectSlug: 'toProjectSlug' in cta ? cta.toProjectSlug ?? undefined : undefined,
//   };
// });

if (!hero.image) return null;

  return (

    <main>
      <Hero
        image={hero.image}
        headline={hero.headline}
        cta={hero.cta}
      />
            {/* {normalizedCTAs.map((cta, index) =>
        cta ? <Cta key={index} {...cta} /> : null
      )} */}
    </main>

  );
}

