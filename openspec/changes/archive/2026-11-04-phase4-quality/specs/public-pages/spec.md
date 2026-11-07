# Delta for Public Pages

## ADDED Requirements

### Requirement: WebSite Structured Data

The system SHALL emit `WebSite` JSON-LD on every public page alongside the existing `Organization` structured data.

#### Scenario: WebSite JSON-LD present on public pages

- GIVEN any public page
- WHEN the page renders
- THEN a `WebSite` JSON-LD script tag is present
- AND it references the configured site URL
- AND the existing `Organization` structured data is preserved

#### Scenario: JSON-LD is valid

- GIVEN rendered public page HTML
- WHEN the JSON-LD script contents are parsed
- THEN they form valid JSON with `@type` of `WebSite`

### Requirement: Single Site URL Configuration

The system SHALL derive all absolute URLs (canonical, `og:url`, sitemap, robots.txt, JSON-LD) from a single site URL placeholder constant; the Astro `site` value and `VITE_SITE_URL` MUST NOT diverge.

#### Scenario: One source of truth for the site URL

- GIVEN the single site URL constant
- WHEN a public page renders
- THEN canonical URL, `og:url`, and JSON-LD site references all match that constant

#### Scenario: Domain swap requires a single edit

- GIVEN the production domain is decided after this change ships
- WHEN the placeholder constant is updated to the chosen domain
- THEN canonical, Open Graph, sitemap, and robots URLs all reflect the new domain with no other edits

#### Scenario: No assumed production domain in output

- GIVEN the production domain is not yet chosen
- WHEN the site is built
- THEN generated URLs come from the placeholder constant only, with no unapproved production domain hardcoded elsewhere

## MODIFIED Requirements

### Requirement: SEO Meta Tags and Open Graph

The system SHALL generate proper SEO meta tags and Open Graph tags for each page, with every `og:image` URL resolving successfully and declaring explicit image dimensions.

(Previously: og:image URLs were not required to resolve or declare dimensions; detail pages referenced missing `/og-draw-*.jpg` assets.)

#### Scenario: Each page has unique meta tags

- GIVEN any public page
- WHEN the page renders
- THEN unique title, description, and canonical URL are present
- AND Open Graph tags (og:title, og:description, og:image, og:type) are present
- AND Twitter Card tags are present

#### Scenario: og:image resolves with declared dimensions

- GIVEN any public page
- WHEN the `og:image` URL is requested
- THEN it returns HTTP 200
- AND `og:image:width` and `og:image:height` are present
- AND a single default asset (`public/og-default.jpg`) serves pages without a page-specific image

#### Scenario: Draw detail has dynamic meta

- GIVEN a draw detail page
- WHEN the page renders
- THEN title includes draw number and date
- AND description includes winning numbers
- AND `og:image` resolves (the default asset until per-draw cards ship)
