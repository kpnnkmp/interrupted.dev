// transforms a data string to a human readable format
export function readableDate(date) {
  return new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// head of the list
export function head(list, n) {
  return list.slice(0, n);
}

export function index(list, n = 1) {
  return list[n];
}

// Get all tags, optionally with counts
export function getAllTags(collection, count = false) {
  let tags = {};
  for (let item of collection) {
    (item.data.tags || []).forEach((tag) => {
      if (tag === "all") return;
      if (tags[tag]) tags[tag]++;
      else tags[tag] = 1;
    });
  }

  return Object.entries(tags)
    .sort((a, b) => (a[1] < b[1] ? 1 : -1))
    .map((tag) => (count ? tag : tag[0]));
}

// posts carrying a tag; feed it `collections.posts` to exclude archived ones
export function byTag(posts, tag) {
  return posts.filter((post) => (post.data.tags || []).includes(tag));
}

export function objectify(str, key) {
  if (!str) return null;
  return { [key]: str };
}

// --- search index -------------------------------------------------------

const STOPWORDS = new Set(
  "a an and are as at be but by for from has have how i in is it its of on or that the this to was were what when where which who will with you your".split(
    " ",
  ),
);

// code samples are noise for search
function stripCode(html) {
  if (!html) return "";
  return html
    .replace(/<pre[\s\S]*?<\/pre>/gi, " ")
    .replace(/<code[\s\S]*?<\/code>/gi, " ");
}

// rendered HTML -> lowercased plain text
function stripToText(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

// h2/h3 text, minus the markdown-it-anchor "#" permalink
function extractHeadings(html) {
  if (!html) return "";
  return (html.match(/<h[23][^>]*>[\s\S]*?<\/h[23]>/gi) || [])
    .map((h) =>
      h
        .replace(/<[^>]+>/g, " ")
        .replace(/&[a-z0-9#]+;/gi, " ") // drop html entities (&lt; &gt; &amp; …)
        .replace(/#/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .join(" ");
}

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

// Build a compact, ranked search index: meta + headings + a per-post
// keyword "fingerprint" (top TF-IDF terms of the body, code stripped).
export function searchIndex(collection) {
  const docs = collection.map((post) => {
    const tf = {};
    for (const t of tokenize(stripToText(stripCode(post.templateContent))))
      tf[t] = (tf[t] || 0) + 1;
    return { post, tf };
  });

  const N = docs.length;
  const df = {};
  for (const { tf } of docs)
    for (const t in tf) df[t] = (df[t] || 0) + 1;

  return docs.map(({ post, tf }) => ({
    url: post.url,
    title: post.data.title,
    description: post.data.description || "",
    date: readableDate(post.data.date),
    tags: (post.data.tags || []).filter((t) => t !== "all"),
    headings: extractHeadings(post.templateContent),
    summary: Object.keys(tf)
      .map((t) => [t, tf[t] * Math.log(N / df[t])])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25)
      .map(([t]) => t)
      .join(" "),
  }));
}

// --- blog stats ---------------------------------------------------------

const WPM = 200;
// Monday-first: EU convention. getDay() is Sunday-first, hence the shift.
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// one chart series: a row per bucket, plus the peak so the template can size
// bars without a second pass
function series(rows) {
  return { rows, max: Math.max(0, ...rows.map((r) => r.count)) };
}

// Word counts and cadence over a post collection. Code samples are stripped
// before counting, same as the search index does.
export function stats(collection) {
  const posts = collection.map((post) => ({
    date: new Date(post.data.date),
    words: stripToText(stripCode(post.templateContent))
      .split(/\s+/)
      .filter(Boolean).length,
  }));

  const totalWords = posts.reduce((sum, p) => sum + p.words, 0);
  const minutes = Math.round(totalWords / WPM);

  const byDay = series(
    DAYS.map((label, i) => ({
      label,
      count: posts.filter((p) => (p.date.getDay() + 6) % 7 === i).length,
    })),
  );

  // every year from first post to last, so a silent year reads as a gap
  const years = posts.map((p) => p.date.getFullYear());
  const span = posts.length
    ? Array.from(
        { length: Math.max(...years) - Math.min(...years) + 1 },
        (_, i) => Math.min(...years) + i,
      )
    : [];
  const byYear = series(
    span.map((year) => ({
      label: String(year),
      count: posts.filter((p) => p.date.getFullYear() === year).length,
    })),
  );

  // nl-NL: dot as thousands separator (1.234)
  const fmt = (n) => n.toLocaleString("nl-NL");

  return {
    postCount: posts.length,
    totalWords: fmt(totalWords),
    avgWords: fmt(posts.length ? Math.round(totalWords / posts.length) : 0),
    readingTime: `${Math.floor(minutes / 60)}h ${minutes % 60}min`,
    byDay,
    byYear,
  };
}
