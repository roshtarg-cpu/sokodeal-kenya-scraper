import { Actor } from 'apify';
import { CheerioCrawler } from 'crawlee';

await Actor.init();

const input = await Actor.getInput();
const {
    category = 'vehicles',
    city = '',
    maxResults = 50,
    proxyConfiguration
} = input || {};

// Build start URL
let startUrl = `https://sokodeal.co.ke/${category}`;
if (city) {
    startUrl = `https://sokodeal.co.ke/${category}/${city}`;
}

const results = [];

const crawler = new CheerioCrawler({
    proxyConfiguration: proxyConfiguration?.useApifyProxy 
        ? await Actor.createProxyConfiguration(proxyConfiguration)
        : undefined,
    
    async requestHandler({ $, request }) {
        console.log(`Processing: ${request.url}`);
        
        // Extract listings from page
        const listings = [];
        
        // SokoDeal uses .listing-card or similar selectors
        $('article, [class*="listing"], [class*="item-card"], a[href*="_i"]').each((i, el) => {
            if (listings.length >= maxResults) return false;
            
            const $el = $(el);
            const $link = $el.is('a') ? $el : $el.find('a').first();
            
            const url = $link.attr('href');
            if (!url || !url.includes('sokodeal.co.ke')) return;
            
            const title = $link.text().trim() || 
                         $el.find('[class*="title"]').first().text().trim() ||
                         $link.attr('title') || '';
            
            const price = $el.find('[class*="price"]').first().text().trim() || 'Contact for price';
            const location = $el.find('[class*="location"], [class*="city"]').first().text().trim() || '';
            const description = $el.find('[class*="description"], p').first().text().trim().substring(0, 200) || '';
            
            // Get image if available
            const image = $el.find('img').first().attr('src') || '';
            
            if (title && url) {
                listings.push({
                    title,
                    price,
                    location,
                    description,
                    image: image ? (image.startsWith('http') ? image : `https://sokodeal.co.ke${image}`) : '',
                    url: url.startsWith('http') ? url : `https://sokodeal.co.ke${url}`,
                    category,
                    scrapedAt: new Date().toISOString()
                });
            }
        });
        
        console.log(`Extracted ${listings.length} listings from this page`);
        results.push(...listings);
        
        // Check if we need more results and there's a next page
        if (results.length < maxResults) {
            const nextPageLink = $('a[rel="next"], a[class*="next"], .pagination a').last().attr('href');
            if (nextPageLink && !nextPageLink.includes('#')) {
                const nextUrl = nextPageLink.startsWith('http') 
                    ? nextPageLink 
                    : `https://sokodeal.co.ke${nextPageLink}`;
                
                await crawler.addRequests([nextUrl]);
            }
        }
    },

    maxRequestsPerCrawl: 10,
    maxConcurrency: 2
});

await crawler.run([startUrl]);

// Limit to maxResults
const finalResults = results.slice(0, maxResults);

console.log(`Total results: ${finalResults.length}`);

// Save to dataset
await Actor.pushData(finalResults);

await Actor.exit();
