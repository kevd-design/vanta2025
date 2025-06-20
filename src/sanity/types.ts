/**
 * ---------------------------------------------------------------------------------
 * This file has been generated by Sanity TypeGen.
 * Command: `sanity typegen generate`
 *
 * Any modifications made directly to this file will be overwritten the next time
 * the TypeScript definitions are generated. Please make changes to the Sanity
 * schema definitions and/or GROQ queries if you need to update these types.
 *
 * For more information on how to use Sanity TypeGen, visit the official documentation:
 * https://www.sanity.io/docs/sanity-typegen
 * ---------------------------------------------------------------------------------
 */

// Source: schema.json
export type CTA = {
  _type: "CTA";
  linkLabel?: string;
  linkType?: "toProject" | "toPage" | "externalLink";
  toProject?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "project";
  };
  toPage?: "home" | "projects" | "about" | "reviews" | "contact";
  externalLink?: string;
};

export type SiteSettingsSingleton = {
  _id: string;
  _type: "siteSettingsSingleton";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  homePageNavLabel?: string;
  projectsPageNavLabel?: string;
  aboutPageNavLabel?: string;
  reviewsPageNavLabel?: string;
  contactPageNavLabel?: string;
  mobileBackgroundImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  };
  displayCopyright?: boolean;
  textBeforeCopyright?: string;
  copyrightText?: string;
  copyrightYear?: boolean;
  textAfterCopyright?: string;
  Sitetitle?: string;
  description?: string;
  heroHeadline?: string;
  heroImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  };
  heroCTA?: {
    linkLabel?: string;
    linkType?: "toProject" | "toPage" | "externalLink";
    toProject?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "project";
    };
    toPage?: "home" | "projects" | "about" | "reviews" | "contact";
    externalLink?: string;
  };
  projectCTA?: {
    linkLabel?: string;
    linkType?: "toProject" | "toPage" | "externalLink";
    toProject?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "project";
    };
    toPage?: "home" | "projects" | "about" | "reviews" | "contact";
    externalLink?: string;
  };
  servicesTitle?: string;
  servicesDescription?: string;
  backgroundImageServices?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  };
  servicesCTA?: {
    linkLabel?: string;
    linkType?: "toProject" | "toPage" | "externalLink";
    toProject?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "project";
    };
    toPage?: "home" | "projects" | "about" | "reviews" | "contact";
    externalLink?: string;
  };
  reviewerName?: string;
  reviewText?: string;
  reviewCTA?: {
    linkLabel?: string;
    linkType?: "toProject" | "toPage" | "externalLink";
    toProject?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "project";
    };
    toPage?: "home" | "projects" | "about" | "reviews" | "contact";
    externalLink?: string;
  };
  projectIndexPageTitle?: string;
  projectIndexPageDescription?: string;
  gallaryTitle?: string;
  aboutPageTitle?: string;
  aboutPageHeroImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  };
  reviewPageTitle?: string;
  reviewPageBackgroundImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  };
  reviewPageDescriptiveImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  };
  reviewPageSummary?: string;
  viewReviewsCTA?: {
    linkLabel?: string;
    linkType?: "toProject" | "toPage" | "externalLink";
    toProject?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "project";
    };
    toPage?: "home" | "projects" | "about" | "reviews" | "contact";
    externalLink?: string;
  };
  submitReviewTitle?: string;
  submitReviewInvitation?: string;
  submitReviewCTA?: {
    linkLabel?: string;
    linkType?: "toProject" | "toPage" | "externalLink";
    toProject?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "project";
    };
    toPage?: "home" | "projects" | "about" | "reviews" | "contact";
    externalLink?: string;
  };
  contactPageTitle?: string;
  contactsPagebackgroundImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  };
  PhoneLabel?: string;
  PhoneNumber?: string;
  emailLabel?: string;
  emailAddress?: string;
  socialMediaLabel?: string;
  instagramIcon?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  };
  instagramLink?: string;
  facebookIcon?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  };
  facebookLink?: string;
};

export type Project = {
  _id: string;
  _type: "project";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  projectName?: string;
  projectSlug?: Slug;
  projectDescription?: string;
  projectImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  };
  projectGallery?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
    _key: string;
  }>;
  projectNeighbourhood?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "neighbourhood";
  };
};

export type Neighbourhood = {
  _id: string;
  _type: "neighbourhood";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
};

export type PageNamesSingleton = {
  _id: string;
  _type: "pageNamesSingleton";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  rootPgName?: string;
  rootPgNameShort?: string;
  rootPgNameSlug?: string;
  projectsPgName?: string;
  projectsPgNameShort?: string;
  projectsPgNameSlug?: string;
  aboutPgName?: string;
  aboutPgNameShort?: string;
  aboutPgNameSlug?: string;
  reviewPgName?: string;
  reviewPgShort?: string;
  reviewPgSlug?: string;
  contactPgName?: string;
  contactPgNameShort?: string;
  contactPgNameSlug?: string;
};

export type CompanySettingsSingleton = {
  _id: string;
  _type: "companySettingsSingleton";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  logoForLightBG?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  };
  logoForDarkBG?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  };
  slogan?: string;
  aboutHistory?: string;
  aboutMission?: string;
  aboutFounder?: string;
  founderImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  };
  aboutTeam?: string;
  teamImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  };
};

export type ImageWithMetadata = {
  _type: "imageWithMetadata";
  asset?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
  };
  media?: unknown;
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
  decorative?: boolean;
  changed?: boolean;
};

export type MediaTag = {
  _id: string;
  _type: "media.tag";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: Slug;
};

export type SanityImagePaletteSwatch = {
  _type: "sanity.imagePaletteSwatch";
  background?: string;
  foreground?: string;
  population?: number;
  title?: string;
};

export type SanityImagePalette = {
  _type: "sanity.imagePalette";
  darkMuted?: SanityImagePaletteSwatch;
  lightVibrant?: SanityImagePaletteSwatch;
  darkVibrant?: SanityImagePaletteSwatch;
  vibrant?: SanityImagePaletteSwatch;
  dominant?: SanityImagePaletteSwatch;
  lightMuted?: SanityImagePaletteSwatch;
  muted?: SanityImagePaletteSwatch;
};

export type SanityImageDimensions = {
  _type: "sanity.imageDimensions";
  height?: number;
  width?: number;
  aspectRatio?: number;
};

export type SanityImageHotspot = {
  _type: "sanity.imageHotspot";
  x?: number;
  y?: number;
  height?: number;
  width?: number;
};

export type SanityImageCrop = {
  _type: "sanity.imageCrop";
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type SanityFileAsset = {
  _id: string;
  _type: "sanity.fileAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  source?: SanityAssetSourceData;
};

export type SanityImageAsset = {
  _id: string;
  _type: "sanity.imageAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  metadata?: SanityImageMetadata;
  source?: SanityAssetSourceData;
};

export type SanityImageMetadata = {
  _type: "sanity.imageMetadata";
  location?: Geopoint;
  dimensions?: SanityImageDimensions;
  palette?: SanityImagePalette;
  lqip?: string;
  blurHash?: string;
  hasAlpha?: boolean;
  isOpaque?: boolean;
};

export type Geopoint = {
  _type: "geopoint";
  lat?: number;
  lng?: number;
  alt?: number;
};

export type Slug = {
  _type: "slug";
  current?: string;
  source?: string;
};

export type SanityAssetSourceData = {
  _type: "sanity.assetSourceData";
  name?: string;
  id?: string;
  url?: string;
};

export type AllSanitySchemaTypes = CTA | SiteSettingsSingleton | Project | Neighbourhood | PageNamesSingleton | CompanySettingsSingleton | ImageWithMetadata | MediaTag | SanityImagePaletteSwatch | SanityImagePalette | SanityImageDimensions | SanityImageHotspot | SanityImageCrop | SanityFileAsset | SanityImageAsset | SanityImageMetadata | Geopoint | Slug | SanityAssetSourceData;
export declare const internalGroqTypeReferenceTo: unique symbol;
// Source: ./src/app/queries/aboutQuery.ts
// Variable: QUERY_ABOUT_PAGE
// Query: {  "siteSettings": *[_type == "siteSettingsSingleton"][0]{    aboutPageTitle,    aboutPageHeroImage {  ...,  asset->{    ...,    metadata  }}  },  "companySettings": *[_type == "companySettingsSingleton"][0]{    slogan,    aboutHistory,    aboutMission,    aboutFounder,    founderImage {  ...,  asset->{    ...,    metadata  }},    aboutTeam,    teamImage {  ...,  asset->{    ...,    metadata  }}  }}
export type QUERY_ABOUT_PAGEResult = {
  siteSettings: {
    aboutPageTitle: string | null;
    aboutPageHeroImage: {
      asset: {
        _id: string;
        _type: "sanity.imageAsset";
        _createdAt: string;
        _updatedAt: string;
        _rev: string;
        originalFilename?: string;
        label?: string;
        title?: string;
        description?: string;
        altText?: string;
        sha1hash?: string;
        extension?: string;
        mimeType?: string;
        size?: number;
        assetId?: string;
        uploadId?: string;
        path?: string;
        url?: string;
        metadata: SanityImageMetadata | null;
        source?: SanityAssetSourceData;
      } | null;
      media?: unknown;
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      decorative?: boolean;
      changed?: boolean;
      _type: "imageWithMetadata";
    } | null;
  } | null;
  companySettings: {
    slogan: string | null;
    aboutHistory: string | null;
    aboutMission: string | null;
    aboutFounder: string | null;
    founderImage: {
      asset: {
        _id: string;
        _type: "sanity.imageAsset";
        _createdAt: string;
        _updatedAt: string;
        _rev: string;
        originalFilename?: string;
        label?: string;
        title?: string;
        description?: string;
        altText?: string;
        sha1hash?: string;
        extension?: string;
        mimeType?: string;
        size?: number;
        assetId?: string;
        uploadId?: string;
        path?: string;
        url?: string;
        metadata: SanityImageMetadata | null;
        source?: SanityAssetSourceData;
      } | null;
      media?: unknown;
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      decorative?: boolean;
      changed?: boolean;
      _type: "imageWithMetadata";
    } | null;
    aboutTeam: string | null;
    teamImage: {
      asset: {
        _id: string;
        _type: "sanity.imageAsset";
        _createdAt: string;
        _updatedAt: string;
        _rev: string;
        originalFilename?: string;
        label?: string;
        title?: string;
        description?: string;
        altText?: string;
        sha1hash?: string;
        extension?: string;
        mimeType?: string;
        size?: number;
        assetId?: string;
        uploadId?: string;
        path?: string;
        url?: string;
        metadata: SanityImageMetadata | null;
        source?: SanityAssetSourceData;
      } | null;
      media?: unknown;
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      decorative?: boolean;
      changed?: boolean;
      _type: "imageWithMetadata";
    } | null;
  } | null;
};

// Source: ./src/app/queries/contactQuery.ts
// Variable: QUERY_CONTACT_PAGE
// Query: *[_type == "siteSettingsSingleton"][0]{  contactPageTitle,  contactsPagebackgroundImage {  ...,  asset->{    ...,    metadata  }},  PhoneLabel,  PhoneNumber,  emailLabel,  emailAddress,  socialMediaLabel,  instagramIcon {  ...,  asset->{    ...,    metadata  }},  instagramLink,  facebookIcon {  ...,  asset->{    ...,    metadata  }},  facebookLink}
export type QUERY_CONTACT_PAGEResult = {
  contactPageTitle: string | null;
  contactsPagebackgroundImage: {
    asset: {
      _id: string;
      _type: "sanity.imageAsset";
      _createdAt: string;
      _updatedAt: string;
      _rev: string;
      originalFilename?: string;
      label?: string;
      title?: string;
      description?: string;
      altText?: string;
      sha1hash?: string;
      extension?: string;
      mimeType?: string;
      size?: number;
      assetId?: string;
      uploadId?: string;
      path?: string;
      url?: string;
      metadata: SanityImageMetadata | null;
      source?: SanityAssetSourceData;
    } | null;
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  } | null;
  PhoneLabel: string | null;
  PhoneNumber: string | null;
  emailLabel: string | null;
  emailAddress: string | null;
  socialMediaLabel: string | null;
  instagramIcon: {
    asset: {
      _id: string;
      _type: "sanity.imageAsset";
      _createdAt: string;
      _updatedAt: string;
      _rev: string;
      originalFilename?: string;
      label?: string;
      title?: string;
      description?: string;
      altText?: string;
      sha1hash?: string;
      extension?: string;
      mimeType?: string;
      size?: number;
      assetId?: string;
      uploadId?: string;
      path?: string;
      url?: string;
      metadata: SanityImageMetadata | null;
      source?: SanityAssetSourceData;
    } | null;
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  } | null;
  instagramLink: string | null;
  facebookIcon: {
    asset: {
      _id: string;
      _type: "sanity.imageAsset";
      _createdAt: string;
      _updatedAt: string;
      _rev: string;
      originalFilename?: string;
      label?: string;
      title?: string;
      description?: string;
      altText?: string;
      sha1hash?: string;
      extension?: string;
      mimeType?: string;
      size?: number;
      assetId?: string;
      uploadId?: string;
      path?: string;
      url?: string;
      metadata: SanityImageMetadata | null;
      source?: SanityAssetSourceData;
    } | null;
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  } | null;
  facebookLink: string | null;
} | null;

// Source: ./src/app/queries/homeQuery.ts
// Variable: QUERY_HOME
// Query: *[_type == "siteSettingsSingleton"][0]{  // Hero section  heroCTA,  heroHeadline,  heroImage {  ...,  asset->{    ...,    metadata  }},    // Project section  projectCTA {    ...,    "project": toProject-> {      _id,      projectName,      projectSlug,      projectImage {  ...,  asset->{    ...,    metadata  }}    }  },    // Services section  servicesTitle,  servicesDescription,  backgroundImageServices {  ...,  asset->{    ...,    metadata  }},  servicesCTA,    // Review section  reviewerName,  reviewText,  reviewCTA}
export type QUERY_HOMEResult = {
  heroCTA: {
    linkLabel?: string;
    linkType?: "externalLink" | "toPage" | "toProject";
    toProject?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "project";
    };
    toPage?: "about" | "contact" | "home" | "projects" | "reviews";
    externalLink?: string;
  } | null;
  heroHeadline: string | null;
  heroImage: {
    asset: {
      _id: string;
      _type: "sanity.imageAsset";
      _createdAt: string;
      _updatedAt: string;
      _rev: string;
      originalFilename?: string;
      label?: string;
      title?: string;
      description?: string;
      altText?: string;
      sha1hash?: string;
      extension?: string;
      mimeType?: string;
      size?: number;
      assetId?: string;
      uploadId?: string;
      path?: string;
      url?: string;
      metadata: SanityImageMetadata | null;
      source?: SanityAssetSourceData;
    } | null;
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  } | null;
  projectCTA: {
    linkLabel?: string;
    linkType?: "externalLink" | "toPage" | "toProject";
    toProject?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "project";
    };
    toPage?: "about" | "contact" | "home" | "projects" | "reviews";
    externalLink?: string;
    project: {
      _id: string;
      projectName: string | null;
      projectSlug: Slug | null;
      projectImage: {
        asset: {
          _id: string;
          _type: "sanity.imageAsset";
          _createdAt: string;
          _updatedAt: string;
          _rev: string;
          originalFilename?: string;
          label?: string;
          title?: string;
          description?: string;
          altText?: string;
          sha1hash?: string;
          extension?: string;
          mimeType?: string;
          size?: number;
          assetId?: string;
          uploadId?: string;
          path?: string;
          url?: string;
          metadata: SanityImageMetadata | null;
          source?: SanityAssetSourceData;
        } | null;
        media?: unknown;
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        decorative?: boolean;
        changed?: boolean;
        _type: "imageWithMetadata";
      } | null;
    } | null;
  } | null;
  servicesTitle: string | null;
  servicesDescription: string | null;
  backgroundImageServices: {
    asset: {
      _id: string;
      _type: "sanity.imageAsset";
      _createdAt: string;
      _updatedAt: string;
      _rev: string;
      originalFilename?: string;
      label?: string;
      title?: string;
      description?: string;
      altText?: string;
      sha1hash?: string;
      extension?: string;
      mimeType?: string;
      size?: number;
      assetId?: string;
      uploadId?: string;
      path?: string;
      url?: string;
      metadata: SanityImageMetadata | null;
      source?: SanityAssetSourceData;
    } | null;
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  } | null;
  servicesCTA: {
    linkLabel?: string;
    linkType?: "externalLink" | "toPage" | "toProject";
    toProject?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "project";
    };
    toPage?: "about" | "contact" | "home" | "projects" | "reviews";
    externalLink?: string;
  } | null;
  reviewerName: string | null;
  reviewText: string | null;
  reviewCTA: {
    linkLabel?: string;
    linkType?: "externalLink" | "toPage" | "toProject";
    toProject?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "project";
    };
    toPage?: "about" | "contact" | "home" | "projects" | "reviews";
    externalLink?: string;
  } | null;
} | null;

// Source: ./src/app/queries/logoQuery.ts
// Variable: QUERY_LOGO
// Query: *[_type == "companySettingsSingleton"][0]{  logoForLightBG {  ...,  asset->{    ...,    metadata  }},  logoForDarkBG {  ...,  asset->{    ...,    metadata  }}}
export type QUERY_LOGOResult = {
  logoForLightBG: {
    asset: {
      _id: string;
      _type: "sanity.imageAsset";
      _createdAt: string;
      _updatedAt: string;
      _rev: string;
      originalFilename?: string;
      label?: string;
      title?: string;
      description?: string;
      altText?: string;
      sha1hash?: string;
      extension?: string;
      mimeType?: string;
      size?: number;
      assetId?: string;
      uploadId?: string;
      path?: string;
      url?: string;
      metadata: SanityImageMetadata | null;
      source?: SanityAssetSourceData;
    } | null;
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  } | null;
  logoForDarkBG: {
    asset: {
      _id: string;
      _type: "sanity.imageAsset";
      _createdAt: string;
      _updatedAt: string;
      _rev: string;
      originalFilename?: string;
      label?: string;
      title?: string;
      description?: string;
      altText?: string;
      sha1hash?: string;
      extension?: string;
      mimeType?: string;
      size?: number;
      assetId?: string;
      uploadId?: string;
      path?: string;
      url?: string;
      metadata: SanityImageMetadata | null;
      source?: SanityAssetSourceData;
    } | null;
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  } | null;
} | null;

// Source: ./src/app/queries/navQuery.ts
// Variable: QUERY_NAV
// Query: *[_type == "siteSettingsSingleton"][0]{  homePageNavLabel,  projectsPageNavLabel,  aboutPageNavLabel,  reviewsPageNavLabel,  contactPageNavLabel,  mobileBackgroundImage {  ...,  asset->{    ...,    metadata  }},    // Footer data  displayCopyright,  textBeforeCopyright,  copyrightText,  copyrightYear,  textAfterCopyright}
export type QUERY_NAVResult = {
  homePageNavLabel: string | null;
  projectsPageNavLabel: string | null;
  aboutPageNavLabel: string | null;
  reviewsPageNavLabel: string | null;
  contactPageNavLabel: string | null;
  mobileBackgroundImage: {
    asset: {
      _id: string;
      _type: "sanity.imageAsset";
      _createdAt: string;
      _updatedAt: string;
      _rev: string;
      originalFilename?: string;
      label?: string;
      title?: string;
      description?: string;
      altText?: string;
      sha1hash?: string;
      extension?: string;
      mimeType?: string;
      size?: number;
      assetId?: string;
      uploadId?: string;
      path?: string;
      url?: string;
      metadata: SanityImageMetadata | null;
      source?: SanityAssetSourceData;
    } | null;
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  } | null;
  displayCopyright: boolean | null;
  textBeforeCopyright: string | null;
  copyrightText: string | null;
  copyrightYear: boolean | null;
  textAfterCopyright: string | null;
} | null;

// Source: ./src/app/queries/projectQuery.ts
// Variable: QUERY_PROJECTS
// Query: *[  _type == "project" && defined(projectSlug.current)][0...12]{    _id,     projectName,     projectSlug,    projectImage {  ...,  asset->{    ...,    metadata  }}  }
export type QUERY_PROJECTSResult = Array<{
  _id: string;
  projectName: string | null;
  projectSlug: Slug | null;
  projectImage: {
    asset: {
      _id: string;
      _type: "sanity.imageAsset";
      _createdAt: string;
      _updatedAt: string;
      _rev: string;
      originalFilename?: string;
      label?: string;
      title?: string;
      description?: string;
      altText?: string;
      sha1hash?: string;
      extension?: string;
      mimeType?: string;
      size?: number;
      assetId?: string;
      uploadId?: string;
      path?: string;
      url?: string;
      metadata: SanityImageMetadata | null;
      source?: SanityAssetSourceData;
    } | null;
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  } | null;
}>;
// Variable: QUERY_PROJECT
// Query: *[  _type == "project" && projectSlug.current == $slug][0]{    _id,     projectName,     projectSlug,     projectDescription,    projectImage {  ...,  asset->{    ...,    metadata  }},    projectNeighbourhood->{      name    },    projectGallery[] {  ...,  asset->{    ...,    metadata  }}  }
export type QUERY_PROJECTResult = {
  _id: string;
  projectName: string | null;
  projectSlug: Slug | null;
  projectDescription: string | null;
  projectImage: {
    asset: {
      _id: string;
      _type: "sanity.imageAsset";
      _createdAt: string;
      _updatedAt: string;
      _rev: string;
      originalFilename?: string;
      label?: string;
      title?: string;
      description?: string;
      altText?: string;
      sha1hash?: string;
      extension?: string;
      mimeType?: string;
      size?: number;
      assetId?: string;
      uploadId?: string;
      path?: string;
      url?: string;
      metadata: SanityImageMetadata | null;
      source?: SanityAssetSourceData;
    } | null;
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  } | null;
  projectNeighbourhood: {
    name: string | null;
  } | null;
  projectGallery: Array<{
    asset: {
      _id: string;
      _type: "sanity.imageAsset";
      _createdAt: string;
      _updatedAt: string;
      _rev: string;
      originalFilename?: string;
      label?: string;
      title?: string;
      description?: string;
      altText?: string;
      sha1hash?: string;
      extension?: string;
      mimeType?: string;
      size?: number;
      assetId?: string;
      uploadId?: string;
      path?: string;
      url?: string;
      metadata: SanityImageMetadata | null;
      source?: SanityAssetSourceData;
    } | null;
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
    _key: string;
  }> | null;
} | null;
// Variable: QUERY_PROJECT_INDEX_METADATA
// Query: *[_type == "siteSettingsSingleton"][0]{  projectIndexPageTitle,  projectIndexPageDescription}
export type QUERY_PROJECT_INDEX_METADATAResult = {
  projectIndexPageTitle: string | null;
  projectIndexPageDescription: string | null;
} | null;

// Source: ./src/app/queries/reviewsQuery.ts
// Variable: QUERY_REVIEWS_PAGE
// Query: *[_type == "siteSettingsSingleton"][0]{  reviewPageTitle,  reviewPageBackgroundImage {  ...,  asset->{    ...,    metadata  }},  reviewPageDescriptiveImage {  ...,  asset->{    ...,    metadata  }},  reviewPageSummary,  viewReviewsCTA {    ...,  },  submitReviewTitle,  submitReviewInvitation,  submitReviewCTA {    ...,  }}
export type QUERY_REVIEWS_PAGEResult = {
  reviewPageTitle: string | null;
  reviewPageBackgroundImage: {
    asset: {
      _id: string;
      _type: "sanity.imageAsset";
      _createdAt: string;
      _updatedAt: string;
      _rev: string;
      originalFilename?: string;
      label?: string;
      title?: string;
      description?: string;
      altText?: string;
      sha1hash?: string;
      extension?: string;
      mimeType?: string;
      size?: number;
      assetId?: string;
      uploadId?: string;
      path?: string;
      url?: string;
      metadata: SanityImageMetadata | null;
      source?: SanityAssetSourceData;
    } | null;
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  } | null;
  reviewPageDescriptiveImage: {
    asset: {
      _id: string;
      _type: "sanity.imageAsset";
      _createdAt: string;
      _updatedAt: string;
      _rev: string;
      originalFilename?: string;
      label?: string;
      title?: string;
      description?: string;
      altText?: string;
      sha1hash?: string;
      extension?: string;
      mimeType?: string;
      size?: number;
      assetId?: string;
      uploadId?: string;
      path?: string;
      url?: string;
      metadata: SanityImageMetadata | null;
      source?: SanityAssetSourceData;
    } | null;
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    decorative?: boolean;
    changed?: boolean;
    _type: "imageWithMetadata";
  } | null;
  reviewPageSummary: string | null;
  viewReviewsCTA: {
    linkLabel?: string;
    linkType?: "externalLink" | "toPage" | "toProject";
    toProject?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "project";
    };
    toPage?: "about" | "contact" | "home" | "projects" | "reviews";
    externalLink?: string;
  } | null;
  submitReviewTitle: string | null;
  submitReviewInvitation: string | null;
  submitReviewCTA: {
    linkLabel?: string;
    linkType?: "externalLink" | "toPage" | "toProject";
    toProject?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "project";
    };
    toPage?: "about" | "contact" | "home" | "projects" | "reviews";
    externalLink?: string;
  } | null;
} | null;

// Source: ./src/sanity/lib/queries.ts
// Variable: PROJECTS_QUERY
// Query: *[  _type == "project" && defined(projectSlug.current)][0...12]{    _id, projectName, projectSlug  }
export type PROJECTS_QUERYResult = Array<{
  _id: string;
  projectName: string | null;
  projectSlug: Slug | null;
}>;
// Variable: PROJECT_QUERY
// Query: *[  _type == "project" && projectSlug.current == $slug][0]{    _id, projectName, projectSlug, projectDescription  }
export type PROJECT_QUERYResult = {
  _id: string;
  projectName: string | null;
  projectSlug: Slug | null;
  projectDescription: string | null;
} | null;

// Query TypeMap
import "@sanity/client";
declare module "@sanity/client" {
  interface SanityQueries {
    "{\n  \"siteSettings\": *[_type == \"siteSettingsSingleton\"][0]{\n    aboutPageTitle,\n    aboutPageHeroImage {\n  ...,\n  asset->{\n    ...,\n    metadata\n  }\n}\n  },\n  \"companySettings\": *[_type == \"companySettingsSingleton\"][0]{\n    slogan,\n    aboutHistory,\n    aboutMission,\n    aboutFounder,\n    founderImage {\n  ...,\n  asset->{\n    ...,\n    metadata\n  }\n},\n    aboutTeam,\n    teamImage {\n  ...,\n  asset->{\n    ...,\n    metadata\n  }\n}\n  }\n}": QUERY_ABOUT_PAGEResult;
    "*[_type == \"siteSettingsSingleton\"][0]{\n  contactPageTitle,\n  contactsPagebackgroundImage {\n  ...,\n  asset->{\n    ...,\n    metadata\n  }\n},\n  PhoneLabel,\n  PhoneNumber,\n  emailLabel,\n  emailAddress,\n  socialMediaLabel,\n  instagramIcon {\n  ...,\n  asset->{\n    ...,\n    metadata\n  }\n},\n  instagramLink,\n  facebookIcon {\n  ...,\n  asset->{\n    ...,\n    metadata\n  }\n},\n  facebookLink\n}": QUERY_CONTACT_PAGEResult;
    "*[_type == \"siteSettingsSingleton\"][0]{\n  // Hero section\n  heroCTA,\n  heroHeadline,\n  heroImage {\n  ...,\n  asset->{\n    ...,\n    metadata\n  }\n},\n  \n  // Project section\n  projectCTA {\n    ...,\n    \"project\": toProject-> {\n      _id,\n      projectName,\n      projectSlug,\n      projectImage {\n  ...,\n  asset->{\n    ...,\n    metadata\n  }\n}\n    }\n  },\n  \n  // Services section\n  servicesTitle,\n  servicesDescription,\n  backgroundImageServices {\n  ...,\n  asset->{\n    ...,\n    metadata\n  }\n},\n  servicesCTA,\n  \n  // Review section\n  reviewerName,\n  reviewText,\n  reviewCTA\n}": QUERY_HOMEResult;
    "*[_type == \"companySettingsSingleton\"][0]{\n  logoForLightBG {\n  ...,\n  asset->{\n    ...,\n    metadata\n  }\n},\n  logoForDarkBG {\n  ...,\n  asset->{\n    ...,\n    metadata\n  }\n}\n}": QUERY_LOGOResult;
    "*[_type == \"siteSettingsSingleton\"][0]{\n  homePageNavLabel,\n  projectsPageNavLabel,\n  aboutPageNavLabel,\n  reviewsPageNavLabel,\n  contactPageNavLabel,\n  mobileBackgroundImage {\n  ...,\n  asset->{\n    ...,\n    metadata\n  }\n},\n  \n  // Footer data\n  displayCopyright,\n  textBeforeCopyright,\n  copyrightText,\n  copyrightYear,\n  textAfterCopyright\n}": QUERY_NAVResult;
    "*[\n  _type == \"project\" && defined(projectSlug.current)][0...12]{\n    _id, \n    projectName, \n    projectSlug,\n    projectImage {\n  ...,\n  asset->{\n    ...,\n    metadata\n  }\n}\n  }\n": QUERY_PROJECTSResult;
    "*[\n  _type == \"project\" && projectSlug.current == $slug][0]{\n    _id, \n    projectName, \n    projectSlug, \n    projectDescription,\n    projectImage {\n  ...,\n  asset->{\n    ...,\n    metadata\n  }\n},\n    projectNeighbourhood->{\n      name\n    },\n    projectGallery[] {\n  ...,\n  asset->{\n    ...,\n    metadata\n  }\n}\n  }\n": QUERY_PROJECTResult;
    "*[_type == \"siteSettingsSingleton\"][0]{\n  projectIndexPageTitle,\n  projectIndexPageDescription\n}": QUERY_PROJECT_INDEX_METADATAResult;
    "*[_type == \"siteSettingsSingleton\"][0]{\n  reviewPageTitle,\n  reviewPageBackgroundImage {\n  ...,\n  asset->{\n    ...,\n    metadata\n  }\n},\n  reviewPageDescriptiveImage {\n  ...,\n  asset->{\n    ...,\n    metadata\n  }\n},\n  reviewPageSummary,\n  viewReviewsCTA {\n    ...,\n  },\n  submitReviewTitle,\n  submitReviewInvitation,\n  submitReviewCTA {\n    ...,\n  }\n}": QUERY_REVIEWS_PAGEResult;
    "*[\n  _type == \"project\" && defined(projectSlug.current)][0...12]{\n    _id, projectName, projectSlug\n  }\n": PROJECTS_QUERYResult;
    "*[\n  _type == \"project\" && projectSlug.current == $slug][0]{\n    _id, projectName, projectSlug, projectDescription\n  }\n": PROJECT_QUERYResult;
  }
}
