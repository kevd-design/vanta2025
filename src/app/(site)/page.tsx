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
    ...,
    // then pull in the referenced page’s slug
    "toPage": toPage->{
      _id,
      title,
      "slug": slug.current
    }
  }
}`); 


export default async function Home() {

  // Fetch the data from Sanity
  const res  = await sanityFetch({query: QUERY,});
 
  // Check if the data is available

  const data = res.data[0];

  if (!data) {
    return <div>No data available</div>;
  }
  
  // Destructure the data to get the CTAs

  const { reviewCTA, heroCTA, viewReviewsCTA, submitReviewCTA, servicesCTA, projectCTA  } = data;
  
  const arrayOfCtas = [reviewCTA, heroCTA, viewReviewsCTA, submitReviewCTA, servicesCTA, projectCTA];
  console.log(arrayOfCtas)

  

  return (
    <div>
      {/* Render the CTAs */}
      {arrayOfCtas.map((cta, index) => (
        <Cta
          key={index}
          label={cta && cta.linkLabel}
          toPage={cta && cta.toPage}
          externalLink={cta && cta.externalLink}
        />
      ))}



    </div>
  );
}
