import { useEffect, useRef, useState } from "react";
import { createJob, getJobStatus } from "./api";
import "./styles.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("IDLE");
  const [result, setResult] = useState(null);
  const [showFullJson, setShowFullJson] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pollRef = useRef(null);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  const parseNumbers = (value) => {
    return value
      .split(",")
      .map((item) => parseInt(item.trim(), 10))
      .filter((item) => !Number.isNaN(item));
  };

  const handleSubmit = async () => {
    setError("");
    setResult(null);
    setShowFullJson(false);

    const numbers = parseNumbers(inputValue);

    if (!numbers.length) {
      setError("Please enter valid numbers separated by commas.");
      return;
    }

    try {
      setIsSubmitting(true);
      stopPolling();

      const data = await createJob(numbers);

      setJobId(data.job_id);
      setStatus(data.status || "PENDING");

      pollRef.current = setInterval(async () => {
        try {
          const jobData = await getJobStatus(data.job_id);
          setStatus(jobData.status);

          if (jobData.status === "SUCCESS") {
            setResult(jobData.result);
            stopPolling();
          }

          if (jobData.status === "FAILURE") {
            setError(jobData.error || "Job failed.");
            stopPolling();
          }
        } catch (pollError) {
          setError("Polling failed.");
          stopPolling();
        }
      }, 2000);
    } catch (submitError) {
      setError(
        submitError?.response?.data?.detail || "Failed to create job."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>Distributed Background Job Demo</h1>
        <p className="subtitle">
          Submit numbers, process them in parallel with Celery, and track the result.
        </p>

        <label htmlFor="numbers">Numbers</label>
        <input
          id="numbers"
          type="text"
          placeholder="1, 2, 3, 4, 5, 6"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Job"}
        </button>

        {jobId && (
          <div className="info-box">
            <strong>Job ID:</strong> {jobId}
          </div>
        )}

        <div className="status-box">
          <strong>Status:</strong> {status}
        </div>

        {error && <div className="error-box">{error}</div>}

        {result && (
          <div className="result-box">
            <h2>Result</h2>

            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">Processed Numbers</span>
                <span className="result-value result-list">
                  {Array.isArray(result.processed_numbers)
                    ? result.processed_numbers.join(", ")
                    : "-"}
                </span>
              </div>

              <div className="result-item">
                <span className="result-label">Total Sum</span>
                <span className="result-value">{result.total_sum ?? "-"}</span>
              </div>

              <div className="result-item">
                <span className="result-label">Chunks Processed</span>
                <span className="result-value">
                  {result.chunks_processed ?? "-"}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowFullJson((current) => !current)}
            >
              {showFullJson ? "Hide Full JSON" : "See Full JSON"}
            </button>

            {showFullJson && <pre>{JSON.stringify(result, null, 2)}</pre>}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
