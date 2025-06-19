'use client'

import { FC } from 'react'
import { PageBackground } from '@/app/components/common/PageBackground'
import { ContactPageBackground } from '@/app/components/ContactPageBackground'
import { ContactInfoCard } from '@/app/components/common/ContactInfoCard'
import type { ImageObject } from '@/app/lib/types/image'

interface ContactPageProps {
  contactPageTitle?: string;
  contactsPagebackgroundImage?: ImageObject | null;
  PhoneLabel?: string;
  PhoneNumber?: string;
  emailLabel?: string;
  emailAddress?: string;
  socialMediaLabel?: string;
  instagramIcon?: ImageObject | null;
  instagramLink?: string;
  facebookIcon?: ImageObject | null;
  facebookLink?: string;
}

export const ContactPage: FC<ContactPageProps> = ({
  contactPageTitle = "Contact us",
  contactsPagebackgroundImage,
  PhoneLabel = "Phone",
  PhoneNumber,
  emailLabel = "Email",
  emailAddress,
  socialMediaLabel = "Social",
  instagramIcon,
  instagramLink,
  facebookIcon,
  facebookLink
}) => {
  // Get LQIP for background image
  const backgroundLqip = contactsPagebackgroundImage?.asset?.metadata?.lqip ?? undefined;
  
  // Format phone number for tel: link
  const formattedPhoneNumber = PhoneNumber ? PhoneNumber.replace(/[^0-9+]/g, '') : '';
  
  return (
    <PageBackground
      backgroundImage={contactsPagebackgroundImage}
      backgroundComponent={ContactPageBackground}
      lqip={backgroundLqip}
    >
      {/* Content */}
      <div className="py-48 min-h-screen flex items-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-lg mx-auto">
            {/* Page Title */}
            <h1 className="font-display text-4xl lg:text-5xl text-gray-900 mb-12 text-center">
              {contactPageTitle}
            </h1>
            
            {/* Contact Cards - Stacked with alternating colors */}
            <div className="space-y-6 md:space-y-8">
              {/* Phone Card */}
              {PhoneNumber && (
                <ContactInfoCard
                  label={PhoneLabel || "Phone"}
                  content={PhoneNumber}
                  variant="emerald"
                  link={`tel:${formattedPhoneNumber}`}
                />
              )}
              
              {/* Email Card */}
              {emailAddress && (
                <ContactInfoCard
                  label={emailLabel || "Email"}
                  content={emailAddress}
                  variant="white"
                  link={`mailto:${emailAddress}`}
                />
              )}
              
              {/* Social Media Card */}
              {(instagramIcon || facebookIcon) && (
                <ContactInfoCard
                  label={socialMediaLabel || "Social"}
                  content=""
                  variant="emerald"
                  icon={instagramIcon}
                  iconAlt="Instagram"
                  link={instagramLink}
                  showSecondIcon={!!facebookIcon}
                  secondIcon={facebookIcon}
                  secondIconAlt="Facebook"
                  secondLink={facebookLink}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}