import ArrowRight from "../elements/ArrowRight";
import Link from "next/link";

import type { CtaProps } from '../../types';

export default function Cta({
  label,
  toPage,
  linkType,
  externalLink,
  toProjectSlug


}: CtaProps) {

  

  if(linkType === "externalLink" && externalLink) {
    return (
      <a
        className="m-8 flex justify-between items-center gap-2"
        href={externalLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="text-lg">{label}</div> <ArrowRight />
      </a>
    );
  }


  if(linkType === "toPage" && toPage) {
    return (
      <Link 
         className="m-8 flex justify-between items-center gap-2"
         href={`/${toPage}`}
      >
      <div className="text-lg">{label}</div> <ArrowRight />
      </Link>
    );
  }

  if(linkType === "toProject" && toProjectSlug) {
    return (
      <Link 
         className="m-8 flex justify-between items-center gap-2"
         href={`projects/${toProjectSlug}`}
      >
      <div className="text-lg">{label}</div> <ArrowRight />
      </Link>
    );
  }

  
}