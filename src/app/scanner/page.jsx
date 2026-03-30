"use client";
import { useState } from "react";

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

  const style = result
    ? riskStyles[result.risk_level] || riskStyles.safe
    : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6" dir="rtl">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">🛡️ ShadowAI Detector</h1>
          <p className="text-gray-400 text-lg">
            افحص نصك قبل إرساله لأي أداة ذكاء اصطناعي
          </p>
        </div>

        {/* مربع الإدخال */}
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

        {/* زر الفحص */}
        <button
          onClick={handleScan}
          disabled={loading || !text.trim()}
          className="w-full py-4 rounded-xl font-bold text-lg transition-all bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed"
        >
          {loading ? "⏳ جاري الفحص..." : "🔍 فحص الآن"}
        </button>

        {/* رسالة خطأ */}
        {error && (
          <div className="mt-4 bg-red-900/30 border border-red-700 rounded-xl p-4 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* النتيجة */}
        {result && (
          <div
            className={`mt-6 rounded-2xl border-2 ${style.border} overflow-hidden`}
          >
            {/* رأس النتيجة */}
            <div className={`${style.bg} ${style.text} p-5`}>
              <div className="flex justify-between items-center">
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
            </div>

            {/* المشاكل المكتشفة مع الـ snippet */}
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

        {/* أمثلة سريعة */}
        {!result && (
          <div className="mt-8">
            <p className="text-gray-600 text-sm mb-3 text-center">
              جرب هاي الأمثلة:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  label: "🔴 بطاقة ائتمان",
                  text: "رقم بطاقتي هو 4532015112830366 تاريخ انتهاء 12/26",
                },
                {
                  label: "🔴 كلمة مرور",
                  text: "password=MySecret123 للدخول على السيرفر",
                },
                {
                  label: "🟠 قاعدة بيانات",
                  text: "mongodb://admin:pass123@localhost:27017/mydb",
                },
                { label: "🟢 سؤال عادي", text: "كيف أكتب حلقة for في Python؟" },
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setText(example.text)}
                  className="text-right bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg p-3 text-sm text-gray-400 transition-all"
                >
                  <span className="font-medium">{example.label}</span>
                  <span className="text-gray-600 mr-2 text-xs">
                    {example.text.slice(0, 40)}...
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
