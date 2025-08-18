// lib/retriever.ts
import data from "./restaurantData.json";

type Doc = {
  id: string;
  section: string;
  text: string;
  url?: string;
};

type IndexedDoc = Doc & { normText: string };

export type RelevantDoc = Doc & { score: number };

/**
 * Build a flat corpus of short docs from our JSON so we can do simple lexical retrieval.
 * (Easy to swap with embeddings later.)
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
    text: `Address: ${data.location.address}. Landmarks: ${data.location.landmarks.join(", ")}`
  });

  docs.push({
    id: "map",
    section: "Map",
    text: `Map: ${data.location.mapUrl}`
  });

  docs.push({
    id: "contact",
    section: "Contact",
    text: `Phone: ${data.contact.phone}. Email: ${data.contact.email}. Website: ${data.contact.website}. Facebook: ${data.contact.social.facebook}. Instagram: ${data.contact.social.instagram}. TikTok: ${data.contact.social.tiktok}`
  });

  // Hours
  docs.push({
    id: "hours",
    section: "Hours",
    text: data.hours.map(h => `${h.days} ${h.open}–${h.close}`).join(" | ")
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
    text: `Meeting halls: ${mh.summary}. Amenities: ${mh.amenities.join(", ")}. Notes: ${mh.bookingNotes.join("; ")}. Capacity: Large ${mh.capacity.largeHall}, Small each ${mh.capacity.smallHallEach} (x${mh.capacity.totalSmallHalls}).`
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
      text: `Delivery available: ${data.services.delivery.available ? "Yes" : "No"}. ${data.services.delivery.notes}`
    });
  }

  // Menu (signature items)
  data.menu.signature.forEach((item, idx) => {
    docs.push({
      id: `menu-signature-${idx}`,
      section: "Menu · Signature",
      text: `${item.title}: ${item.description}`
    });
  });

  docs.push({
    id: "menu-notes",
    section: "Menu · Notes",
    text: data.menu.notes.join(" ")
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

const CORPUS: IndexedDoc[] = buildCorpus().map(d => ({ ...d, normText: normalize(d.text) }));

const STOP = new Set([
  "the","a","an","and","or","of","to","for","in","on","at","with","do","does","have","has","is","are","be","by","from","it","this","that","what","how","can","i","we","you","they","our","your","about","please"
]);

function tokenize(q: string) {
  return normalize(q).split(" ").filter(w => w && !STOP.has(w));
}

/**
 * Simple keyword scoring (term frequency + light synonyms), plus intent boosts.
 */
export function getRelevantInfo(query: string, topK = 6): RelevantDoc[] {
  const terms = tokenize(query);
  if (!terms.length) {
    // Return sensible defaults
    return CORPUS.filter(d => ["Hours","Location","Reservations","Meeting Halls"].includes(d.section))
                 .slice(0, topK)
                 .map(d => ({ id: d.id, section: d.section, text: d.text, score: 0.1 }));
  }

  // Lightweight synonyms to improve recall
  const synonymMap: Record<string, string[]> = {
    booking: ["book","reserve","reservation","reservations","meeting","hall","event","venue"],
    menu: ["dish","food","meal","signature","specials"],
    hours: ["time","open","opening","close","closing","schedule"],
    location: ["where","address","map","directions","near","located"],
    price: ["cost","fee","fees","deposit","price","prices"],
    catering: ["buffet","banquet","serve","service","cater"],
    contact: ["phone","email","call","reach","number","mobile","website","facebook","instagram","tiktok"],
    capacity: ["capacity","guests","people","size","seats"]
  };

  const expandedTerms = new Set<string>(terms);
  for (const t of terms) {
    if (synonymMap[t]) {
      synonymMap[t].forEach(s => expandedTerms.add(s));
    }
  }

  const joined = terms.join(" ");

  const scores = CORPUS.map(doc => {
    let score = 0;

    expandedTerms.forEach(t => {
      // frequency weight
      const matches = doc.normText.split(t).length - 1;
      score += matches * 2;

      // section/field boosting
      if (doc.section.toLowerCase().includes(t)) score += 1.5;
    });

    // Manual boosts for likely intents
    if (/meeting|hall|reserve|book|reservation/.test(joined)) {
      if (doc.section.toLowerCase().includes("meeting")) score += 2.5;
      if (doc.section.toLowerCase().includes("reserv")) score += 1.5;
    }

    if (/menu|dish|food|signature/.test(joined)) {
      if (doc.section.toLowerCase().includes("menu")) score += 2.5;
    }

    if (/hour|open|close|time/.test(joined)) {
      if (doc.section.toLowerCase().includes("hours")) score += 2.5;
    }

    if (/phone|email|call|number|contact|facebook|instagram|tiktok|website/.test(joined)) {
      if (doc.section.toLowerCase().includes("contact")) score += 3;
    }

    if (/where|address|map|direction|located|near/.test(joined)) {
      if (doc.section.toLowerCase().includes("location") || doc.section.toLowerCase().includes("map")) score += 2.5;
    }

    if (/capacity|guests|people|size|seats/.test(joined)) {
      if (doc.section.toLowerCase().includes("meeting")) score += 2.5;
    }

    return { id: doc.id, section: doc.section, text: doc.text, score };
  });

  return scores
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/** Turn the chosen docs into a compact context block for the LLM. */
export function formatContext(docs: RelevantDoc[], charLimit = 1200): string {
  const lines: string[] = [];
  for (const d of docs) {
    const chunk = `• [${d.section}] ${d.text}`;
    if ((lines.join("\n").length + chunk.length) > charLimit) break;
    lines.push(chunk);
  }
  return lines.join("\n");
}
