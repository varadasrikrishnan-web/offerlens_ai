import { useState } from "react";
import "./App.css";

const EXAMPLE_OFFER = `Congratulations! You are selected for a remote software internship with a salary of ₹30,000 per month. No interview is required. Pay a refundable registration fee of ₹1,499 today to confirm your seat. Send Aadhaar, PAN card, bank details, college ID, and resume through this Google Form within 2 hours: https://forms.gle/example`;

const API_URL = "http://127.0.0.1:8000";

function getRiskClass(riskLevel) {
  if (riskLevel === "HIGH RISK") {
    return "risk-high";
  }

  if (riskLevel === "NEEDS VERIFICATION") {
    return "risk-medium";
  }

  return "risk-low";
}

export default function App() {
  const [offerText, setOfferText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeOffer() {
    if (offerText.trim().length < 20) {
      setError("Please paste at least 20 characters of an internship or job offer.");
      setAnalysis(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      const response = await fetch(`${API_URL}/api/analyze-offer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offer_text: offerText,
        }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(
          responseData.detail || "Unable to analyse this offer right now."
        );
      }

      const responseData = await response.json();
      setAnalysis(responseData);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Could not connect to the OfferLens API. Confirm that FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  }

  function loadExample() {
    setOfferText(EXAMPLE_OFFER);
    setAnalysis(null);
    setError("");
  }

  function clearOffer() {
    setOfferText("");
    setAnalysis(null);
    setError("");
  }

  return (
    <main className="page-shell">
      <section className="hero-section">
        <p className="eyebrow">LLM-ready · Explainable risk triage</p>
        <h1>
          Offer<span>Lens</span> AI
        </h1>
        <p className="hero-copy">
          Inspect internship and job offers for payment requests, sensitive-data
          demands, pressure tactics, unverified links, and suspicious hiring
          shortcuts.
        </p>
      </section>

      <section className="analysis-layout">
        <article className="panel input-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Step 1</p>
              <h2>Paste an offer message</h2>
            </div>

            <button className="text-button" onClick={loadExample}>
              Load example
            </button>
          </div>

          <label htmlFor="offerText">
            Paste an internship post, recruiter message, email, or offer text.
          </label>

          <textarea
            id="offerText"
            value={offerText}
            onChange={(event) => setOfferText(event.target.value)}
            placeholder="Example: You have been selected for a remote internship. Pay a registration fee today to confirm your seat..."
            rows="15"
            maxLength="6000"
          />

          <div className="input-footer">
            <span>{offerText.length} / 6000 characters</span>

            <button className="text-button" onClick={clearOffer}>
              Clear
            </button>
          </div>

          <button
            className="primary-button"
            onClick={analyzeOffer}
            disabled={loading}
          >
            {loading ? "Analysing offer…" : "Analyse offer"}
          </button>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
        </article>

        <article className="panel result-panel">
          {!analysis && !loading && (
            <div className="empty-state">
              <div className="empty-icon">⌁</div>
              <p className="eyebrow">Step 2</p>
              <h2>Your analysis will appear here</h2>
              <p>
                OfferLens checks for explainable risk signals. It does not label
                people or organisations as fraudulent.
              </p>
            </div>
          )}

          {loading && (
            <div className="empty-state">
              <div className="loading-orb" />
              <p className="eyebrow">Analysing</p>
              <h2>Checking the offer text…</h2>
              <p>Extracting visible risk signals and applying safety rules.</p>
            </div>
          )}

          {analysis && (
            <>
              <div className="result-header">
                <div>
                  <p className="eyebrow">Step 2 · Risk assessment</p>
                  <h2>Analysis result</h2>
                </div>

                <span className={`risk-pill ${getRiskClass(analysis.risk_level)}`}>
                  {analysis.risk_level}
                </span>
              </div>

              <div className="score-card">
                <div>
                  <p>Explainable risk score</p>
                  <strong>{analysis.score}</strong>
                  <span>/100</span>
                </div>

                <p>{analysis.recommendation}</p>
              </div>

              <div className="flags-section">
                <div className="section-title-row">
                  <h3>Detected signals</h3>
                  <span>{analysis.flags.length} found</span>
                </div>

                {analysis.flags.length === 0 ? (
                  <div className="no-flags">
                    <span>✓</span>
                    <p>
                      No major high-risk signal was detected in the text you
                      supplied. Still verify independently before proceeding.
                    </p>
                  </div>
                ) : (
                  <div className="flags-list">
                    {analysis.flags.map((flag) => (
                      <article
                        className={`flag-card flag-${flag.severity}`}
                        key={flag.title}
                      >
                        <div className="flag-topline">
                          <h4>{flag.title}</h4>
                          <span>+{flag.points}</span>
                        </div>

                        <p>{flag.explanation}</p>

                        {flag.evidence.length > 0 && (
                          <div className="evidence-box">
                            <span>Evidence from text</span>
                            <blockquote>“{flag.evidence[0]}”</blockquote>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <p className="disclaimer">{analysis.disclaimer}</p>
            </>
          )}
        </article>
      </section>

  <section className="method-note">
  <p className="eyebrow">How it works</p>
  <p>
    OfferLens uses an LLM-assisted extraction layer to identify structured
    evidence in unstructured offer text, including payment requests,
    sensitive-document demands, urgency language, interview shortcuts, and
    unverified links. A transparent rule-based scoring engine then calculates
    the final risk score. The system highlights signals for independent
    verification; it does not make a fraud verdict about any person or
    organisation.
  </p>
</section>
    </main>
  );
}