import Cta from "./components/Cta";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../../sanity/lib/live";


const QUERY = defineQuery(`*[_type == "siteSettingsSingleton"][0]{
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
  const res  = await sanityFetch({query: QUERY,});
 
 
  // Check if the data is available
  if (!res || !res.data) {
    console.error("No data found in the response:", res);
    return <div>No data available</div>;
  }

  
  const data = res.data;

  if (!data) {
    return <div>No data available</div>;
  }
  


  // Destructure the data to get the CTAs

  const { reviewCTA, heroCTA, projectCTA,  viewReviewsCTA, submitReviewCTA, servicesCTA } = data;


  const arrayOfAllCTAs = [
    reviewCTA,
    heroCTA,
    projectCTA,
    viewReviewsCTA,
    submitReviewCTA,
    servicesCTA
  ];



  return (
    <div>
      

      {/* Render all the CTAs */}
      
      {arrayOfAllCTAs.map((cta, index) => {
        if (cta) {
          return (
            <Cta
              key={index}
              label={cta.linkLabel ?? undefined}
              linkType={cta.linkType ?? undefined}
              toPage={cta.toPage ?? undefined}
              externalLink={cta.externalLink ?? undefined}
              toProjectSlug={cta.toProjectSlug ?? undefined}
            />
          );
        } else {
          return null; // or some fallback UI
        }
      }
      )}


    </div>
  );
}

