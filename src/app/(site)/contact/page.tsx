import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { QUERY_CONTACT_PAGE } from '@/app/queries/contactQuery'
import { ContactPage } from '@/app/components/ContactPage'
import type { ImageObject } from '@/app/lib/types/image'

export const metadata: Metadata = {
  title: 'Contact | Vanta Construction',
  description: 'Get in touch with Vanta Construction for all your renovation and construction needs.',
}

// Define the type for the query result
interface ContactPageData {
  contactPageTitle?: string;
  contactsPagebackgroundImage?: ImageObject;
  PhoneLabel?: string;
  PhoneNumber?: string;
  emailLabel?: string;
  emailAddress?: string;
  socialMediaLabel?: string;
  instagramIcon?: ImageObject;
  instagramLink?: string;
  facebookIcon?: ImageObject;
  facebookLink?: string;
}

export default async function Contact() {
  // Fetch contact page data with proper typing
  const data = await client.fetch<ContactPageData>(QUERY_CONTACT_PAGE);
  
  return (
    <ContactPage
      contactPageTitle={data?.contactPageTitle || "Contact us"}
      contactsPagebackgroundImage={data?.contactsPagebackgroundImage || null}
      PhoneLabel={data?.PhoneLabel || "Phone"}
      PhoneNumber={data?.PhoneNumber || "(613) 222 - 7147"}
      emailLabel={data?.emailLabel || "Email"}
      emailAddress={data?.emailAddress || "build@vantaconstruction.ca"}
      socialMediaLabel={data?.socialMediaLabel || "Social"}
      instagramIcon={data?.instagramIcon || null}
      instagramLink={data?.instagramLink || "https://instagram.com"}
      facebookIcon={data?.facebookIcon || null}
      facebookLink={data?.facebookLink || "https://facebook.com"}
    />
  );
}