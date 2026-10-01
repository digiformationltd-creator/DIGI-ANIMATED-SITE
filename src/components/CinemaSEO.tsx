import React, { useEffect } from "react";
import { FilmConfig } from "../types/film";

interface CinemaSEOProps {
  film: FilmConfig;
}

export const CinemaSEO: React.FC<CinemaSEOProps> = ({ film }) => {
  useEffect(() => {
    // Dynamic Document Title
    document.title = film.seoTitle;

    // Dynamic Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", film.seoDescription);

    // Dynamic Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://digiformation.com${film.route}`);

    // Open Graph Tags
    const ogTags: Record<string, string> = {
      "og:title": film.seoTitle,
      "og:description": film.seoDescription,
      "og:url": `https://digiformation.com${film.route}`,
      "og:site_name": "DigiFormation",
      "og:type": "website",
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });
  }, [film]);

  return (
    <div className="sr-only" aria-hidden="false">
      <header>
        <h1>{film.title}</h1>
        <p>{film.subtitle}</p>
        <p>{film.description}</p>
      </header>

      <main>
        <section>
          <h2>Cinematic Service Overview</h2>
          <p>{film.seoDescription}</p>
          <ul>
            {film.timelineSteps.map((step, idx) => (
              <li key={idx}>
                Chapter {idx + 1}: {step.label}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Official Provider Notice</h2>
          <p>
            DigiFormation is an authorized commercial formations and engineering group. DigiFormation is not a government agency (Companies House, HMRC, or IRS) nor a registered bank. All trademarked entity names are the property of their respective holders.
          </p>
        </section>
      </main>
    </div>
  );
};
