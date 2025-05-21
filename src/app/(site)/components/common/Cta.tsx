import ArrowRight from "../../elements/ArrowRight";
import Link from "next/link";

import type { CtaProps } from '../../../types';

export default function Cta({
  linkLabel,
  toPage,
  linkType,
  externalLink,
  toProjectSlug,
  className

}: CtaProps) {

  const classForAll = `flex justify-between items-center gap-2 ${className}`

  console.log('classForAll',classForAll)

  if(linkType === "externalLink" && externalLink) {
    return (
      <a
        className={classForAll}
        href={externalLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="text-lg">{linkLabel}</div> <ArrowRight />
      </a>
    );
  }


  if(linkType === "toPage" && toPage) {
    return (
      <Link 
         className={classForAll}
         href={`/${toPage}`}
      >
      <div className="text-lg">{linkLabel}</div> <ArrowRight />
      </Link>
    );
  }

  if(linkType === "toProject" && toProjectSlug) {
    return (
      <Link 
         className={classForAll}
         href={`projects/${toProjectSlug}`}
      >
      <div className="text-lg">{linkLabel}</div> <ArrowRight />
      </Link>
    );
  }

  
}