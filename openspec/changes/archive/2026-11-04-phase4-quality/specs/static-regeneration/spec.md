# Delta for Static Regeneration

## MODIFIED Requirements

### Requirement: Sitemap Generation

The system SHALL generate a complete `sitemap.xml` at build time including all public pages and draw detail pages, and MUST exclude non-public route prefixes `/admin` and `/test-fixtures`.

(Previously: the sitemap `filter` returned `true` for every route, leaking `/admin` and `/test-fixtures` URLs.)

#### Scenario: Sitemap includes all public pages

- GIVEN the build completes
- WHEN `sitemap.xml` is generated
- THEN URLs for `/`, `/ultimo-sorteo`, `/historial`, `/busqueda` are included
- AND all draw detail pages `/detalle/[id]` are included
- AND `lastmod` reflects the draw date for detail pages
- AND `changefreq` is "weekly" for listing pages, "yearly" for detail pages

#### Scenario: Sitemap excludes non-public routes

- GIVEN routes `/admin/*` and `/test-fixtures/*` exist in the site
- WHEN `sitemap.xml` is generated
- THEN no URL containing `/admin` or `/test-fixtures` appears in the sitemap
- AND public page and detail URLs remain included (the filter does not over-exclude)

#### Scenario: Sitemap respects robots.txt

- GIVEN the project has a `robots.txt`
- WHEN sitemap generates
- THEN the sitemap URL is referenced in robots.txt
- AND no private/admin paths are included

## ADDED Requirements

None — this change only tightens existing sitemap behavior.

## REMOVED Requirements

None.
