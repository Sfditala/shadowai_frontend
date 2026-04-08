"use client";
import { useState } from "react";
import Link from "next/link";

export default function ScannerPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      if (!res.ok) throw new Error("فشل الاتصال بالسيرفر");
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setError("حدث خطأ في الاتصال بسيرفر الفحص، يرجى المحاولة لاحقاً.");
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

  // ✨ ألوان وأيقونات طريقة الكشف
  const methodStyles = {
    regex: {
      color: "text-blue-400",
      icon: "⚡",
      label: "Regex فقط — أسرع وأدق",
    },
    ml: { color: "text-purple-400", icon: "🧠", label: "ML فقط" },
    "regex + ml": { color: "text-yellow-400", icon: "🔬", label: "Regex + ML" },
  };

  const style = result
    ? riskStyles[result.risk_level] || riskStyles.safe
    : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6" dir="rtl">
      <div className="max-w-3xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">🛡️</h1>
          <h1 className="text-4xl font-bold mb-2"> ShadowAI Detector</h1>
          <p className="text-gray-400 text-lg">
            افحص نصك قبل إرساله لأي أداة ذكاء اصطناعي
          </p>
          <Link href="/" className="text-gray-600 text-xs hover:text-gray-400">
            ← العودة للصفحة الرئيسية
          </Link>
        </div>

        {/* ── مربع الإدخال ── */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-4">
          <label className="block text-gray-400 mb-2 text-sm">
            الصق النص المراد فحصه
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="مثال: رقم بطاقتي 4532-XXXX أو password=MySecret123 ..."
            rows={6}
            className="w-full bg-gray-800 text-white rounded-xl p-4 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none resize-none placeholder-gray-600"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600 text-xs">
              {text.length} / 50,000 حرف
            </span>
            <button
              onClick={() => {
                setText("");
                setResult(null);
              }}
              className="text-gray-600 text-xs hover:text-gray-400"
            >
              مسح
            </button>
          </div>
        </div>

        {/* ── زر الفحص ── */}
        <button
          onClick={handleScan}
          disabled={loading || !text.trim()}
          className="w-full py-4 rounded-xl font-bold text-lg transition-all bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed"
        >
          {loading ? "⏳ جاري الفحص..." : "🔍 فحص الآن"}
        </button>

        {/* ── رسالة خطأ ── */}
        {error && (
          <div className="mt-4 bg-red-900/30 border border-red-700 rounded-xl p-4 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* ── النتيجة ── */}
        {result && (
          <div
            className={`mt-6 rounded-2xl border-2 ${style.border} overflow-hidden`}
          >
            {/* رأس النتيجة */}
            <div className={`${style.bg} ${style.text} p-5`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-2xl font-bold">{result.risk_label_ar}</p>
                  <p className="text-sm opacity-80 mt-1">{result.message_ar}</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold">
                    {Math.round(result.risk_score * 100)}%
                  </p>
                  <p className="text-xs opacity-80">درجة الخطورة</p>
                </div>
              </div>

              {/* ✨ شريط المعلومات التقنية */}
              <div className="flex gap-4 mt-3 pt-3 border-t border-white/20 flex-wrap">
                {/* وقت الفحص */}
                {result.scan_duration_ms !== undefined && (
                  <div className="flex items-center gap-1 text-xs opacity-90">
                    <span>⏱️</span>
                    <span>
                      {result.scan_duration_ms < 50
                        ? `${result.scan_duration_ms}ms — فحص سريع`
                        : `${result.scan_duration_ms}ms`}
                    </span>
                  </div>
                )}

                {/* طريقة الكشف */}
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

                {/* طول النص */}
                {result.text_length !== undefined && (
                  <div className="flex items-center gap-1 text-xs opacity-90">
                    <span>📝</span>
                    <span>{result.text_length} حرف</span>
                  </div>
                )}
              </div>
            </div>

            {/* ✨ المشاكل المكتشفة مع الـ snippet ومعلومات البطاقة */}
            {result.detected.length > 0 && (
              <div className="bg-gray-900 p-5">
                <p className="text-gray-400 text-sm mb-3 font-medium">
                  المشاكل المكتشفة:
                </p>
                <div className="space-y-3">
                  {result.detected.map((item, i) => (
                    <div
                      key={i}
                      className="bg-gray-800 rounded-xl p-4 border border-gray-700"
                    >
                      {/* اسم المشكلة + عدد التكرار */}
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
                          {item.count} {item.count === 1 ? "مرة" : "مرات"}
                        </span>
                      </div>

                      {/* الجزء المكتشف من النص */}
                      {item.snippet && (
                        <div className="mt-2">
                          <p className="text-gray-500 text-xs mb-1">
                            الجزء المكتشف:
                          </p>
                          <code className="block bg-gray-950 text-red-300 text-xs p-2 rounded-lg font-mono break-all border border-gray-700">
                            {item.snippet}
                          </code>
                        </div>
                      )}

                      {/* ✨ تفاصيل البطاقة الائتمانية */}
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
                            🔬 تحليل البطاقة (Luhn Algorithm):
                          </p>
                          <div className="flex flex-wrap gap-3 text-gray-400">
                            <span>
                              نوع البطاقة:{" "}
                              <span className="text-white font-medium">
                                {item.card_analysis.card_type}
                              </span>
                            </span>
                            <span>
                              صالحة رياضياً:{" "}
                              <span
                                className={
                                  item.card_analysis.is_valid
                                    ? "text-green-400"
                                    : "text-red-400"
                                }
                              >
                                {item.card_analysis.is_valid
                                  ? "✅ نعم"
                                  : "❌ لا"}
                              </span>
                            </span>
                            <span>
                              بطاقة تيست:{" "}
                              <span
                                className={
                                  item.card_analysis.is_test
                                    ? "text-yellow-400"
                                    : "text-red-400"
                                }
                              >
                                {item.card_analysis.is_test
                                  ? "🧪 نعم"
                                  : "⚠️ قد تكون حقيقية"}
                              </span>
                            </span>
                          </div>
                          {item.card_analysis.is_valid &&
                            !item.card_analysis.is_test && (
                              <p className="mt-2 text-red-400 font-semibold">
                                ⚠️ هذه البطاقة تجتاز فحص Luhn وليست من بطاقات
                                التيست المعروفة — قد تكون حقيقية!
                              </p>
                            )}
                          {item.card_analysis.is_test && (
                            <p className="mt-2 text-yellow-400">
                              🧪 بطاقة تيست/اختبار — آمنة للنشر لكن احذف أي
                              بيانات حساسة مجاورة
                            </p>
                          )}
                        </div>
                      )}

                      {/* ✨ تفاصيل الهاتف الدولي */}
                      {item.country && (
                        <div className="mt-2 bg-blue-900/20 border border-blue-700/40 rounded-lg p-2 text-xs">
                          <span className="text-blue-400">
                            🌍 الدولة المكتشفة من المقدمة:{" "}
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

            {/* التوصية */}
            <div className="bg-gray-900 border-t border-gray-800 p-4">
              {result.should_block ? (
                <p className="text-red-400 text-sm font-medium">
                  🚫 لا ترسل هذا النص لأي أداة AI خارجية — يحتوي على بيانات
                  حساسة!
                </p>
              ) : (
                <p className="text-green-400 text-sm font-medium">
                  ✅ النص آمن للإرسال
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── أمثلة سريعة ── */}
        {!result && (
          <div className="mt-8">
            <p className="text-gray-600 text-sm mb-3 text-center">
              جرب هاي الأمثلة:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  label: "🔴 بطاقة حقيقية (Luhn)",
                  text: "رقم بطاقتي Visa هو 4916123456789012 تاريخ انتهاء 12/27",
                },
                {
                  label: "🧪 بطاقة تيست (Stripe)",
                  text: "بطاقة التيست هي 4242424242424242 cvv 123",
                },
                {
                  label: "🔴 كلمة مرور",
                  text: "password=MySecret123 للدخول على السيرفر",
                },
                {
                  label: "🌍 هاتف دولي",
                  text: "تواصل معي على +970591234567 أو 00966501234567",
                },
                {
                  label: "📍 عنوان سكن",
                  text: "أسكن في رام الله شارع النزهة بناء 5",
                },
                {
                  label: "🟠 قاعدة بيانات",
                  text: "mongodb://admin:pass123@localhost:27017/mydb",
                },
                {
                  label: "🟢 سؤال عادي",
                  text: "كيف أكتب حلقة for في Python؟",
                },
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setText(example.text)}
                  className="text-right bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg p-3 text-sm text-gray-400 transition-all"
                >
                  <span className="font-medium">{example.label}</span>
                  <span className="text-gray-600 mr-2 text-xs">
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
              الكلية الجامعية للعلوم التطبيقية - UCAS
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
