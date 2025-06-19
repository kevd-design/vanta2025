import { defineQuery } from "next-sanity"
import { IMAGE_WITH_METADATA } from "./fragments/imageFragment"

export const QUERY_ABOUT_PAGE = defineQuery(`{
  "siteSettings": *[_type == "siteSettingsSingleton"][0]{
    aboutPageTitle,
    aboutPageHeroImage {${IMAGE_WITH_METADATA}}
  },
  "companySettings": *[_type == "companySettingsSingleton"][0]{
    slogan,
    aboutHistory,
    aboutMission,
    aboutFounder,
    founderImage {${IMAGE_WITH_METADATA}},
    aboutTeam,
    teamImage {${IMAGE_WITH_METADATA}}
  }
}`)