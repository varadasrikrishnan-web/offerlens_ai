# OfferLens AI

> An explainable, LLM-assisted tool for triaging potential risk signals in internship and job-offer messages.

OfferLens AI helps students review internship and job-offer text for common warning signs, including payment requests, sensitive-data demands, urgency tactics, suspicious interview shortcuts, and unverified links.

It is designed to support **independent verification and safer decision-making**. It does not determine whether an organisation is legitimate, fraudulent, or criminal.

## Why this project?

Students often receive internship and job opportunities through forwarded messages, WhatsApp groups, social media, email, online forms, and direct messages. Some offers may contain warning signs such as:

- Requests for registration, training, certificate, security-deposit, or processing fees
- Requests for Aadhaar, PAN, bank details, passwords, OTPs, or identity documents before verification
- Pressure to act immediately through “limited slots,” “today only,” or “urgent” language
- Offers with no genuine interview process or unrealistic guaranteed selection
- Links, contact details, or organisations that cannot be independently verified

OfferLens AI provides a structured first-pass review of this text and explains why specific signals were identified.

## Features

- Accepts unstructured internship or job-offer text
- Uses an LLM to extract structured risk signals from the message
- Validates extracted output using Pydantic schemas
- Calculates a deterministic, explainable risk score in Python
- Detects common signals including:
  - Payment or fee requests
  - Requests for sensitive personal or financial data
  - Urgency and pressure tactics
  - No-interview or guaranteed-selection language
  - Suspicious or unverified links
- Returns evidence excerpts for each detected signal
- Provides verification guidance instead of unsupported accusations
- Includes a regex/rule-based fallback if LLM extraction is unavailable
- Keeps API credentials on the backend through environment variables
- Provides a React-based interface for entering text and viewing results

## Important safety note

OfferLens AI is a **risk-triage and educational tool**.

It does **not**:

- Confirm that a company, recruiter, website, or message is fraudulent
- Make legal, financial, employment, or investigative decisions
- Replace independent verification through official organisation channels
- Guarantee that an offer is safe when the risk score is low

A high score means that the submitted text contains more risk-related signals. A low score does not prove legitimacy.

Never send money, OTPs, banking details, passwords, Aadhaar/PAN details, or identity documents until you independently verify the employer and offer through official channels.

## How it works

OfferLens AI uses a hybrid architecture.

```text
User enters offer text
        |
        v
React + Vite frontend
        |
        v
FastAPI backend
        |
        +--> LLM extracts structured signals
        |       |
        |       v
        |   Pydantic schema validation
        |
        +--> Regex/rule-based fallback
                |
                v
Deterministic Python scoring engine
                |
                v
Risk score + flags + evidence + verification guidance
                |
                v
Results shown in the frontend
```

### Design principle

The LLM is used for **language understanding and evidence extraction**. It does not independently issue the final safety decision.

The final risk score is calculated with deterministic Python rules. This separation improves transparency, makes the score easier to audit, and reduces the risk of presenting an LLM opinion as a factual fraud verdict.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, JavaScript/CSS |
| Backend | Python, FastAPI, Uvicorn |
| Data validation | Pydantic |
| LLM integration | OpenAI API |
| Fallback detection | Python regex and rule-based NLP |
| Version control | Git and GitHub |

## Risk signals analysed

The application reviews text for the following signal categories:

| Signal | Examples |
|---|---|
| Payment request | Registration fee, training fee, security deposit, processing fee, certificate fee |
| Sensitive-data request | Aadhaar, PAN, bank account details, card information, OTPs, passwords, documents |
| Urgency or pressure | “Apply today”, “limited slots”, “urgent”, “immediate payment”, “last chance” |
| Interview shortcut | “No interview”, “guaranteed selection”, “direct joining”, “selected immediately” |
| Suspicious link or contact | Unknown form links, shortened links, personal email accounts, unverified contact details |
| Unrealistic claims | Very high salary, guaranteed placement, vague company information, unrealistic benefits |

The exact signals and score depend on the offer text submitted by the user.

## Project structure

```text
offerlens_ai/
|
|-- backend/
|   |-- app/
|   |   |-- __init__.py            # Marks app as a Python package
|   |   |-- main.py                # FastAPI application entry point
|   |   |-- ...
|   |
|   |-- requirements.txt           # Python dependencies
|   |-- .env.example               # Environment variable template
|   |-- .env                       # Local secrets only; never commit this file
|   |-- ...
|
|-- frontend/
|   |-- src/
|   |   |-- App.jsx                # Main React interface
|   |   |-- ...
|   |-- package.json               # Frontend dependencies and scripts
|   |-- ...
|
|-- README.md
|-- .gitignore
```

## Local setup

### Prerequisites

Install the following before running the project:

- Python 3.10 or later
- Node.js LTS and npm
- Git
- An OpenAI API key, if using LLM extraction

Check your installations:

```bash
python --version
node --version
npm --version
git --version
```

## Backend setup

Open a terminal in the project root and navigate to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it.

### Windows PowerShell

```powershell
.\.venv\Scripts\Activate.ps1
```

### Windows Command Prompt

```bat
.venv\Scripts\activate.bat
```

### macOS/Linux

```bash
source .venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Create the local environment file from the template.

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### macOS/Linux

```bash
cp .env.example .env
```

Add your API key to `backend/.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Do not commit this file. It should be ignored through `.gitignore`.

Start the FastAPI server from inside the `backend` directory:

```bash
python -m uvicorn app.main:app --reload
```

This command means:

```text
app.main  → backend/app/main.py
app       → FastAPI() object named app inside main.py
```

If the backend starts correctly, it will typically run at:

```text
http://127.0.0.1:8000
```

FastAPI interactive API documentation may be available at:

```text
http://127.0.0.1:8000/docs
```

## Frontend setup

Open a **second terminal** and navigate to the frontend directory:

```bash
cd frontend
```

If you are in the project root:

```bash
cd frontend
```

If you are currently in `backend/`:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Vite will display a local address, usually:

```text
http://localhost:5173
```

Open the exact local URL shown in the terminal.

## Running the application

The project needs two terminals running simultaneously.

| Terminal | Directory | Command |
|---|---|---|
| Backend | `backend/` | `python -m uvicorn app.main:app --reload` |
| Frontend | `frontend/` | `npm run dev` |

Then open the frontend address shown by Vite, normally:

```text
http://localhost:5173
```

## Example input

Paste an offer message such as:

```text
Congratulations! You have been selected for a paid internship.

To confirm your position, pay a refundable registration fee of Rs. 499 today.
There are only 10 slots left, so complete payment immediately.

Send your Aadhaar card, PAN card, bank details, and recent photograph
through the Google Form below. No interview is required.

[https://example-form-link.com](https://example-form-link.com)
```

The application should identify relevant signals, provide excerpts from the text, calculate a risk score, and recommend verification steps.

## Example output

Depending on the submitted text, an analysis may include:

```text
Risk level: High
Risk score: 85/100

Detected signals:
- Payment or fee request
- Request for sensitive identity or financial information
- Urgency or pressure language
- No-interview / direct-selection claim
- Unverified external link

Suggested actions:
- Do not send money or sensitive documents
- Verify the organisation through its official website and verified contact details
- Search for the recruiter and company independently
- Confirm the offer through the organisation's official HR channel
```

The exact output depends on the user-provided message and the configured analysis logic.

## API key security

This project follows these basic security practices:

- API keys are stored in `backend/.env`
- `.env` is excluded from Git using `.gitignore`
- `.env.example` documents required environment variables without exposing secrets
- The frontend should not contain private API keys
- LLM requests are handled by the backend

Before pushing changes to GitHub, run:

```bash
git status
```

Confirm that the following are not staged or committed:

```text
backend/.env
backend/.venv/
frontend/node_modules/
```

## Fallback behaviour

If the LLM service is unavailable, the API key is missing, or an LLM response cannot be parsed safely, OfferLens AI uses rule-based and regex-based detection.

The fallback is intentionally simpler than LLM extraction, but it helps keep the application functional and surfaces obvious risk patterns such as:

- `registration fee`
- `pay now`
- `security deposit`
- `urgent`
- `limited slots`
- `no interview`
- `Aadhaar`
- `PAN`
- `bank details`
- `OTP`

## Limitations

- Text-only analysis cannot verify whether a company or recruiter is authentic.
- Legitimate organisations may use urgent language or request documents later in a genuine hiring process.
- Scammers may avoid common keywords and produce convincing messages.
- LLM output may vary and can make mistakes.
- The quality of results depends on the submitted text and the selected model/configuration.
- External links are treated as verification signals; the app does not automatically determine whether they are malicious.
- The tool is not a replacement for professional legal, cybersecurity, financial, or employment advice.

## Recommended verification steps

When an offer appears suspicious:

1. Do not pay fees to secure an internship or job.
2. Do not share OTPs, passwords, banking credentials, or card details.
3. Be cautious about sending identity documents before verifying the organisation.
4. Visit the organisation’s official website independently rather than relying only on links in the message.
5. Check whether the recruiter uses a verified official domain and contact method.
6. Contact the company’s official HR channel to confirm the role and recruiter.
7. Search for company registration details, employee profiles, and credible reviews.
8. Discuss questionable offers with a placement cell, mentor, trusted professional, or cybersecurity resource.
9. Preserve screenshots and message records if you suspect malicious activity.

## Development status

OfferLens AI is currently a local development and portfolio project.

The repository contains the application code and setup instructions. A production deployment would require additional work, including secure environment-variable management, CORS configuration, rate limiting, authentication if needed, logging, monitoring, privacy handling, and deployment-specific configuration.

## Future improvements

Potential enhancements include:

- Deployment of frontend and backend services
- URL reputation and domain-age checks
- Company-domain verification
- Upload and OCR support for screenshots or PDF offer letters
- Better multilingual support
- Feedback mechanisms for users to report false positives or missed signals
- Risk-score calibration using reviewed examples
- Authentication and saved analysis history
- Rate limiting and abuse prevention
- Privacy-first deletion controls
- More detailed explanations and confidence indicators
- Automated tests and CI/CD workflow

## Contributing

Contributions, bug reports, and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Do not commit secrets, API keys, virtual environments, or dependency folders.
5. Open a pull request describing the change.

## License

This project is intended for educational and portfolio purposes.

Add a license file, such as the MIT License, before using or distributing the project under an open-source license.

## Author

**Varada Srikrishnan**

GitHub: [@varadasrikrishnan-web](https://github.com/varadasrikrishnan-web)

Project repository: [OfferLens AI](https://github.com/varadasrikrishnan-web/offerlens_ai)
