import { useEffect } from "react";

type SEOProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
};

const SITE_NAME = "Elite Stainless Steel Concepts";
const SITE_URL = "https://elitestainlesssteelconcepts.co.ke";
const DEFAULT_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1cc26633-7e74-463e-bd7f-c8f75af62c00/id-preview-8d6fef34--74ef5f65-7835-480d-bf1e-88edf354a0e4.lovable.app-1781969768153.png";

export default function SEO({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
}: SEOProps) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
    const canonicalUrl = `${SITE_URL}${path}`;

    document.title = fullTitle;
    setMeta("description", description);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", type, "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("og:image", image, "property");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [description, image, path, title, type]);

  return null;
}

function setMeta(name: string, content: string, attribute: "name" | "property" = "name") {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

export function LocalBusinessSchema() {
  useEffect(() => {
    const id = "elite-local-business-schema";
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: SITE_NAME,
      url: SITE_URL,
      telephone: "+254794872338",
      email: "sales@elitestainlesssteelconcepts.co.ke",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Landies Road, Adjacent to Muthurua Primary",
        addressLocality: "Nairobi",
        addressCountry: "KE",
      },
      areaServed: "Kenya",
      description:
        "Custom stainless steel fabrication for commercial kitchens, refrigeration, laundry, and architectural projects across Kenya.",
    });
    return () => script?.remove();
  }, []);

  return null;
}
