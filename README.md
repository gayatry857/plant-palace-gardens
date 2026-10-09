# Plant Palace Gardens

Static website for Plant Palace Gardens, a small plant nursery in Parumootumpadi, Thekkemala, Aranmula, Kerala 689533. Malayalam first with an English line beneath each section. The site exists to send people to WhatsApp and to the nursery, not to sell online.

No build step and no dependencies. Double-click `index.html` or serve the folder with any static server.

## Folder structure

```
index.html                    page markup and the CONFIG block (top of <head>)
styles.css                    brand colours, layout
app.js                        STOCK list, grid rendering, config wiring, mobile nav
images/                       logos, favicon, share image, plant photos (see images/README.txt)
.github/workflows/deploy.yml  deploys to GitHub Pages on every push to main
```

## Editable placeholders

All in the `SITE_CONFIG` block at the top of `index.html`:

- `WHATSAPP_NUMBER`: digits only with country code, for example `919876543210`
- `FACEBOOK_URL`
- `OPENING_HOURS`
- `GOOGLE_MAPS_EMBED_URL`: leave empty to use an address-search map
- `ADDRESS` and `ADDRESS_ML`

Plants shown in "What we grow" are the `STOCK` array at the top of `app.js`. Also replace the `og:image` URL in `index.html` with the full live address once you know it.

## Deploy on GitHub Pages

1. Create an empty repo on github.com (no README, no .gitignore).
2. Add it as origin and push:
   ```
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```
3. In the repo go to Settings > Pages and set Source to **GitHub Actions**. The included workflow then publishes the site on every push to `main`.

If you would rather skip the workflow, set Source to "Deploy from a branch", branch `main`, folder `/ (root)`, and delete `.github/workflows/deploy.yml`. Use one method, not both.
