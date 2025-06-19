import { FC } from 'react'
import { ProfileSection } from '@/app/components/ProfileSection'
import type { ImageObject } from '@/app/lib/types/image'

interface AboutTeamProps {
  founderDescription: string | null
  founderImage: ImageObject | null
  teamDescription: string | null
  teamImage: ImageObject | null
}

export const AboutTeam: FC<AboutTeamProps> = ({
  founderDescription,
  founderImage,
  teamDescription,
  teamImage
}) => {
  return (
    <section className="bg-white">
      {/* Founder Section */}
      {(founderDescription || founderImage) && (
        <ProfileSection
          title="Our Founder"
          description={founderDescription}
          image={founderImage}
          isReversed={false}
        />
      )}
      
      {/* Team Section */}
      {(teamDescription || teamImage) && (
        <ProfileSection
          title="Our Team"
          description={teamDescription}
          image={teamImage}
          isReversed={true}
        />
      )}
    </section>
  )
}