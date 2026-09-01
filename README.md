# CONCEPTS Photography & Design Inc. — Website

Clean, minimal, image-focused static website. Runs on any static host.

## Pages (3-page structure + supporting pages)
- `index.html` — Home / landing page (square hero gallery, image bands, testimonials)
- `portfolio.html` — Portfolio, with five sections: Headshots, Character Portraits, Industry Specific, Commercial Contracts, Personal
- `gallery.html` — Private client gallery sign-in (preview mockup — secure galleries to be connected before launch)
- `behind-the-camera.html` — Karee's bio and client reviews
- `contact.html` — Contact form (reached from buttons and footer)
- `privacy.html` / `terms.html` — Legal
- `404.html` — Error page
- `about.html`, `headshots.html` — redirects to the new pages (kept so old links still work)

## Changing the homepage quote (and its size)
Open `index.html` and find the block marked:
`<!-- EDIT THE HOMEPAGE QUOTE HERE. -->`
- Change the words between the `<h1>...</h1>` tags.
- Wrap a word in `<em>...</em>` to italicize it (like "spirit").
- To change the size, edit the number `5rem` in that line. Bigger number = bigger text. Try between `3rem` and `6rem`.

## Changing the big quotes throughout the site
The large serif quotes are the client reviews and "kind words." To change them:
- **Homepage review quotes:** in `index.html`, look for `class="pullquote"` — edit the text inside each `<blockquote>`.
- **Rotating short quotes (homepage):** in `index.html`, look for `id="kind-rotator"` — each `<blockquote>` is one quote; the `<cite>` is the name.
- **Behind the Camera reviews:** in `behind-the-camera.html`, same pattern.
You can freely swap the wording and names any time.

## Updating the large homepage hero images (square)
Edit `js/gallery.json` — one entry per image with the file name and a short caption. Keep 5–7. Images are shown square, so square-ish source photos crop best.

## Contact / leads
The contact form and "email Karee" buttons open the visitor's email app addressed to kareedavidson@sasktel.net. The gallery sign-in is a preview; a secure client-gallery service can be connected before launch.

## Before launch — checklist
- [ ] Replace any remaining placeholder text with final content
- [ ] Confirm portfolio images are grouped the way you want across the five sections
- [ ] Connect a real client-gallery service to `gallery.html`
- [ ] Have Privacy Policy and Terms reviewed by a professional
- [ ] Give Codie (PagePros) the keyword/city targets to fine-tune SEO
