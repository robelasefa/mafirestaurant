// lib/retriever.ts
import data from "./restaurantData.json";

type Doc = {
  id: string;
  section: string;
  text: string;
  url?: string;
};

type IndexedDoc = Doc & { normText: string; tokens: string[] };

export type RelevantDoc = Doc & { score: number };

/**
 * Build a flat corpus of short docs from our JSON for lexical retrieval.
 */
function buildCorpus(): Doc[] {
  const docs: Doc[] = [];

  // Brand & basics
  docs.push({
    id: "brand",
    section: "Brand",
    text: `${data.brand.name}. ${data.brand.tagline}. ${data.brand.shortDescription}`
  });

  // Location & contact
  docs.push({
    id: "location",
    section: "Location",
    text: `Address: ${data.location.address}. Landmarks: ${data.location.landmarks.join(", ")}. Map: ${data.location.mapUrl}`
  });

  docs.push({
    id: "contact",
    section: "Contact",
    text: `Phone: ${Array.isArray(data.contact.phone) ? data.contact.phone.join(", ") : data.contact.phone}. Email: ${data.contact.email}. Website: ${data.contact.website}. Facebook: ${data.contact.social.facebook}. Instagram: ${data.contact.social.instagram}. TikTok: ${data.contact.social.tiktok}`
  });

  // Hours
  docs.push({
    id: "hours",
    section: "Hours",
    text: `Opening hours: ${data.hours.map(h => `${h.days} ${h.open}–${h.close}`).join(" | ")}. The restaurant is open every day.`
  });

  // Services
  docs.push({
    id: "services-reservations",
    section: "Reservations",
    text: `Reservations: ${data.services.reservations.howToBook}. ${data.services.reservations.emailTemplateHint}`
  });

  const mh = data.services.meetingHalls;
  docs.push({
    id: "services-meetingHalls",
    section: "Meeting Halls",
    text: `Meeting halls: ${mh.summary}. Amenities: ${mh.amenities.join(", ")}. Notes: ${mh.bookingNotes.join("; ")}. Capacity: Large hall ${mh.capacity.largeHall} guests, Small halls each ${mh.capacity.smallHallEach} guests (${mh.capacity.totalSmallHalls} small halls total). Total capacity across all halls: approximately ${mh.capacity.largeHall + mh.capacity.smallHallEach * mh.capacity.totalSmallHalls} guests.`
  });

  if (data.services.catering?.available) {
    docs.push({
      id: "services-catering",
      section: "Catering",
      text: `Catering available. ${data.services.catering.notes}`
    });
  }

  if (data.services.delivery) {
    docs.push({
      id: "services-delivery",
      section: "Delivery",
      text: `Delivery: ${data.services.delivery.available ? "Available" : "Not yet available"}. ${data.services.delivery.notes}`
    });
  }

  // Menu (signature items) — one doc per item for precise retrieval
  data.menu.signature.forEach((item, idx) => {
    docs.push({
      id: `menu-signature-${idx}`,
      section: `Menu · ${item.title}`,
      text: `${item.title}: ${item.description}`
    });
  });

  // Also a combined menu doc for general "what do you serve" questions
  docs.push({
    id: "menu-all",
    section: "Menu · All Items",
    text: `Signature dishes: ${data.menu.signature.map(item => item.title).join(", ")}. ${data.menu.notes.join(" ")}`
  });

  // Policies
  docs.push({
    id: "policies-booking",
    section: "Policies · Booking",
    text: data.policies.booking.join(" ")
  });

  docs.push({
    id: "policies-allergens",
    section: "Policies · Allergens",
    text: data.policies.allergens.join(" ")
  });

  // FAQs
  data.faqs.forEach((f, i) => {
    docs.push({
      id: `faq-${i}`,
      section: "FAQ",
      text: `Q: ${f.q} A: ${f.a}`
    });
  });

  // Developers
  docs.push({
    id: "developers",
    section: "Developers",
    text: `Site developers: ${data.developers.map(d => `${d.name} (${d.role})`).join(", ")}`
  });

  return docs;
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}

const STOP = new Set([
  "the", "a", "an", "and", "or", "of", "to", "for", "in", "on", "at", "with", "do", "does",
  "have", "has", "is", "are", "be", "by", "from", "it", "this", "that", "what", "how",
  "can", "i", "we", "you", "they", "our", "your", "about", "please", "me", "my", "tell",
  "know", "want", "would", "like", "there", "also", "very", "just", "so", "than", "some",
  "could", "should", "will", "may", "much", "many", "any", "get", "got", "which", "when",
  "where", "who", "if", "but", "not", "no", "yes", "up", "out", "all", "been", "being"
]);

function tokenize(q: string) {
  return normalize(q).split(" ").filter(w => w.length > 1 && !STOP.has(w));
}

// Pre-build the indexed corpus once at module load
const CORPUS: IndexedDoc[] = buildCorpus().map(d => ({
  ...d,
  normText: normalize(d.text),
  tokens: tokenize(d.text),
}));

// Bi-directional synonym groups: any word in a group maps to all others
const SYNONYM_GROUPS: string[][] = [
  ["book", "booking", "reserve", "reservation", "reservations"],
  ["meeting", "hall", "halls", "event", "venue", "conference", "room"],
  ["menu", "dish", "dishes", "food", "meal", "meals", "eat", "cuisine", "serve"],
  ["hour", "hours", "time", "open", "opening", "close", "closing", "schedule", "available"],
  ["location", "where", "address", "map", "directions", "direction", "near", "located", "find"],
  ["price", "cost", "fee", "fees", "deposit", "prices", "charge", "pay", "payment", "expensive", "cheap", "affordable"],
  ["catering", "buffet", "banquet", "cater"],
  ["contact", "phone", "email", "call", "reach", "number", "mobile", "website"],
  ["social", "facebook", "instagram", "tiktok"],
  ["capacity", "guests", "people", "size", "seats", "seating", "fit", "hold", "accommodate"],
  ["delivery", "deliver", "takeout", "pickup", "pick"],
  ["chicken", "poultry"],
  ["fish", "tilapia", "perch", "seafood"],
  ["beef", "steak", "meat", "lamb"],
  ["allergy", "allergen", "allergens", "allergies", "dietary", "gluten", "vegan", "vegetarian"],
  ["developer", "developers", "built", "made", "created", "who"],
];

// Build a lookup: word -> set of synonyms
const SYNONYM_MAP = new Map<string, Set<string>>();
for (const group of SYNONYM_GROUPS) {
  for (const word of group) {
    if (!SYNONYM_MAP.has(word)) SYNONYM_MAP.set(word, new Set());
    for (const other of group) {
      if (other !== word) SYNONYM_MAP.get(word)!.add(other);
    }
  }
}

function expandTerms(terms: string[]): Set<string> {
  const expanded = new Set(terms);
  for (const t of terms) {
    const syns = SYNONYM_MAP.get(t);
    if (syns) syns.forEach(s => expanded.add(s));
  }
  return expanded;
}

// Compute IDF (Inverse Document Frequency) for each unique token across the corpus
const IDF_MAP = new Map<string, number>();
{
  const allTokens = new Set<string>();
  CORPUS.forEach(d => d.tokens.forEach(t => allTokens.add(t)));
  for (const token of allTokens) {
    const docCount = CORPUS.filter(d => d.normText.includes(token)).length;
    IDF_MAP.set(token, Math.log((CORPUS.length + 1) / (docCount + 1)) + 1);
  }
}

/**
 * Improved scoring: TF-IDF style with synonym expansion, section boosting, and
 * n-gram overlap for multi-word matching.
 */
export function getRelevantInfo(query: string, topK = 6): RelevantDoc[] {
  const rawTerms = tokenize(query);
  if (!rawTerms.length) {
    // Return sensible defaults for empty queries
    return CORPUS
      .filter(d => ["Hours", "Location", "Reservations", "Meeting Halls", "Menu · All Items"].includes(d.section))
      .slice(0, topK)
      .map(d => ({ id: d.id, section: d.section, text: d.text, score: 0.1 }));
  }

  const expandedTerms = expandTerms(rawTerms);
  const queryNorm = normalize(query);

  // Build bi-grams from the query for phrase-level matching
  const bigrams: string[] = [];
  const rawArr = rawTerms;
  for (let i = 0; i < rawArr.length - 1; i++) {
    bigrams.push(`${rawArr[i]} ${rawArr[i + 1]}`);
  }

  const scores = CORPUS.map(doc => {
    let score = 0;

    // 1. TF-IDF style term matching
    for (const term of expandedTerms) {
      const tf = doc.normText.split(term).length - 1;
      if (tf > 0) {
        const idf = IDF_MAP.get(term) || 1;
        // Original query terms get full weight, expanded synonyms get 60%
        const weight = rawTerms.includes(term) ? 1.0 : 0.6;
        score += tf * idf * weight;
      }
    }

    // 2. Section name boost (if the query relates to the section)
    const sectionNorm = normalize(doc.section);
    for (const term of expandedTerms) {
      if (sectionNorm.includes(term)) {
        score += rawTerms.includes(term) ? 4 : 2;
      }
    }

    // 3. Bi-gram bonus (phrase-level matching is more precise than individual terms)
    for (const bg of bigrams) {
      if (doc.normText.includes(bg)) {
        score += 5;
      }
    }

    // 4. Exact substring match bonus (if the whole query appears verbatim)
    if (queryNorm.length > 4 && doc.normText.includes(queryNorm)) {
      score += 8;
    }

    return { id: doc.id, section: doc.section, text: doc.text, score };
  });

  return scores
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/** Turn the chosen docs into a compact context block for the LLM. */
export function formatContext(docs: RelevantDoc[], charLimit = 1500): string {
  const lines: string[] = [];
  for (const d of docs) {
    const chunk = `• [${d.section}] ${d.text}`;
    if ((lines.join("\n").length + chunk.length) > charLimit) break;
    lines.push(chunk);
  }
  return lines.join("\n");
}
