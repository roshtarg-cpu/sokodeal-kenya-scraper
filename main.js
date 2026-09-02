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
let startUrl = 'https://sokodeal.co.ke/';  // Homepage has premium listings
if (category) {
    startUrl = `https://sokodeal.co.ke/${category}`;
    if (city) {
        startUrl += `/${city}`;
    }
}

const results = [];

const crawler = new CheerioCrawler({
    proxyConfiguration: proxyConfiguration?.useApifyProxy 
        ? await Actor.createProxyConfiguration(proxyConfiguration)
        : undefined,
    
    requestHandlerTimeoutSecs: 60,  // Increase timeout for slow pages
    navigationTimeoutSecs: 60,
    
    async requestHandler({ $, request }) {
        console.log(`Processing: ${request.url}`);
        
        // Extract listings from page  
        const listings = [];
        
        // SokoDeal: Find all links ending with _i## pattern (listing URLs)
        $('a[href*="_i"]').each((i, el) => {
            if (listings.length >= maxResults) return false;
            
            const $link = $(el);
            const url = $link.attr('href');
            
            // Only process listing URLs (end with _i followed by numbers)
            if (!url || !url.match(/_i\d+$/)) return;
            
            // Get the parent container (usually has all listing info)
            const $parent = $link.closest('div, article, li').length > 0 
                ? $link.closest('div, article, li') 
                : $link.parent();
            
            // Extract title from link text
            const title = $link.text().trim() || $link.attr('title') || '';
            if (!title || title.length < 3) return;  // Skip empty/short titles
            
            // Extract other fields from parent or siblings
            const price = $parent.text().match(/KSh\s+[\d,]+/)?.[0] || 'Contact for price';
            
            // Location is usually near price in the listing
            const textContent = $parent.text();
            const location = textContent.split('\n').find(line => 
                line.trim() && !line.includes('KSh') && !line.includes('ago') && line.length < 50
            )?.trim() || '';
            
            // Image
            const image = $parent.find('img').first().attr('src') || '';
            
            // Description (full text, then truncate)
            const description = $parent.text().replace(/\s+/g, ' ').trim().substring(0, 200);
            
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
