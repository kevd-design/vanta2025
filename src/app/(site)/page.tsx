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

const QUERY_LOGO = defineQuery(`*[_type == "companySettingsSingleton"][0]{
  logoForLightBG {
    asset->{
      ...,
      metadata
    }
  },
  logoForDarkBG{
    asset->{
      ...,
      metadata
    }
  },

}`) ;


export default async function Home() {

  // Fetch the data from Sanity
  const resCTAs  = await sanityFetch({query: QUERY_CTAs,});
  const resLogo = await sanityFetch({query: QUERY_LOGO,});

  console.log("resLogo", resLogo);
 
 
  // Check if the CTA data is available
  if (!resCTAs || !resCTAs.data) {
    console.error("No data found in the response:", resCTAs);
    return <div>No CTA data available</div>;
  }

  // Check if the logo data is available
  if (!resLogo || !resLogo.data) {
    console.error("No data found in the response:", resLogo);
    return <div>No RES data available</div>;
  }
  
  const dataCTA = resCTAs.data; 
  const dataLogo = resLogo.data;
  
  // Check if the data is empty or undefined
  if (!dataLogo) {
    return <div>No logo data available</div>;
  }

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
          return null;
        }
      }
      )}


    </div>
  );
}

