# JobMatchAI

JobMatchAI is a Node.js application that automates job matching and evaluation. It scrapes job postings through a configured Apify actor, evaluates each job against your candidate profile using AI (DeepSeek via OpenRouter, optionally ChatGPT), and writes the results to a Google Sheet.

![Workflow Overview](./JobMatchAI-v1.png "Automated Job Search Workflow")

## Prerequisites

- Node.js (v16 or higher)
- NPM or Yarn
- [OpenRouter](https://openrouter.ai/) API key (for DeepSeek), and/or an OpenAI API key (for GPT)
- [Apify](https://apify.com/) API key — the configured scraper actor is pay-per-result (currently $0.001/job, billed from your Apify account credit)
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

6. Configure the job search in `apify_input.json`. Copy a job search URL from the service you use and set the result count (minimum 10):

   ```json
   {
       "urls": [
           "https://jobs.example.com/search?keywords=Security%20Engineer&location=United%20States"
       ],
       "count": 25,
       "scrapeCompany": false
   }
   ```

## Usage

Start the application:

```bash
node index.js
```

Each run scrapes jobs, saves them to a dated `*-jobs.json` file, skips jobs already present in the sheet (deduplicated by job link), evaluates new ones with AI, and appends them to the sheet.

Set `DEBUG_MODE=true` in `.env` to replay a previously saved jobs file instead of paying for a new scrape (the filename is set in `index.js`).

### Tailor a resume to a job

The `tailor-resume-for-job` Codex skill uses the read-only `candidate_summary.txt` as its source of candidate facts to create Markdown, plain-text, Word, and PDF resume versions for a specific posting. Identify the posting by direct URL, company and job title, or a saved jobs file, for example:

```text
Use the tailor-resume-for-job skill for https://jobs.example.com/posting/12345
```

You can also say `Use the tailor-resume-for-job skill for the Senior Security Engineer posting at Example Corp in 2026-07-06-jobs.json.` The skill saves ATS-readable `.md`, `.txt`, `.docx`, and `.pdf` resume versions and their posting metadata in a per-job subfolder under the gitignored `tailored-resumes/` folder. Requested cover letters go in the same job folder. Existing job metadata remains unchanged. In WSL, the skill mirrors those files to the corresponding Windows folder. Before preparing an application, it checks the private application tracker and, when connected, Gmail for previous applications. It stops on a previously submitted job and warns before another application to the same company. If it cannot access the posting, provide its text. Candidate details and generated files are private and excluded from Git.

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
