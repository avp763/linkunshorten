export async function POST(request) {
  const { url } = await request.json();

  if (!url || !url.startsWith('http')) {
    return Response.json({ error: 'Valid URL required' }, { status: 400 });
  }

  try {
    // 1. Expand URL
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers: {
        'User-Agent': 'LinkUnshorten/1.0 (+https://linkunshorten.com)',
      },
    });

    const finalUrl = res.url;
    const domain = new URL(finalUrl).hostname;

    // 2. AI-based safety analysis
    const analysis = analyzeLinkWithAI(finalUrl, domain);

    return Response.json({
      original: url,
      final: finalUrl,
      domain,
      safe: analysis.isSafe,
      confidence: analysis.confidence,
      reasons: analysis.reasons,
      threats: analysis.threats,
    });
  } catch (err) {
    return Response.json(
      { error: 'Invalid link or server blocked request' },
      { status: 400 }
    );
  }
}

// 🤖 Improved AI Analysis Function
function analyzeLinkWithAI(finalUrl, domain) {
  const url = finalUrl.toLowerCase();
  const domainParts = domain.split('.');

  // Suspicious keywords (weighted)
  const suspiciousPatterns = [
    { pattern: 'login', weight: 3 },
    { pattern: 'verify', weight: 3 },
    { pattern: 'account', weight: 2 },
    { pattern: 'secure', weight: 2 },
    { pattern: 'bank', weight: 4 },
    { pattern: 'paypal', weight: 4 },
    { pattern: 'amazon', weight: 3 },
    { pattern: 'free', weight: 1 },
    { pattern: 'win', weight: 2 },
    { pattern: 'prize', weight: 2 },
    { pattern: 'urgent', weight: 2 },
    { pattern: 'confirm', weight: 2 },
    { pattern: 'update', weight: 2 },
    { pattern: 'alert', weight: 2 },
    { pattern: 'scam', weight: 5 },
    { pattern: 'phish', weight: 5 },
    { pattern: 'malware', weight: 5 },
    { pattern: 'download', weight: 3 },
    { pattern: 'install', weight: 3 },
    { pattern: 'signin', weight: 3 },
    { pattern: 'password', weight: 3 },
  ];

  // Known bad TLDs (high risk)
  const badTLDs = ['tk', 'ml', 'ga', 'cf', 'ru', 'cn', 'top', 'xyz', 'club'];

  // Very suspicious TLDs (extremely high risk)
  const veryBadTLDs = ['tk', 'ml', 'ga', 'cf'];

  // Count suspicious matches
  let totalScore = 0;
  const reasons = [];
  const threats = [];

  // Check for suspicious keywords
  suspiciousPatterns.forEach(({ pattern, weight }) => {
    if (url.includes(pattern)) {
      totalScore += weight;
      reasons.push(`Contains suspicious keyword: "${pattern}"`);
    }
  });

  // Check for bad TLD
  const tld = domainParts[domainParts.length - 1];
  if (veryBadTLDs.includes(tld)) {
    totalScore += 8;
    reasons.push(`Very suspicious domain extension: .${tld}`);
    threats.push('Extremely risky domain extension');
  } else if (badTLDs.includes(tld)) {
    totalScore += 5;
    reasons.push(`Suspicious domain extension: .${tld}`);
    threats.push('Unusual domain extension');
  }

  // Check for long domain (obfuscation tactic)
  if (domain.length > 30) {
    totalScore += 3;
    reasons.push('Unnaturally long domain name');
  }

  // Check for multiple subdomains (obfuscation)
  if (domainParts.length > 4) {
    totalScore += 4;
    reasons.push('Multiple subdomains (possible obfuscation)');
  }

  // Check for IP-based domains (direct IP access)
  if (/^\d+\.\d+\.\d+\.\d+$/.test(domain)) {
    totalScore += 10;
    reasons.push('IP address used instead of domain');
    threats.push('Direct IP access - highly suspicious');
  }

  // Check for URL length (long URLs often malicious)
  if (url.length > 100) {
    totalScore += 2;
    reasons.push('Unusually long URL');
  }

  // Check for multiple dots in path (obfuscation)
  if ((finalUrl.match(/\./g) || []).length > 5) {
    totalScore += 3;
    reasons.push('Excessive dots in URL (possible obfuscation)');
  }

  // Check for common phishing patterns
  if (url.includes('cgi-bin') || url.includes('cmd.exe') || url.includes('admin')) {
    totalScore += 4;
    reasons.push('Contains executable/command patterns');
    threats.push('Potential malware delivery');
  }

  // AI Confidence Score (0-100)
  const confidence = Math.min(100, totalScore * 8); // Scale up for better visibility

  // Determine safety based on threshold
  const isSafe = confidence < 40; // Lower threshold for better detection

  if (!isSafe) {
    if (confidence >= 70) {
      threats.push('High-risk phishing/malware attempt');
    } else if (confidence >= 40) {
      threats.push('Moderate risk detected');
    }
  }

  return {
    isSafe,
    confidence: Math.round(confidence),
    reasons: reasons.slice(0, 4), // Top 4 reasons
    threats
  };
}