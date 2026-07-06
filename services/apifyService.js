const { ApifyClient } = require('apify-client');
const { log } = require('./loggingService');
const { readJSONFromFile } = require('./fileService');

const APIFY_API_KEY = process.env.APIFY_API_KEY;

// Map curious_coder/linkedin-jobs-scraper output to the field names the pipeline expects
function normalizeJob(item) {
    return {
        title: item.title || "",
        companyName: item.companyName || "",
        location: item.location || "",
        publishedAt: item.postedAt || "",
        url: item.link || "",
        jobUrl: item.link || "",
        contractType: item.employmentType || "",
        experienceLevel: item.seniorityLevel || "",
        salary: item.salary || "",
        posterProfileUrl: "",
        description: item.descriptionText || "",
    };
}

async function scrapeJobs() {
    log('INFO', 'Initializing Apify client...');
    const client = new ApifyClient({ token: APIFY_API_KEY });
    const actorId = "hKByXkMQaC5Qt9UMN"; // curious_coder/linkedin-jobs-scraper (pay per result)

    const input = readJSONFromFile("apify_input.json")

    log('INFO', 'Running Apify actor...');
    try {
        const run = await client.actor(actorId).call(input);
        log('INFO', 'Fetching job results from the dataset...');
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        log('INFO', `Successfully fetched ${items.length} jobs.`);
        return items.map(normalizeJob);
    } catch (error) {
        log('ERROR', 'Error during job scraping.', { error: error.message });
        throw error;
    }
}

module.exports = { scrapeJobs };
