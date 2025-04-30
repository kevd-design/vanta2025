import ArrowRight from "../elements/ArrowRight";
import Link from "next/link";

export default function Cta({
  label,
  toPage,
  linkType,
  externalLink,
  // projectSlug,

}: {
  label?: string;
  linkType?: string;
  toPage?: string;
  externalLink?: string;
}) {

  

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

  
}