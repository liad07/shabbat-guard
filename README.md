# 🕯️ Shabbat Guard

**Shabbat Guard** is a lightweight, open-source JavaScript library that allows you to automatically **disable your website during Shabbat** (Friday sunset → Saturday nightfall).  
It calculates Shabbat times based on the visitor’s location and custom minhagim (traditions) using the [Hebcal API](https://www.hebcal.com).

> Originally published as [`shabat-kodesh`](https://github.com/liad07/shabat-kodesh), the project has been renamed to **shabbat-guard** for clearer branding and consistency with the domain [shabbatguard.com](https://shabbatguard.com).

---

## ✨ What does it do?
- Detects if it is currently Shabbat based on visitor location (Geolocation or IP fallback).  
- Retrieves candle-lighting and havdalah times from Hebcal.  
- Displays an overlay blocking the site with a “closed for Shabbat” message.  
- Supports different minhagim: **default (≈40 min)**, **Chabad (≈50 min)**, **Jerusalem 40**, or **custom minutes**.  
- **New in v1.3:** full custom design — colors, title, message, and image via query parameters.

---

## 🌐 Website / Builder
The official landing page: [https://shabbatguard.com](https://shabbatguard.com)

On the site, you can **generate a ready-to-use `<script>` tag** by selecting:
- Location detection mode (Geolocation / IP / both / none)  
- Minhag (Default / Chabad / Jerusalem 40 / Custom minutes)  
- Optional **custom design**: background, text colors, custom title/message, and an image.

This makes integration as easy as copy-paste — no coding required.

---

## 🚀 Quick Install from CDN
Paste this in your `<head>` or before `</body>`:

```html
<script src="https://cdn.shabbatguard.com/shabbat-guard.umd.min.js?location=api&minhag=default" defer></script>
```

---

## ⚙️ Parameters
- `location`: `api` | `prompt-then-api` | `prompt-only` | `none`  
- `onDeny`: `api` | `none` (only relevant for `prompt-only`)  
- `minhag`: `default` | `chabad` | `jerusalem40` | `custom`  
- `havdalah`: minutes (if `minhag=custom`)  

### Custom Design (v1.3)
- `customDesign=true`  
- `title`, `message`, `image`  
- `bgColor`, `textColor`, `cardBg`, `accentColor`

Example:
```html
<script src="https://cdn.shabbatguard.com/shabbat-guard.umd.min.js?location=api&minhag=custom&havdalah=45&customDesign=true&title=Site%20Closed%20for%20Shabbat&message=We%27ll%20be%20back%20after%20Shabbat&bgColor=%231a1a1a&textColor=%23ffffff&cardBg=%232a2a2a&accentColor=%23d4af37" defer></script>
```

---

## 🛠️ ESM Module
For modern projects:
```html
<script type="module" src="https://cdn.shabbatguard.com/shabbat-guard.esm.min.js"></script>
```

Or import directly:
```js
import { initShabbatGuard } from 'https://cdn.shabbatguard.com/shabbat-guard.esm.min.js';

initShabbatGuard("https://cdn.shabbatguard.com/shabbat-guard.umd.min.js?location=api&minhag=default");
```

---

## 📖 Usage Examples
1. **Accurate (Geolocation, fallback to IP):**
```html
<script src="https://cdn.shabbatguard.com/shabbat-guard.umd.min.js?location=prompt-then-api&minhag=default" defer></script>
```
2. **Geolocation only (if denied → no block):**
```html
<script src="https://cdn.shabbatguard.com/shabbat-guard.umd.min.js?location=prompt-only&onDeny=none&minhag=default" defer></script>
```
3. **IP only, Chabad minhag (≈50 min):**
```html
<script src="https://cdn.shabbatguard.com/shabbat-guard.umd.min.js?location=api&minhag=chabad" defer></script>
```
4. **IP only, Custom 45 minutes + custom design:**
*(see example above)*

---

## 🤝 Contributing
- Issues and PRs are welcome.  
- Please note: this project provides a **technical tool** — not halachic rulings. Site owners should consult their Rabbi for practical guidance.

---

## 📜 License
MIT © 2025  
Released as open source to help site owners preserve the sanctity of Shabbat online.
