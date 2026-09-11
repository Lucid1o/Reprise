const summaryRules = [
  { name: "Cybersecurity", words: ["cybersecurity", "security", "firewall", "nmap", "linux", "kali", "network security", "cryptography", "encryption", "vulnerability", "penetration"] },
  { name: "Programming", words: ["github", "git", "javascript", "typescript", "python", "java", "programming", "react", "node", "api", "code", "developer"] },
  { name: "Networking", words: ["network", "tcp", "udp", "ip address", "router", "switch", "dns", "http", "wireshark", "packet"] },
  { name: "Education", words: ["course", "tutorial", "lecture", "assignment", "college", "university", "documentation", "learn", "study"] },
  { name: "Research", words: ["research", "paper", "article", "documentation", "reference", "guide"] },
  { name: "Shopping", words: ["amazon", "product", "price", "buy", "shopping", "review", "laptop", "keyboard", "phone"] }
];

function cleanText(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function domainFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function summarizeSession(tabs, context, nextStep) {
  const titles = tabs.map(tab => cleanText(tab.title)).filter(Boolean);
  const domains = [...new Set(tabs.map(tab => domainFromUrl(tab.url)).filter(Boolean))];
  const searchable = `${titles.join(" ")} ${domains.join(" ")}`.toLowerCase();

  const categories = summaryRules
    .map(rule => ({
      name: rule.name,
      score: rule.words.reduce((score, word) => score + (searchable.includes(word) ? 1 : 0), 0)
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.name)
    .slice(0, 4);

  const importantSites = domains.slice(0, 6);
  const lead = categories.length ? categories.join(", ") : "general browsing";
  const inferredContext = context || `You were working across ${lead.toLowerCase()} resources.`;
  const inferredNext = nextStep || (categories.length
    ? `Continue reviewing the ${categories[0].toLowerCase()} material and act on the most relevant open tab.`
    : "Review the open tabs and continue from the most recently used resource.");

  return {
    overview: inferredContext,
    topics: categories.length ? categories : ["General"],
    importantSites,
    nextStep: inferredNext,
    tabCount: tabs.length,
    windowCount: new Set(tabs.map(tab => tab.windowId)).size
  };
}
