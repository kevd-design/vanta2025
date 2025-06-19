import { defineQuery } from "next-sanity"
import { IMAGE_WITH_METADATA } from "./fragments/imageFragment"

export const QUERY_CONTACT_PAGE = defineQuery(`*[_type == "siteSettingsSingleton"][0]{
  contactPageTitle,
  contactsPagebackgroundImage {${IMAGE_WITH_METADATA}},
  PhoneLabel,
  PhoneNumber,
  emailLabel,
  emailAddress,
  socialMediaLabel,
  instagramIcon {${IMAGE_WITH_METADATA}},
  instagramLink,
  facebookIcon {${IMAGE_WITH_METADATA}},
  facebookLink
}`)