# JobMatchAI

JobMatchAI is a Node.js application that automates job matching and evaluation. It scrapes LinkedIn job postings via Apify, evaluates each job against your candidate profile using AI (DeepSeek via OpenRouter, optionally ChatGPT), and writes the results to a Google Sheet.

![Workflow Overview](./JobMatchAI-v1.png "Automated Job Search Workflow")

## Prerequisites

- Node.js (v16 or higher)
- NPM or Yarn
- [OpenRouter](https://openrouter.ai/) API key (for DeepSeek), and/or an OpenAI API key (for GPT)
- [Apify](https://apify.com/) API key — the scraper uses [curious_coder/linkedin-jobs-scraper](https://apify.com/curious_coder/linkedin-jobs-scraper), pay-per-result ($0.001/job, billed from your Apify account credit)
- Google Cloud service account with the Sheets API enabled

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/EricTechPro/JobMatchAI
   cd JobMatchAI
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables — create a `.env` file in the root directory:

   ```env
   APIFY_API_KEY=[apify api key]
   SPREADSHEET_ID=[google sheet spreadsheet id]
   OPENROUTER_API_KEY=[openrouter api key, used for deepseek]
   OPENAI_API_KEY=[openai api key, only needed if USE_GPT=true]
   USE_GPT=false
   USE_DEEPSEEK=true
   DEBUG_MODE=false
   ```

4. Set up Google Sheets access:
   - Create a service account in the [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts) and download a JSON key.
   - Save it as `google_service_account_credentials.json` in the project root.
   - Enable the [Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com) for the project.
   - Share your spreadsheet with the service account's `client_email` (Editor access).

5. Create `candidate_summary.txt` in the project root with your resume/profile summary — this is what jobs are matched against.

6. Configure the job search in `apify_input.json`. Build a search on [LinkedIn Jobs](https://www.linkedin.com/jobs/search/) (use an incognito window), copy the URL, and set the result count (minimum 10):

   ```json
   {
       "urls": [
           "https://www.linkedin.com/jobs/search/?keywords=Security%20Engineer&location=United%20States&f_WT=2&f_TPR=r604800"
       ],
       "count": 25,
       "scrapeCompany": false
   }
   ```

   Useful URL parameters: `f_WT=2` (remote), `f_TPR=r604800` (past week), `f_TPR=r86400` (past 24h).

## Usage

Start the application:

```bash
node index.js
```

Each run scrapes jobs, saves them to a dated `*-jobs.json` file, skips jobs already present in the sheet (deduplicated by job link), evaluates new ones with AI, and appends them to the sheet.

Set `DEBUG_MODE=true` in `.env` to replay a previously saved jobs file instead of paying for a new scrape (the filename is set in `index.js`).

## Sensitive files

The following files contain secrets or personal data and are excluded from the repository via `.gitignore` — never commit them:

- `.env` — API keys
- `google_service_account_credentials.json` — Google private key
- `candidate_summary.txt` — your resume
- `*-jobs.json` — scraped job data

## Dependencies

- [apify-client](https://www.npmjs.com/package/apify-client)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [googleapis](https://www.npmjs.com/package/googleapis)
- [openai](https://www.npmjs.com/package/openai)

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request for review.
