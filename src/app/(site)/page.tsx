import Cta from "./components/Cta";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../../sanity/lib/live";





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
  const resCTAs  = await sanityFetch({query: QUERY_CTAs,});


 
 
  // Check if the CTA data is available
  if (!resCTAs || !resCTAs.data) {
    console.error("No data found in the response:", resCTAs);
    return <div>No CTA data available</div>;
  }

  
  const dataCTA = resCTAs.data; 

  
  // Check if the data is empty or undefined

  if (!dataCTA) {
    return <div>No CTA data available</div>;
  }
  


  // Destructure the data to get the CTAs

  const { reviewCTA, heroCTA, projectCTA,  viewReviewsCTA, submitReviewCTA, servicesCTA } = dataCTA;


  const arrayOfAllCTAs = [
    reviewCTA,
    heroCTA,
    projectCTA,
    viewReviewsCTA,
    submitReviewCTA,
    servicesCTA
  ];

  const normalizedCTAs = arrayOfAllCTAs.map((cta) => {
  if (!cta) return null;
  return {
    label: cta.linkLabel ?? undefined,
    linkType: cta.linkType ?? undefined,
    toPage: 'toPage' in cta ? cta.toPage ?? undefined : undefined,
    externalLink: 'externalLink' in cta ? cta.externalLink ?? undefined : undefined,
    toProjectSlug: 'toProjectSlug' in cta ? cta.toProjectSlug ?? undefined : undefined,
  };
});





  return (
  <div>
    {normalizedCTAs.map((cta, index) =>
      cta ? <Cta key={index} {...cta} /> : null
    )}
  </div>
  );
}

