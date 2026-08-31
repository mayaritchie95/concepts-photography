# Concepts Photography & Design Inc. — Website

Clean, minimal, image-focused static website. No database or server code required — it runs on any static host (including whatever PagePros sets up when the domain moves over from FolioLink).

## Pages
- `index.html` — Home, with the large swipeable hero gallery
- `headshots.html` — Headshots service page (your primary service to promote; SEO-optimized)
- `portfolio.html` — Portfolio grid
- `about.html` — About Karee
- `contact.html` — Contact page with inquiry form
- `privacy.html` / `terms.html` — Legal pages
- `404.html` — Error page
- `sitemap.xml`, `robots.txt` — SEO files

## Updating the large homepage gallery (the 5–7 big images)
This is designed so you can change it whenever you like:

1. Put your new image files in the `images/` folder (JPGs work best, roughly 1600×1000px or larger).
2. Open `js/gallery.json` in any text editor.
3. Edit the list — one entry per image, with the file name and a short caption. Keep it to 5–7 for the best look. The order in the file is the order on the site.
4. Save. Done — no code changes needed.

Example entry:
```
{ "src": "images/my-new-photo.jpg", "caption": "Executive headshot — Calgary" }
```

## Replacing the other images
All placeholder images are grey boxes labelled with what they are. Replace the files in `images/` with your real photos, keeping the same file names (e.g. `portrait-karee.jpg`, `work-1.jpg`, `headshot-feature.jpg`). Portfolio and portrait images look best in a tall (3:4) crop.

## Content
Text throughout is placeholder/draft, ready to be swapped for content copied from your existing website (kareedavidsonphotography.com / conceptsphoto.ca). Testimonials are marked to be replaced with your real reviews.

## Contact form
The form opens the visitor's email app pre-filled and addressed to kareedavidson@sasktel.net, so leads land in your inbox with no server needed. If PagePros later wants a form that sends automatically without opening an email app, that's a small add-on they can wire up.

## Before launch — checklist
- [ ] Replace all placeholder images with real photos
- [ ] Paste real content from the existing site
- [ ] Add real social media links (search for `href="#"` in the files)
- [ ] Confirm the domain (`conceptsphoto.ca`) in the SEO tags is the one you'll use; update if different
- [ ] Have the Privacy Policy and Terms of Use reviewed by a professional (they're solid templates but not legal advice)
- [ ] Give Codie (PagePros) the keyword/city targets so they can fine-tune the meta tags and headings

## SEO already built in
- Descriptive page titles and meta descriptions on every page
- Local business + service structured data (schema.org) for Google
- Saskatoon & Calgary named throughout, with both studio addresses
- Open Graph tags for nice link previews on social
- Sitemap and robots file
