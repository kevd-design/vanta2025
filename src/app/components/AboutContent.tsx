import { FC } from 'react'

interface AboutContentProps {
  slogan: string | null
  history: string | null
  mission: string | null
}

export const AboutContent: FC<AboutContentProps> = ({
  slogan,
  history,
  mission
}) => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {slogan && (
          <div className="mb-12 text-center">
            <p className="text-xl md:text-2xl text-emerald-800 italic">
              &ldquo;{slogan}&rdquo;
            </p>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-12">
          {history && (
            <div>
              <h2 className="text-2xl md:text-3xl font-display mb-4">Our History</h2>
              <div className="prose max-w-none">
                <p>{history}</p>
              </div>
            </div>
          )}
          
          {mission && (
            <div>
              <h2 className="text-2xl md:text-3xl font-display mb-4">Our Mission</h2>
              <div className="prose max-w-none">
                <p>{mission}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}