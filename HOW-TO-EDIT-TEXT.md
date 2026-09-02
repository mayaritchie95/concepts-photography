# How to edit your website text and font sizes

You can change any wording on the site, and adjust the size of the big headings,
by editing the page files in a plain text editor (or in whatever editor PagePros
sets you up with). You do **not** need to touch anything except the words between
the tags. Here's how.

> Tip: always keep a copy of the original file before editing, so you can undo.

---

## 1. Changing wording

Open the page you want to change:

| To edit this page        | Open this file              |
|--------------------------|-----------------------------|
| Home                     | `index.html`                |
| Portfolio                | `portfolio.html`            |
| Client Gallery           | `gallery.html`              |
| Behind the Camera        | `behind-the-camera.html`    |
| Contact                  | `contact.html`             |

Find the words you want to change and type over them. Only change the text
**between** the `>` and `<` symbols. For example:

```
<h1 ...>Capturing the <em>spirit</em> of a person or a moment.</h1>
```

- Change the words `Capturing the spirit of a person or a moment.`
- Keep the `<em>...</em>` around any word you want in *italics* (like "spirit").
- Don't remove the `<h1 ...>` at the start or the `</h1>` at the end.

---

## 2. Changing the size of a big heading

Big headings have a size setting built in that looks like this:

```
style="font-size: clamp(2.4rem, 5.2vw, 5rem);"
```

You only need to change the **last number** (here, `5rem`).

- Bigger number = bigger text (try `6rem`)
- Smaller number = smaller text (try `3.5rem`)

The three numbers mean: smallest size on phones, an in-between size, and the
largest size on big screens. Changing the last number is enough for most tweaks.

**Example — make the homepage quote bigger:**

Before:
```
<h1 class="display" style="font-size: clamp(2.4rem, 5.2vw, 5rem);">...
```
After (larger):
```
<h1 class="display" style="font-size: clamp(2.4rem, 5.2vw, 6rem);">...
```

---

## 3. Where the editable text lives on each page

**Home (`index.html`)**
- The big quote: look for `EDIT THE HOMEPAGE QUOTE HERE`
- The line under it (your bio one-liner): the paragraph starting `Karee Davidson —`
- "Ask Me Anything" heading and the "email Karee" button near the bottom

**Behind the Camera (`behind-the-camera.html`)**
- Your bio: the paragraphs after `class="lead"`
- The caption above your photo: look for `Image, Conner Holmes` (change as needed)
- Client reviews and "kind words": each quote is between `<blockquote>` and `</blockquote>`;
  the name is between `<cite ...>` and `</cite>`

**Portfolio (`portfolio.html`)**
- Section names (Headshots, Character Portraits, etc.): the text inside each
  `<p class="display-md">...</p>`

**Client Gallery (`gallery.html`)**
- The intro sentences and the "Enter your gallery" text

---

## 4. What you can't do by hand (needs PagePros)

- Adding or removing whole photos in the Portfolio grid (they can wire this to a
  simple system so you can upload images yourself)
- Connecting the real password-protected client galleries
- A full "click on the page and type" editor (a CMS) — if you'd like that,
  PagePros can put the site on a platform that allows it

If a true click-to-edit setup would suit you better, tell PagePros (Codie) and
they can host the site on a system that supports it, using this exact design.
