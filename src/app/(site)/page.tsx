import Cta from "./components/Cta";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../../sanity/lib/live";
import { QUERY_LOGO } from './queries/QUERY_LOGO'
import { Navigation } from './components/Navigation'

const QUERY_NAV = defineQuery(`*[_type == "siteSettingsSingleton"][0]{
  homePageNavLabel,
  projectsPageNavLabel,
  aboutPageNavLabel,
  reviewsPageNavLabel,
  contactPageNavLabel,
  mobileBackgroundImage {
    ...,
    asset->{
      ...,
      metadata
    }
  }
}`)

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
  const { data: logo } = await sanityFetch({query: QUERY_LOGO });
  const { data: navData } = await sanityFetch({ query: QUERY_NAV })

 
 
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





  return (
    <div>
      <Navigation 
        logo={logo} 
        navLabels={navData} 
        mobileBackgroundImage={navData.mobileBackgroundImage}
      />


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

