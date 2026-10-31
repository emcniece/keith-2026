# AGENTS.md — Keith Yacucha for Langford Council 2026

Read this first. It is written for a person or coding agent picking this repo up again, possibly years later (the next BC municipal general election is expected in **October 2030**).

## Status (as of 2026-10-26)

- The site **used to run on NationBuilder** (NB). NB is being **deprecated entirely**; the site is moving to a static host.
- **`site/` is the source of truth.** It is a plain static website (HTML/CSS/JS, no build step). Edit it directly.
- Everything else (`templates/`, `stylesheets/`, `javascripts/`, `files/`, `downloaded-from-nb/`, `deploy.sh`, `commit.sh`, `upload-to-nb/`) is the **archived NationBuilder theme**, kept for reference only. Nothing reads it any more.
- The NationBuilder deploy GitHub Action is **disabled**: it was moved from `.github/workflows/` to `.github/disabled-workflows/deploy-nationbuilder.yml`, so it never runs. Do not move it back unless you are deliberately reviving NationBuilder.
- **Hosting is not set up yet.** As of this date the domain still pointed at NationBuilder's proxy. See [Hosting](#hosting).
- **Forms do not submit anywhere.** See [Forms](#forms).
- 2026 campaign context: election day was **October 17, 2026**. Sibling sites built the same way: `colby-2026` (www.colbyharder.ca) and `kim-2026` (www.kimberleyguiry.ca).

## Quick start

```bash
npx serve@14.2.4 site        # preview at http://localhost:3000 (clean URLs + 404.html)
```

Commit with plain `git` (`git add … && git commit`). `commit.sh` only matters for the NationBuilder flow; using it is harmless but unnecessary.

## Repository layout

```
site/                       THE WEBSITE — deploy this folder as the web root
  index.html                homepage
  <slug>/index.html         every other page (clean URLs: /about → about/index.html)
  404.html                  not-found page
  assets/theme/             theme CSS (compiled theme.css), JS, images, fonts
  assets/content/           images that had been uploaded through the NB admin (page/meta images)
  assets/nb/                a few NB platform images referenced by theme.css (payment icons etc.)
  assets/static/            hand-written glue for running without NB:
    nb-shim.js              stubs the NB JS globals the theme scripts expect
    static-forms.js         makes every form inert (see Forms)
tools/nb-to-static.py       the one-off NB → static mirroring script (needs a live NB site; see below)
tools/toggle-forms.py       comments the forms out / restores them (see Forms)
docs/nationbuilder-theme.md archived NB-era developer guide (Liquid conventions, Figma tokens, components)
.github/disabled-workflows/ archived NB deploy Action
templates/ stylesheets/ javascripts/ files/ downloaded-from-nb/   archived NB theme source
```

## How the static site was made

On 2026-10-26 `tools/nb-to-static.py https://www.keithyacucha.ca` crawled the live NB site and:

- saved every internal page reachable from the homepage/sitemap (36 pages + `404.html`);
- removed the NB runtime: NB JS bundles, CSRF tokens, login button + sign-in modal, Facebook/Twitter SDKs, reCAPTCHA, Stripe, Cloudflare scripts;
- replaced NB's bundled jQuery with jQuery 3.7.1 from cdnjs plus `assets/static/nb-shim.js`;
- downloaded all theme and content assets into `site/assets/` and rewrote URLs to root-relative `/assets/...`;
- decoded Cloudflare-obfuscated email links back to plain `mailto:`;
- rewrote every `<form>` to `action="#" data-static-form` and appended `static-forms.js` to every page.

Verified at the time: every page loaded in headless Chrome with no JS errors, no failed requests and no requests to NationBuilder, and page heights matched the live NB site (except `/donate`, which lacks the Stripe card element).

**The script cannot be re-run once the NB site is gone**, and re-running it while NB is up overwrites any hand edits to `site/**/*.html`. Treat it as historical documentation of the transformation.

### What did NOT carry over

- **Supporter data** (people, sign-ups, donations, survey responses, volunteer lists, email lists) lives in the NationBuilder database, not in this repo. It must be exported from NB before the account is closed; nothing here can recover it.
- **Unpublished theme edits**: anything committed to `templates/`/`stylesheets/` but never deployed to NB is not in `site/`. The mirror reflects what was live. Check [Site-specific notes](#site-specific-notes) for known undeployed work.
- **Logins, donations/payments, petitions, event RSVPs** — anything that needed NB's backend.

## Editing the site

- Content is plain HTML in `site/**/index.html`. The header/nav and footer are **duplicated in every page** (there is no templating). To change the nav, footer, or anything sitewide, edit all pages, e.g. with a script or `sed` across `site/**/*.html`, and check with `git diff`.
- Styles: edit `site/assets/theme/theme.css` directly (it is NB's compiled output of `stylesheets/theme.scss`; URLs inside it were rewritten to `/assets/...`). `stylesheets/theme.scss` still compiles with `npx sass@1.77.8 --load-path=stylesheets stylesheets/theme.scss`, but its asset URLs are NB-style bare filenames, so recompiling into `site/` needs those URLs fixed — prefer editing the CSS.
- New page: copy an existing `site/<slug>/index.html` into a new folder, update `<title>`, meta/OG tags, canonical URL and body content, and add it to the nav on every page.
- Images: put new files in `site/assets/content/` (or `assets/theme/`) and reference them root-relatively (`/assets/...`).
- Absolute URLs: `<link rel="canonical">`, `og:url`, `og:image` use `https://www.keithyacucha.ca`. Update them if the domain changes.

### Things that will be stale in 2030

Search before relaunching:

- Election date and year: `grep -rn "October 17\|2026" site --include='*.html'` (titles, hero copy, donate page, footer, calendar `.ics` data URI).
- Elections BC disclosure text ("Authorized by … Financial Agent") in the footer of every page.
- Third-party embeds and links (news articles, Instagram/Facebook embeds) may have rotted.
- Google Analytics property `G-GEZ9WBF9ZJ` (gtag snippet in every page `<head>`): confirm it still exists/is wanted, or remove/replace it.
- CDN dependencies (pinned versions; confirm they still resolve, or vendor them into `site/assets/`):
  - `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css`
  - `https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js`
  - Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`)

## Forms

**As of 2026-10-31 the forms are commented out.** `python3 tools/toggle-forms.py disable` wrapped every submission form in an HTML comment (`<!--FORM-DISABLED ... FORM-DISABLED-->`) and put a `<p class="static-form-email">` with a `mailto:` link in its place. Where the visible UI lived outside the `<form>` (a scripted multi-step widget), the whole wrapper was commented out instead. `python3 tools/toggle-forms.py enable` restores the exact original markup (verified byte-for-byte). Inside a disabled block, `-->` is stored as `--&gt;`; do not hand-edit those blocks. The email lines get small contrast fixes at the end of `site/assets/theme/theme.css` (search for `static-form-email`), which can stay or go once the forms are back. Intro copy that pointed at a form ("fill out the form below", "sign up below") was reworded to point at email in the commit "Reword page copy that referred to the forms"; revert those copy edits when the forms come back.

The rest of this section describes the forms as they behave when enabled.

Nothing is submitted anywhere. `site/assets/static/static-forms.js`:

- blocks ordinary form submits and shows a notice ("Online forms are being moved … please email us");
- intercepts scripted `fetch()` POSTs to `#` or `/forms/...` and returns a **fake 200**, so multi-step/scripted forms show their normal success message. **That success message is a lie until a backend exists** — fix this before real visitors use the site.

To connect a backend: give each `<form>` a real `action` (or change the scripts' `fetch` target), then delete or narrow `static-forms.js`. Field names are NationBuilder-style (`signup[email]`, `feedback[content]`, …); a new backend can accept them or the forms can be renamed.

`/donate` cannot take payments (the Stripe element was NB-hosted, and NB's JS also injected the Province field). Either link to an external donation processor, remove the page, or rebuild the form against a new payment provider.

Form inventory at mirror time (hidden/system fields such as `page_id`, `return_to`, honeypots omitted):

- **blog_post_page** on `/achievements`, `/blog`, `/media`: `blog_post_page[page_headline]`, `blog_post_page[content_editable]`
- **donation** on `/donate`: `donation[donation_occurrence]`, `donation[amount_option]`, `donation[amount]`, `donation[first_name]`, `donation[last_name]`, `donation[email]`, `donation[billing_address_attributes][phone_number]`, `donation[billing_address_attributes][country_code]`, `donation[billing_address_attributes][address1]`, `donation[billing_address_attributes][address2]`, `donation[billing_address_attributes][city]`, `donation[billing_address_attributes][state]`, `donation[billing_address_attributes][zip]`, `donation[billing_address_attributes][county]` …
- **feedback** on `/contact`: `feedback[content]`, `feedback[first_name]`, `feedback[last_name]`, `feedback[email]`, `feedback[mobile_number]`, `feedback[home_address_attributes][country_code]`, `feedback[home_address_attributes][address1]`, `feedback[home_address_attributes][address2]`, `feedback[home_address_attributes][city]`, `feedback[home_address_attributes][state]`, `feedback[home_address_attributes][zip]`, `feedback[is_volunteer]`, `feedback[email_opt_in]`, `feedback[mobile_opt_in]`
- **ky-contact__form** on `/`: `signup[email_opt_in]`, `signup[first_name]`, `signup[last_name]`, `signup[email]`, `signup[phone_number]`, `signup[note]`
- **ky-cta__form** on `/`: `signup[first_name]`, `signup[email]`
- **unnamed form (copy-link box, no submission)** on `/spread_the_word`: 
- **user_session** on `/achievements`, `/blog`, `/media`: `user_session[email]`
- **volunteer_signup** on `/volunteer`: `volunteer_signup[volunteer_type_ids][]`, `volunteer_signup[first_name]`, `volunteer_signup[last_name]`, `volunteer_signup[email]`, `volunteer_signup[mobile_number]`, `volunteer_signup[phone_number]`, `volunteer_signup[phone_time]`, `volunteer_signup[availability]`, `volunteer_signup[content]`, `volunteer_signup[home_address_attributes][country_code]`, `volunteer_signup[home_address_attributes][address1]`, `volunteer_signup[home_address_attributes][address2]`, `volunteer_signup[home_address_attributes][city]`, `volunteer_signup[home_address_attributes][state]` …

### Known dead links (NationBuilder-only features)

These pointed at NB account/RSS features that no static host provides. Remove them, or the surrounding "sign in"/"subscribe" UI, when convenient:

- `/achievements.rss` (on 5 pages, e.g. `/achievements`)
- `/blog.rss` (on 8 pages, e.g. `/blog`)
- `/login` (on 1 page, e.g. `/spread_the_word`)
- `/media.rss` (on 14 pages, e.g. `/comment_building_langford_s_future_a_strategic_investment_in_tomorrow`)
- `/users/accounts/new` (on 3 pages, e.g. `/achievements`)
- `/users/password_resets/new` (on 3 pages, e.g. `/achievements`)

## Hosting

Requirements for any static host:

- Serve `site/` as the **domain root** (paths are root-relative `/assets/...`; a sub-path such as `user.github.io/repo/` breaks them unless rewritten).
- Directory index (`/about` → `/about/index.html`, with or without trailing slash) and `404.html` as the not-found page. GitHub Pages, Netlify, Cloudflare Pages and `npx serve` all do this by default.
- GitHub Pages notes: it cannot publish from `site/` directly (only `/` or `/docs`), so use a Pages Actions workflow that uploads `site/`; private repos need a paid plan; add `site/CNAME` containing `www.keithyacucha.ca`.
- DNS (as of 2026-10-26): `www.keithyacucha.ca` was a CNAME to a NationBuilder proxy. Repoint it (and the apex domain) to the new host before NB is shut off, or the site goes down.

## NationBuilder reference (archived)

| | |
|---|---|
| Public domain | `https://www.keithyacucha.ca` |
| NB host | `langford2026electioncampaign.nationbuilder.com` (same nation as Colby) |
| NB site id / theme id | `67` / `69f8c1f8ea5e7445526870c5` |
| Admin | `https://<NB host>/admin/sites/67/themes/69f8c1f8ea5e7445526870c5` |
| Deploy | `.github/disabled-workflows/deploy-nationbuilder.yml` ran `deploy.sh --upload` with the `NB_COOKIES` repo secret (an NB admin session cookie). That secret is now useless and can be deleted. |

`docs/nationbuilder-theme.md` is the full NB-era guide (Liquid rules, upload paths, Figma workflow). `downloaded-from-nb/` is the pristine theme as downloaded from NB.

To **revive** NationBuilder (unlikely): restore the workflow file to `.github/workflows/`, refresh the `NB_COOKIES` secret, and follow `docs/nationbuilder-theme.md`. Note that `site/` would then be out of sync with NB.

## Site-specific notes

- **`site/` does not contain the custom Platform page.** NB deploys failed from 2026-09-15 onward (expired session cookie), and the deploy was then disabled, so nothing after commit `5766bcb` (last successful deploy, 2026-07-18) ever went live. `site/platform/index.html` is the older live NB page. The undeployed work: commits `96db0e8`, `58d1e00`, `8ecfb5b`, `4c20bc5`, `6a1b4a9`, `52c65f0`, `2ba3d45`, `5587baa`, merge `2167276` — files `templates/_ky_platform_page.html` (new page), `templates/_ky_platform.html` and `_homepage.html` (homepage platform/about sections), `templates/layout.html`, `javascripts/ky-platform-accordion.js`, `files/platform-icon-*.svg`, and ~750 lines of `stylesheets/theme.scss`. See `git diff 5766bcb HEAD -- templates stylesheets javascripts files`.
- To recover it, port by hand: render the Liquid partial's HTML into `site/platform/index.html` (replace `{{ theme['x'] }}` with `/assets/theme/x`, drop Liquid tags), update the homepage sections in `site/index.html`, copy the JS and SVGs into `site/assets/theme/`, and compile the new SCSS rules (`npx sass@1.77.8`) and append them to `site/assets/theme/theme.css`.
- The homepage sign-up (`.ky-cta__form`) and contact (`.ky-contact__form`) forms are submitted by `site/assets/theme/ky-homepage-forms.js` via `fetch()`. `static-forms.js` fakes a success response, so they show the normal thank-you message **without saving anything**.
- The homepage fetches `/achievements` at runtime to build its achievement cards; keep `site/achievements/index.html` (and its blog-post markup) in place or those cards disappear.
- `theme.js` depends on `NB.EventHub`, `ImgCropper` and `jQuery.browser`; `site/assets/static/nb-shim.js` stubs them.
- `/achievements`, `/blog` and `/media` contain hidden NationBuilder admin leftovers (`user_session` login and `blog_post_page` inline-edit forms). They are inert and can be deleted.
- `keith-placeholder.jpg` returned 403 from NationBuilder at mirror time; the copy in `site/assets/theme/` came from `files/`.
- Instagram embeds call `graph.instagram.com` from the visitor's browser; this is expected.
- The `Makefile` `deploy` target is NationBuilder-only (legacy).
