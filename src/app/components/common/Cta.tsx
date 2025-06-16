import Link from "next/link";
import ArrowRight from "@/app/elements/ArrowRight";
import type { CTAProps } from '@/app/lib/types/components/common';
import { useState } from "react";

export default function Cta({
  linkLabel,
  toPage,
  linkType,
  externalLink,
  toProjectSlug,
  className

}: CTAProps) {
  // State to track hover for arrow animation
  const [isHovered, setIsHovered] = useState(false);

  // Enhanced classes with subtle underline effect instead of background change
  const classForAll = `
    flex justify-between items-center gap-2 
    transition-all duration-300 ease-in-out
    relative group
    ${className}
  `;

  // CSS for arrow animation - kept subtle
  const arrowClasses = `transform transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`;

  // Underline element that will animate on hover and inherit text color
  const underlineElement = (
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current opacity-80 transition-all duration-300 group-hover:w-full"></span>
  );

  // Event handlers for hover state
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  if(linkType === "externalLink" && externalLink) {
    return (
      <a
        className={classForAll}
        href={externalLink}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="text-lg relative project-cta-text">
          {linkLabel}
          {underlineElement}
        </div> 
        <div className={arrowClasses}>
          <ArrowRight />
        </div>
      </a>
    );
  }


  if(linkType === "toPage" && toPage) {
    return (
      <Link 
         className={classForAll}
         href={`/${toPage}`}
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
      >
        <div className="text-lg relative project-cta-text">
          {linkLabel}
          {underlineElement}
        </div> 
        <div className={arrowClasses}>
          <ArrowRight />
        </div>
      </Link>
    );
  }

  if(linkType === "toProject" && toProjectSlug) {
    return (
      <Link 
         className={classForAll}
         href={`projects/${toProjectSlug}`}
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
      >
        <div className="text-lg relative project-cta-text">
          {linkLabel}
          {underlineElement}
        </div> 
        <div className={arrowClasses}>
          <ArrowRight />
        </div>
      </Link>
    );
  }
}