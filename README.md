# 🇰🇪 SokoDeal Kenya Classifieds Scraper

[![Apify Actor](https://img.shields.io/badge/Apify-Actor-blue?logo=apify)](https://apify.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)](https://www.javascript.com/)
[![Cheerio](https://img.shields.io/badge/Cheerio-Fast-green)](https://cheerio.js.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Extract classified listings from **SokoDeal Kenya** (sokodeal.co.ke) — vehicles, property, electronics, phones, fashion, jobs, and more. Fast, reliable, and AI-agent ready.

---

## ✨ Features

- **17+ Categories** — Vehicles, Property, Electronics, Phones, Fashion, Jobs, Home & Furniture, Pets, Services, and more
- **City Filtering** — Scrape listings from Nairobi, Mombasa, or all Kenya
- **Proxy Support** — Apify Proxy (residential/datacenter) included
- **Structured Data** — JSON output with title, price, location, image, description, URL
- **Fast & Lightweight** — Cheerio-powered (no browser overhead)

---

## 📊 Output Example

```json
[
  {
    "title": "2014 Range Rover Sport Autobiography",
    "price": "KSh 6,799,999",
    "location": "Nairobi",
    "description": "2014 Range Rover Sport Autobiography. Engine: 5,000cc Supercharged V8 Petrol...",
    "image": "https://sokodeal.co.ke/oc-content/uploads/0/390_thumbnail.jpg",
    "url": "https://sokodeal.co.ke/vehicles/cars/2014-range-rover-sport-autobiography_i92",
    "category": "vehicles",
    "scrapedAt": "2026-09-03T02:56:00.000Z"
  }
]
```

---

## 🚀 Quick Start

### Input Parameters

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | String | `vehicles` | Category to scrape (vehicles, property, electronics, etc.) |
| `city` | String | `""` | City filter (leave empty for all Kenya) |
| `maxResults` | Integer | `50` | Max listings to extract (1-500) |
| `proxyConfiguration` | Object | `{}` | Apify Proxy settings (optional) |

### Example Input

```json
{
  "category": "vehicles",
  "city": "nairobi",
  "maxResults": 100,
  "proxyConfiguration": {
    "useApifyProxy": true
  }
}
```

---

## 🔧 Use Cases

- **Market Research** — Analyze pricing trends for vehicles, electronics, and property
- **Lead Generation** — Find job postings, services, or business listings
- **Price Monitoring** — Track classified ads over time
- **Data Analysis** — Build datasets for ML models and market intelligence

---

## 📝 Categories Available

Vehicles · Property · Electronics · Phones & Tablets · Fashion · Home & Furniture · Health & Beauty · Babies & Kids · Agriculture & Food · Sports & Outdoor · Pets · Services · Commercial Tools · Repair & Construction · Jobs · Community · CVs

---

## 🛠 Built With

- [Apify SDK](https://sdk.apify.com) — Actor runtime
- [Crawlee](https://crawlee.dev) — Web scraping framework  
- [Cheerio](https://cheerio.js.org) — Fast HTML parsing

---

## 📄 License

MIT © 2026

---

## 🤖 AI Agent Integration

Compatible with Claude, ChatGPT & AI agents via Apify MCP.

Run this actor programmatically:

```javascript
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: 'YOUR_APIFY_TOKEN' });
const run = await client.actor('YOUR_USERNAME/sokodeal-kenya-scraper').call({
  category: 'property',
  city: 'mombasa',
  maxResults: 200
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(items);
```

---

**Questions?** Open an issue on GitHub or contact [@roshtarg-cpu](https://github.com/roshtarg-cpu)
 
