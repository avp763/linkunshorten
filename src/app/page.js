'use client';

import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';




export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const unshorten = async () => {
    const url = inputRef.current.value.trim();
    if (!url) {
      setErrorMessage('Please enter a URL');
      return;
    }
    if (!isValidUrl(url)) {
      setErrorMessage('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setErrorMessage(null);
    setLoading(true);
    setCopied(false);
    setResult(null);

    try {
      const res = await fetch('/api/unshorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        throw new Error('API request failed');
      }
      const data = await res.json();
      setResult(data);
      inputRef.current.value = '';
    } catch (err) {
      setResult({ error: 'Unable to check link. Please try again.' });
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setResult(null);
    setErrorMessage(null);
    inputRef.current.value = '';
    inputRef.current.focus();
  };

  // Function to render proper icons
  const renderIcon = (type) => {
    switch(type) {
      case 'safe':
        return (
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'danger':
        return (
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'loading':
        return (
          <svg className="animate-spin w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'copy':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'check':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'reset':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'ad':
        return (
          <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>LinkUnshorten - Check if Short Links Are Safe (bit.ly, tinyurl)</title>
        <meta name="description" content="Instantly expand and verify the safety of short links like bit.ly, tinyurl, t.co. Free tool to check if shortened URLs are phishing or malware." />
        <meta name="keywords" content="unshorten link, bit.ly checker, tinyurl checker, is bit.ly safe, check short link, expand url, phishing checker, link safety" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://linkunshorten.com" />
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ADSENSE_ID" crossOrigin="anonymous"></script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "LinkUnshorten",
            "url": "https://linkunshorten.com",
            "description": "Free tool to expand and check the safety of short links like bit.ly, tinyurl, and t.co.",
            "applicationCategory": "Security Tool",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-16">
          
          {/* Header */}
          <header className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-600 p-4 rounded-2xl shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              LinkUnshorten
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See where short links really go — instantly and safely
            </p>
          </header>

          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-1 mb-8">
            <div className="flex flex-col sm:flex-row gap-3 p-1">
              <input
                ref={inputRef}
                id="url"
                type="text"
                placeholder="Paste a short link (bit.ly, t.co, tinyurl...)"
                className="flex-1 px-6 py-5 text-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 dark:text-white dark:bg-gray-800 rounded-lg"
                onKeyDown={(e) => e.key === 'Enter' && unshorten()}
              />
              <button
                onClick={unshorten}
                disabled={loading}
                className={`px-8 py-5 font-bold rounded-lg transition-all text-lg flex items-center gap-2 ${
                  loading 
                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    {renderIcon('loading')}
                    Checking...
                  </>
                ) : (
                  <>
                    {renderIcon('check')}
                    Check Link
                  </>
                )}
              </button>
            </div>
            {errorMessage && (
              <p className="text-red-600 dark:text-red-400 text-sm px-6 pb-4">{errorMessage}</p>
            )}
          </div>

          {/* AdSense Banner Ad - Below Input */}
          <div className="mb-12">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center justify-center gap-1">
                  {renderIcon('ad')}
                  Sponsored Content
                </span>
              </div>
              {/* AdSense 728x90 Banner */}
              <div className="flex justify-center">
                <ins className="adsbygoogle"
                     style={{display: 'block'}}
                     data-ad-client="ca-pub-YOUR_ADSENSE_ID"
                     data-ad-slot="YOUR_BANNER_AD_SLOT"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
              </div>
            </div>
          </div>

          {/* Results */}
          {result && !result.error && (
            <div className={`rounded-2xl p-8 mb-12 transition-all duration-500 shadow-lg ${
              result.safe 
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700' 
                : 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-700'
            }`}>
              
              {/* Status Header */}
              <div className="flex items-center gap-4 mb-8">
                {renderIcon(result.safe ? 'safe' : 'danger')}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {result.safe ? 'Safe to Click' : 'Potential Risk Detected'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {result.safe 
                      ? 'This link is verified as safe' 
                      : 'Proceed with caution'}
                  </p>
                </div>
              </div>

              {/* URL Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                    {renderIcon('check')}
                    Original Link
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="font-mono text-gray-800 dark:text-gray-200 break-all text-sm">
                      {result.original}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                    {renderIcon(result.safe ? 'safe' : 'danger')}
                    Final Destination
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="font-mono text-gray-800 dark:text-gray-200 break-all text-sm mb-3">
                      {result.final}
                    </p>
                    <button
                      onClick={() => copyToClipboard(result.final)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      {renderIcon('copy')}
                      {copied ? 'Copied!' : 'Copy URL'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Domain Info */}
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex flex-wrap items-center gap-8">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Domain</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{result.domain}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</p>
                    <p className={`font-semibold ${result.safe ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {result.safe ? 'Trusted' : 'Suspicious'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Risk Level</p>
                    <p className={`font-semibold ${result.safe ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {result.safe ? 'Low' : 'High'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Warning */}
              {!result.safe && (
                <div className="mt-6 pt-6 border-t border-red-200 dark:border-red-700/50">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    {renderIcon('danger')}
                    Security Alert
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    This link exhibits characteristics of phishing or malicious activity. 
                    Do not enter personal information or passwords.
                  </p>
                  <a
                    href="https://go.nordvpn.net/XXXXX" // ← Replace with your affiliate
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold py-3 px-6 rounded-lg hover:from-red-700 hover:to-rose-700 transition-all shadow-lg"
                  >
                    🔐 Protect Yourself (70% OFF) →
                  </a>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Affiliate link. Supports tools like this.</p>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {result?.error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-2xl p-6 mb-12">
              <div className="flex items-center gap-3">
                {renderIcon('danger')}
                <p className="text-red-700 dark:text-red-300 font-medium">{result.error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="text-center mb-12">
              <button
                onClick={reset}
                className="px-6 py-3 font-medium rounded-lg transition-all flex items-center gap-2 mx-auto bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {renderIcon('reset')}
                Clear Results
              </button>
            </div>
          )}

          {/* AdSense In-Content Ad - Between Sections */}
          <div className="mb-12">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center justify-center gap-1">
                  {renderIcon('ad')}
                  Advertisement
                </span>
              </div>
              {/* AdSense Responsive Ad */}
              <div className="flex justify-center">
                <ins className="adsbygoogle"
                     style={{display: 'block'}}
                     data-ad-client="ca-pub-YOUR_ADSENSE_ID"
                     data-ad-slot="YOUR_IN_CONTENT_AD_SLOT"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12 border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">What is a short link?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  A short link is a condensed version of a long URL, often used for convenience on social media or in emails. 
                  Services like <strong>bit.ly</strong>, <strong>tinyurl</strong>, and <strong>t.co</strong> create these.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Are short links safe?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Not always. While many are legitimate, short links are often used in phishing scams and malware distribution 
                  because they hide the real destination. Always check where a link leads before clicking.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">How does LinkUnshorten work?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our tool follows the redirect chain of any short link and reveals the final destination. 
                  It also analyzes the URL for known phishing or malware patterns to help you stay safe.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Is LinkUnshorten free to use?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, LinkUnshorten is completely free and does not require any signup. We don't log or track your activity.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">What should I do if a link is marked as dangerous?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Do not click it. Avoid entering any personal information. If you're unsure, contact the sender through 
                  another channel to verify the link's legitimacy.
                </p>
              </div>
            </div>
          </section>

          {/* AdSense Square Ad - Sidebar Style (Visible on md+ screens) */}
          <div className="hidden md:block fixed right-4 top-1/4 w-64">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center justify-center gap-1">
                  {renderIcon('ad')}
                  Sponsored
                </span>
              </div>
              {/* AdSense 300x250 Square Ad */}
              <div className="flex justify-center">
                <ins className="adsbygoogle"
                     style={{display: 'block'}}
                     data-ad-client="ca-pub-YOUR_ADSENSE_ID"
                     data-ad-slot="YOUR_SQUARE_AD_SLOT"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
              </div>
            </div>
          </div>

          {/* SEO-Rich Content Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12 border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Why You Should Check Short Links Before Clicking
            </h2>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                In today's digital world, short links are everywhere. From social media posts to email newsletters, 
                services like <strong>bit.ly</strong>, <strong>tinyurl</strong>, and <strong>t.co</strong> make sharing 
                long URLs quick and easy. But convenience comes at a cost: <strong>security</strong>.
              </p>

              <h3>How Phishing Uses Short Links</h3>
              <p>
                Cybercriminals love short links because they obscure the real destination. A link that appears to go to 
                "paypal.com" might actually redirect to a fake login page designed to steal your credentials. 
                Always expand short links before clicking.
              </p>

              <h3>How to Stay Safe Online</h3>
              <ul>
                <li>Use tools like LinkUnshorten to preview where links go</li>
                <li>Look for HTTPS in the URL</li>
                <li>Be cautious of links in unsolicited emails or DMs</li>
                <li>Never enter sensitive info on unfamiliar sites</li>
              </ul>

              <h3>Free Tools to Check Link Safety</h3>
              <p>
                LinkUnshorten is one of the best free tools to check if a short link is safe. It works with all major 
                URL shorteners and provides instant results. No signup required.
              </p>
            </div>
          </section>

          {/* Footer Ad */}
          <div className="mb-12">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center justify-center gap-1">
                  {renderIcon('ad')}
                  Partner Offer
                </span>
              </div>
              {/* AdSense Link Unit or Text Ad */}
              <div className="flex justify-center">
                <ins className="adsbygoogle"
                     style={{display: 'block'}}
                     data-ad-client="ca-pub-YOUR_ADSENSE_ID"
                     data-ad-slot="YOUR_FOOTER_AD_SLOT"
                     data-ad-format="link"
                     data-full-width-responsive="true"></ins>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-gray-600 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700 pt-8">
            <p className="mb-2">We never log or track the links you check. Your privacy is our priority.</p>
            <p>Made with care for a safer internet.</p>
            <p className="mt-4">© {new Date().getFullYear()} LinkUnshorten.com</p>
          </footer>
        </div>

        {/* AdSense Initialization Script */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (adsbygoogle = window.adsbygoogle || []).push({});
            (adsbygoogle = window.adsbygoogle || []).push({});
            (adsbygoogle = window.adsbygoogle || []).push({});
            (adsbygoogle = window.adsbygoogle || []).push({});
          `
        }} />
      </main>
    </>
  );
}

// At the bottom of page.js
