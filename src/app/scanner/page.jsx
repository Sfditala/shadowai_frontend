"use client";
import { useState } from "react";
import Link from "next/link";

export default function ScannerPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPrivacy, setShowPrivacy] = useState(false);

  async function handleScan() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("https://shadowai-backend.onrender.com/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, source: "web" }),
      });
      if (!res.ok) throw new Error("Failed to connect to server");
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setError(
        "An error occurred while connecting to the scan server. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  }

  const riskStyles = {
    critical: {
      bg: "bg-red-600",
      text: "text-white",
      border: "border-red-600",
      icon: "🔴",
      badge: "bg-red-800",
    },
    high: {
      bg: "bg-red-400",
      text: "text-white",
      border: "border-red-400",
      icon: "🔴",
      badge: "bg-red-600",
    },
    medium: {
      bg: "bg-orange-400",
      text: "text-white",
      border: "border-orange-400",
      icon: "🟠",
      badge: "bg-orange-600",
    },
    safe: {
      bg: "bg-green-500",
      text: "text-white",
      border: "border-green-500",
      icon: "🟢",
      badge: "bg-green-700",
    },
  };

  const levelColors = {
    critical: "text-red-400",
    high: "text-red-300",
    medium: "text-orange-400",
    safe: "text-green-400",
  };

  const methodStyles = {
    regex: {
      color: "text-blue-400",
      icon: "⚡",
      label: "Regex only — faster & more accurate",
    },
    ml: { color: "text-purple-400", icon: "🧠", label: "ML only" },
    "regex + ml": { color: "text-yellow-400", icon: "🔬", label: "Regex + ML" },
  };

  const riskLabels = {
    critical: "Critical Risk 🔴",
    high: "High Risk 🔴",
    medium: "Medium Risk 🟠",
    safe: "Safe 🟢",
  };

  const style = result
    ? riskStyles[result.risk_level] || riskStyles.safe
    : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">🛡️</h1>
          <div className="flex items-center justify-center gap-2 mb-2 relative">
            <h1 className="text-4xl font-bold">ShadowAI Detector</h1>
            <div className="relative">
              <button
                onClick={() => setShowPrivacy(!showPrivacy)}
                className="w-6 h-6 rounded-full border border-gray-600 bg-gray-800 text-gray-400 text-xs font-medium hover:border-gray-400 hover:text-gray-200 transition-all flex items-center justify-center"
                aria-label="Privacy Policy"
              >
                ?
              </button>

              {showPrivacy && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 w-80 bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-xl text-left">
                  <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-white">
                        Privacy Policy
                      </span>
                    </div>
                    <button
                      onClick={() => setShowPrivacy(false)}
                      className="text-gray-400 hover:text-white text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    {[
                      {
                        title: "We never store your text",
                        desc: "The text you enter is scanned in real time and is never saved to any database.",
                      },
                      {
                        title: "Scanning happens on our server only",
                        desc: "Your data is never shared with any third party — it goes to our server and the result comes back to you.",
                      },
                      {
                        title: "No tracking or identity analysis",
                        desc: "We collect no information about you and do not track what you type — the tool is completely anonymous.",
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="min-w-8 h-8 rounded-lg bg-green-900/40 flex items-center justify-center">
                          <span className="text-green-400 text-sm">✓</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white mb-0.5">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-gray-700 pt-2 mt-1">
                      <p className="text-xs text-gray-500 text-center">
                        This tool exists to protect you — not to collect your
                        data.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-400 text-lg">
            Scan your text before sending it to any AI tool
          </p>
          <Link
            href="https://youtu.be/yosQcaPaYt0"
            className="text-gray-600 text-xs hover:text-gray-400"
          >
            ← Watch the video for more information
          </Link>
        </div>

        {/* ── Input Box ── */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-4">
          <label className="block text-gray-400 mb-2 text-sm">
            Paste the text you want to scan
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Example: my card number is 4532-XXXX or password=MySecret123 ..."
            rows={6}
            className="w-full bg-gray-800 text-white rounded-xl p-4 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none resize-none placeholder-gray-600"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600 text-xs">
              {text.length} / 50,000 characters
            </span>
            <button
              onClick={() => {
                setText("");
                setResult(null);
              }}
              className="text-gray-600 text-xs hover:text-gray-400"
            >
              Clear
            </button>
          </div>
        </div>

        {/* ── Scan Button ── */}
        <button
          onClick={handleScan}
          disabled={loading || !text.trim()}
          className="w-full py-4 rounded-xl font-bold text-lg transition-all bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed"
        >
          {loading ? "⏳ Scanning..." : "🔍 Scan Now"}
        </button>

        {/* ── Error Message ── */}
        {error && (
          <div className="mt-4 bg-red-900/30 border border-red-700 rounded-xl p-4 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* ── Result ── */}
        {result && (
          <div
            className={`mt-6 rounded-2xl border-2 ${style.border} overflow-hidden`}
          >
            {/* Result Header */}
            <div className={`${style.bg} ${style.text} p-5`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-2xl font-bold">
                    {riskLabels[result.risk_level] || result.risk_label_ar}
                  </p>
                  <p className="text-sm opacity-80 mt-1">
                    {result.risk_level === "safe"
                      ? "This text is safe to send."
                      : "This text contains sensitive data!"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold">
                    {Math.round(result.risk_score * 100)}%
                  </p>
                  <p className="text-xs opacity-80">Risk Score</p>
                </div>
              </div>

              {/* Technical Info Bar */}
              <div className="flex gap-4 mt-3 pt-3 border-t border-white/20 flex-wrap">
                {result.scan_duration_ms !== undefined && (
                  <div className="flex items-center gap-1 text-xs opacity-90">
                    <span>⏱️</span>
                    <span>
                      {result.scan_duration_ms < 50
                        ? `${result.scan_duration_ms}ms — fast scan`
                        : `${result.scan_duration_ms}ms`}
                    </span>
                  </div>
                )}

                {result.detection_method &&
                  (() => {
                    const ms =
                      methodStyles[result.detection_method] ||
                      methodStyles["ml"];
                    return (
                      <div className="flex items-center gap-1 text-xs opacity-90">
                        <span>{ms.icon}</span>
                        <span>{ms.label}</span>
                      </div>
                    );
                  })()}

                {result.text_length !== undefined && (
                  <div className="flex items-center gap-1 text-xs opacity-90">
                    <span>📝</span>
                    <span>{result.text_length} characters</span>
                  </div>
                )}
              </div>
            </div>

            {/* Detected Issues */}
            {result.detected.length > 0 && (
              <div className="bg-gray-900 p-5">
                <p className="text-gray-400 text-sm mb-3 font-medium">
                  Detected issues:
                </p>
                <div className="space-y-3">
                  {result.detected.map((item, i) => (
                    <div
                      key={i}
                      className="bg-gray-800 rounded-xl p-4 border border-gray-700"
                    >
                      {/* Issue name + count */}
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span>{style.icon}</span>
                          <span
                            className={`text-sm font-medium ${levelColors[item.level]}`}
                          >
                            {item.message_ar}
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs bg-gray-700 px-2 py-1 rounded-full">
                          {item.count} {item.count === 1 ? "match" : "matches"}
                        </span>
                      </div>

                      {/* Detected snippet */}
                      {item.snippet && (
                        <div className="mt-2">
                          <p className="text-gray-500 text-xs mb-1">
                            Detected snippet:
                          </p>
                          <code className="block bg-gray-950 text-red-300 text-xs p-2 rounded-lg font-mono break-all border border-gray-700">
                            {item.snippet}
                          </code>
                        </div>
                      )}

                      {/* Credit Card Analysis */}
                      {item.card_analysis && (
                        <div
                          className={`mt-3 rounded-lg p-3 border text-xs ${
                            item.card_analysis.is_test
                              ? "bg-yellow-900/20 border-yellow-700/40"
                              : item.card_analysis.is_valid
                                ? "bg-red-900/30 border-red-700/40"
                                : "bg-gray-800 border-gray-600"
                          }`}
                        >
                          <p className="font-semibold mb-1 text-gray-300">
                            🔬 Card Analysis (Luhn Algorithm):
                          </p>
                          <div className="flex flex-wrap gap-3 text-gray-400">
                            <span>
                              Card type:{" "}
                              <span className="text-white font-medium">
                                {item.card_analysis.card_type}
                              </span>
                            </span>
                            <span>
                              Mathematically valid:{" "}
                              <span
                                className={
                                  item.card_analysis.is_valid
                                    ? "text-green-400"
                                    : "text-red-400"
                                }
                              >
                                {item.card_analysis.is_valid
                                  ? "✅ Yes"
                                  : "❌ No"}
                              </span>
                            </span>
                            <span>
                              Test card:{" "}
                              <span
                                className={
                                  item.card_analysis.is_test
                                    ? "text-yellow-400"
                                    : "text-red-400"
                                }
                              >
                                {item.card_analysis.is_test
                                  ? "🧪 Yes"
                                  : "⚠️ Possibly real"}
                              </span>
                            </span>
                          </div>
                          {item.card_analysis.is_valid &&
                            !item.card_analysis.is_test && (
                              <p className="mt-2 text-red-400 font-semibold">
                                ⚠️ This card passes the Luhn check and is not a
                                known test card — it may be real!
                              </p>
                            )}
                          {item.card_analysis.is_test && (
                            <p className="mt-2 text-yellow-400">
                              🧪 Test/sandbox card — safe to share, but remove
                              any sensitive data nearby.
                            </p>
                          )}
                        </div>
                      )}

                      {/* International Phone Details */}
                      {item.country && (
                        <div className="mt-2 bg-blue-900/20 border border-blue-700/40 rounded-lg p-2 text-xs">
                          <span className="text-blue-400">
                            🌍 Country detected from prefix:{" "}
                            <span className="font-semibold text-white">
                              {item.country}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            <div className="bg-gray-900 border-t border-gray-800 p-4">
              {result.should_block ? (
                <p className="text-red-400 text-sm font-medium">
                  🚫 Do not send this text to any external AI tool — it contains
                  sensitive data!
                </p>
              ) : (
                <p className="text-green-400 text-sm font-medium">
                  ✅ This text is safe to send.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Quick Examples ── */}
        {!result && (
          <div className="mt-8">
            <p className="text-gray-600 text-sm mb-3 text-center">
              Try these examples:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  label: "🔴 Real card (Luhn)",
                  text: "My Visa card number is 4916123456789012 expiry 12/27",
                },
                {
                  label: "🧪 Test card (Stripe)",
                  text: "The test card is 4242424242424242 cvv 123",
                },
                {
                  label: "🔴 Password",
                  text: "password=MySecret123 to log into the server",
                },
                {
                  label: "🌍 International phone",
                  text: "Reach me at +970591234567 or 00966501234567",
                },
                {
                  label: "📍 Home address",
                  text: "I live in Ramallah, Al-Nuzha Street, Building 5",
                },
                {
                  label: "🟠 Database",
                  text: "mongodb://admin:pass123@localhost:27017/mydb",
                },
                {
                  label: "🟢 Regular question",
                  text: "How do I write a for loop in Python?",
                },
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setText(example.text)}
                  className="text-left bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg p-3 text-sm text-gray-400 transition-all"
                >
                  <span className="font-medium">{example.label}</span>
                  <span className="text-gray-600 ml-2 text-xs">
                    {example.text.slice(0, 45)}...
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="w-full py-4 mt-15 border-t border-gray-100 dark:border-gray-800 font-sans">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-6">
          {/* College Info Section */}
          <div className="text-center group">
            <h3 className="text-gray-700 dark:text-gray-300 font-bold text-sm md:text-base mb-1 tracking-wide transition-colors">
              University College of Applied Sciences — UCAS
            </h3>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em]">
              Gaza, Palestine
            </p>
          </div>

          {/* Team Section */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Team Members
            </span>
            <div className="flex flex-wrap justify-center items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="px-3 py-1 bg-gray-50 dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-800">
                Olfat Medhat Al-Sakany
              </span>
              <span className="text-gray-300 hidden md:block">•</span>
              <span className="px-3 py-1 bg-gray-50 dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-800">
                Tala Mohammed Al-Safadi
              </span>
            </div>
          </div>

          {/* Development Credit */}
          <div className="flex flex-col items-center gap-4 pt-2 border-t border-gray-50 dark:border-gray-900 w-full max-w-xs">
            <p className="text-xs text-gray-500">
              Developed by{" "}
              <a
                href="https://github.com/Sfditala"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 font-semibold hover:text-blue-600 transition-colors duration-300 underline underline-offset-4"
              >
                Tala Al-Safadi
              </a>
            </p>
            <p className="text-[10px] text-gray-400 font-mono">
              © 2026 | All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
