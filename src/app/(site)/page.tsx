import Cta from "./components/Cta";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../../sanity/lib/live";


const QUERY = defineQuery(`*[
  _type == "siteSettingsSingleton"
  ]`); 

export default async function Home() {

  // Fetch the data from Sanity
  const data  = await sanityFetch({query: QUERY,});
  const heroData = data.data[0]?.heroCTA;
  
  // Check if the data is available
  if (!data || !data.data || !data.data[0]) {
    return <div>No data available</div>;
  }
  
  const linkLabel = heroData.linkLabel;

  
  return (
    <div>
      
      <Cta
        label ={linkLabel}
      />

    </div>
  );
}
