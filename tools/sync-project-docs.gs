/**
 * Sync portfolio project content from GitHub (src/content/site-content.json)
 * into each project Doc's "Project Page" tab. One-way: GitHub -> Docs.
 *
 * Self-extending: the project -> Google Doc map lives in site-content.json under
 * `projectDocs`. Add a project there and this script picks it up — no edits here.
 *
 * Script Properties (Project Settings -> Script Properties):
 *   GH_BRANCH  - branch to read (default: main)
 *   GH_TOKEN   - GitHub fine-grained PAT with "Contents: read" (private repo)
 */
const REPO_OWNER   = 'AndrewRichardsDesign';
const REPO_NAME    = 'productdesignportfolio';
const CONTENT_PATH = 'src/content/site-content.json';
const TAB_TITLE    = 'Project Page';

// Top-level keys that are page plumbing, not narrative sections to render.
const SKIP_SECTIONS = ['backToPortfolio', 'brand', 'toc', 'hero', 'footerCta'];

// Keys whose string[] should render as bullet lists (else paragraphs).
const BULLET_KEYS = [
  'productTypeList','roleList','usersList','workstreamsList','processSteps',
  'inputs','collaborators','highlights','designGoals','roles','initiatives',
  'deliverables','launchSignals','skills'
];

/** RUN THIS to sync every mapped project. */
function syncAllProjects() {
  const content = fetchContent_();
  const map = content.projectDocs || {};
  const keys = Object.keys(map);
  if (!keys.length) throw new Error('No "projectDocs" map found in site-content.json.');

  const seams = content.seams || {};
  keys.forEach(function (key) {
    if (!content[key]) { Logger.log('SKIP "' + key + '": no content section by that key.'); return; }
    // Seam-inserted content lives in a separate top-level `seams` object, keyed
    // "<projectKey>-<sectionId>". Collect this project's groups to render too.
    const mine = {};
    Object.keys(seams).forEach(function (sk) {
      if (sk.indexOf(key + '-') === 0) mine[sk] = seams[sk];
    });
    writeProjectDoc_(map[key], content[key], mine);
    Logger.log('Updated ' + key + ' -> ' + map[key]);
  });

  // Flag any project page that exists in content but has no doc mapping yet.
  detectProjectPages_(content).forEach(function (key) {
    if (!map[key]) Logger.log('UNMAPPED project page "' + key + '": add it to projectDocs to sync.');
  });
}

/**
 * Trigger entry point. Only rewrites the docs when site-content.json has a new
 * commit since the last sync — cheap to run often (one small API call when
 * nothing changed). Point a minutes-timer trigger at THIS function.
 */
function syncIfChanged() {
  const props  = PropertiesService.getScriptProperties();
  const branch = props.getProperty('GH_BRANCH') || 'main';
  const sha    = latestContentSha_(branch);
  if (sha && sha === props.getProperty('LAST_CONTENT_SHA')) {
    Logger.log('No content change since last sync; skipping.');
    return;
  }
  syncAllProjects();
  if (sha) props.setProperty('LAST_CONTENT_SHA', sha);
}

/** Latest commit SHA that touched site-content.json (null = couldn't tell). */
function latestContentSha_(branch) {
  const token = PropertiesService.getScriptProperties().getProperty('GH_TOKEN') || '';
  const url = 'https://api.github.com/repos/' + REPO_OWNER + '/' + REPO_NAME +
              '/commits?path=' + encodeURIComponent(CONTENT_PATH) +
              '&sha=' + encodeURIComponent(branch) + '&per_page=1';
  const headers = { 'Accept': 'application/vnd.github+json' };
  if (token) headers['Authorization'] = 'token ' + token;
  const res = UrlFetchApp.fetch(url, { headers: headers, muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) return null;   // on error, fall through and sync
  const arr = JSON.parse(res.getContentText());
  return (arr && arr.length) ? arr[0].sha : null;
}

/**
 * Web App endpoint. A GitHub Action POSTs here on push to main (see
 * .github/workflows/sync-docs.yml) so the docs update within seconds.
 * Protected by a shared secret stored in the WEBHOOK_SECRET script property,
 * sent by the caller as a "secret" form/query parameter.
 *
 * Deploy: Deploy -> New deployment -> Web app -> Execute as: Me,
 * Who has access: Anyone. Re-deploy a NEW VERSION after editing this file.
 */
function doPost(e) {
  const expected = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET') || '';
  const got = (e && e.parameter && e.parameter.secret) || '';
  if (!expected || got !== expected) {
    return json_({ ok: false, error: 'unauthorized' });
  }
  try {
    syncIfChanged();
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** RUN THIS FIRST to confirm each mapped doc has a "Project Page" tab. */
function listTabs() {
  const content = fetchContent_();
  const map = content.projectDocs || {};
  Object.keys(map).forEach(function (key) {
    const titles = DocumentApp.openById(map[key]).getTabs().map(function (t) { return t.getTitle(); });
    Logger.log(key + ' (' + map[key] + '): ' + titles.join(' | '));
  });
}

/** A project page is any top-level object carrying the page markers. */
function detectProjectPages_(content) {
  return Object.keys(content).filter(function (k) {
    const v = content[k];
    return v && typeof v === 'object' && !Array.isArray(v) &&
           'backToPortfolio' in v && 'footerCta' in v && 'toc' in v;
  });
}

function fetchContent_() {
  const props  = PropertiesService.getScriptProperties();
  const token  = props.getProperty('GH_TOKEN') || '';
  const branch = props.getProperty('GH_BRANCH') || 'main';
  const url = 'https://api.github.com/repos/' + REPO_OWNER + '/' + REPO_NAME +
              '/contents/' + CONTENT_PATH + '?ref=' + encodeURIComponent(branch);
  const headers = { 'Accept': 'application/vnd.github.raw' };
  if (token) headers['Authorization'] = 'token ' + token;
  const res = UrlFetchApp.fetch(url, { headers: headers, muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) {
    throw new Error('GitHub fetch failed (' + res.getResponseCode() + '): ' +
                    res.getContentText().slice(0, 300));
  }
  return JSON.parse(res.getContentText());
}

function writeProjectDoc_(docId, data, seams) {
  const doc = DocumentApp.openById(docId);
  const tab = findTab_(doc.getTabs(), TAB_TITLE);
  if (!tab) throw new Error('No tab titled "' + TAB_TITLE + '" in doc ' + docId);
  const body = tab.asDocumentTab().getBody();
  body.clear();
  Object.keys(data).forEach(function (key) {
    if (SKIP_SECTIONS.indexOf(key) !== -1) return;
    const section = data[key];
    if (section && typeof section === 'object' && !Array.isArray(section)) {
      renderSection_(body, section);
    }
  });
  // Render content inserted at page "seams" (admin Insert) so the Doc holds ALL
  // text — e.g. the "Risks that shaped the product" section. Appended after the
  // structured sections (one-way GitHub -> Docs; layout isn't preserved).
  if (seams) renderSeams_(body, seams);
}

/** Render every seam group for a project (sorted by section id, then gap). */
function renderSeams_(body, groups) {
  Object.keys(groups).sort().forEach(function (gkey) {
    const gaps = groups[gkey] || {};
    Object.keys(gaps).map(Number).sort(function (a, b) { return a - b; }).forEach(function (gi) {
      const arr = gaps[gi];
      if (Array.isArray(arr)) arr.forEach(function (entry) { renderProseEntry_(body, entry, false); });
    });
  });
}

function findTab_(tabs, title) {
  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].getTitle() === title) return tabs[i];
    var child = findTab_(tabs[i].getChildTabs(), title);
    if (child) return child;
  }
  return null;
}

function renderSection_(body, section) {
  const done = {};
  if (section.eyebrow) {
    heading_(body, section.eyebrow, DocumentApp.ParagraphHeading.HEADING1);
    done.eyebrow = true;
  }
  if (section.titleLead || section.titleHighlight) {
    const t = [section.titleLead, section.titleHighlight].filter(Boolean).join(' ');
    heading_(body, t, DocumentApp.ParagraphHeading.HEADING2);
    done.titleLead = true; done.titleHighlight = true;
  }
  Object.keys(section).forEach(function (key) {
    if (done[key]) return;
    renderField_(body, key, section[key], section, done);
  });
}

// --- paragraph helpers --------------------------------------------------
// Apps Script makes a newly appended paragraph inherit the previous one's
// trailing text style, so italic/bold can "bleed" forward. Every helper sets
// the run style explicitly to keep each paragraph's formatting deliberate.

function heading_(body, text, level) {
  const p = body.appendParagraph(text);
  p.editAsText().setItalic(false).setBold(false);
  p.setHeading(level);
  return p;
}

function para_(body, text, italic) {
  const p = body.appendParagraph(text);
  p.editAsText().setBold(false).setItalic(!!italic);
  return p;
}

function bullet_(body, text) {
  const li = body.appendListItem(text).setGlyphType(DocumentApp.GlyphType.BULLET);
  li.editAsText().setItalic(false).setBold(false);
  return li;
}

// --- prose blocks -------------------------------------------------------
// Prose arrays may contain plain strings (= paragraphs) or typed block objects
// { type: 'paragraph' | 'heading', style?, text } produced by the admin editor.
// These helpers render either shape so a mixed array never breaks the sync.

function isBlock_(x) {
  return x && typeof x === 'object' && !Array.isArray(x) &&
         ((typeof x.text === 'string' && (x.type === 'paragraph' || x.type === 'heading')) ||
          x.type === 'element');
}

/** Render an element/card block's data as plain text (formatting isn't kept). */
function renderElement_(body, d) {
  d = d || {};
  const num = d.num ? String(d.num).replace(/\.\s*$/, '') + '.  ' : '';
  if (d.title) heading_(body, num + d.title, DocumentApp.ParagraphHeading.HEADING3);
  // Preferred order for the common element fields; anything else follows.
  const order = ['eyebrow', 'value', 'label', 'flow', 'text', 'question', 'desc'];
  const printed = { num: true, title: true };
  order.forEach(function (k) {
    if (d[k] && !printed[k]) { para_(body, String(d[k]), false); printed[k] = true; }
  });
  Object.keys(d).forEach(function (k) {
    if (!printed[k] && typeof d[k] === 'string' && d[k]) para_(body, String(d[k]), false);
  });
}

function headingForStyle_(style) {
  switch (style) {
    case 'h2': return DocumentApp.ParagraphHeading.HEADING2;
    case 'h3': return DocumentApp.ParagraphHeading.HEADING3;
    case 'h4': return DocumentApp.ParagraphHeading.HEADING4;
    case 'eyebrow': return DocumentApp.ParagraphHeading.HEADING5;
    default: return DocumentApp.ParagraphHeading.HEADING3;
  }
}

/** Render one prose entry (string or typed block) as a paragraph/heading/bullet. */
function renderProseEntry_(body, entry, bullets) {
  if (typeof entry === 'string') {
    bullets ? bullet_(body, entry) : para_(body, entry, false);
  } else if (isBlock_(entry)) {
    if (entry.type === 'element') renderElement_(body, entry.data || {});
    else if (entry.type === 'heading') heading_(body, entry.text, headingForStyle_(entry.style));
    else para_(body, entry.text, false);
  } else {
    renderObject_(body, entry); // structured item, not a prose block
  }
}

function renderField_(body, key, val, section, done) {
  // Combine "...Lead" + "...Highlight" pairs into one line (HMW, quotes, etc.)
  if (/Lead$/.test(key)) {
    const hk = key.replace(/Lead$/, 'Highlight');
    if (typeof section[hk] === 'string') {
      para_(body, val + ' ' + section[hk], false);
      done[hk] = true;
      return;
    }
  }
  if (typeof val === 'string') {
    if (/(Label|Title)$/.test(key)) heading_(body, val, DocumentApp.ParagraphHeading.HEADING3);
    else para_(body, val, false);
    return;
  }
  if (Array.isArray(val) && val.length) {
    // A prose list is any array of strings and/or typed blocks; anything else
    // (e.g. {title, desc} items) is a structured object list.
    const proseList = val.every(function (x) { return typeof x === 'string' || isBlock_(x); });
    if (proseList) {
      const bullets = BULLET_KEYS.indexOf(key) !== -1;
      val.forEach(function (entry) { renderProseEntry_(body, entry, bullets); });
    } else {
      val.forEach(function (item) { renderObject_(body, item); });
    }
  }
}

function renderObject_(body, item) {
  if (!item || typeof item !== 'object') return;
  if (isBlock_(item)) { renderProseEntry_(body, item, false); return; }  // typed prose block
  if ('value' in item && 'label' in item) {                 // stat
    const p = para_(body, item.value + '  ' + item.label, false);
    if (item.value.length) p.editAsText().setBold(0, item.value.length - 1, true);
  } else if ('n' in item && 'q' in item) {                  // numbered question
    para_(body, item.n + '.  ' + item.q, false);
  } else if ('title' in item && 'question' in item) {       // case study
    heading_(body, item.title, DocumentApp.ParagraphHeading.HEADING3);
    para_(body, item.question, true);
  } else if ('insight' in item) {                           // insight -> response
    labeled_(body, 'Insight', item.insight);
    if (item.requirement) labeled_(body, 'Requirement', item.requirement);
    if (item.response) labeled_(body, 'Response', item.response);
  } else if ('title' in item && 'tradeoff' in item) {       // decision
    heading_(body, (item.n ? item.n + '.  ' : '') + item.title, DocumentApp.ParagraphHeading.HEADING3);
    if (item.desc) para_(body, item.desc, false);
    labeled_(body, 'Tradeoff', item.tradeoff);
  } else if ('title' in item && 'flow' in item) {           // product-system model
    heading_(body, item.title, DocumentApp.ParagraphHeading.HEADING3);
    para_(body, item.flow, true);                           // only the flow path is italic
    if (item.desc) para_(body, item.desc, false);
  } else if ('title' in item && 'desc' in item) {           // {title, desc} or {title, desc[]}
    heading_(body, item.title, DocumentApp.ParagraphHeading.HEADING3);
    [].concat(item.desc).forEach(function (d) { para_(body, d, false); });
  } else {                                                  // unknown shape: dump strings
    Object.keys(item).forEach(function (k) {
      if (typeof item[k] === 'string') para_(body, item[k], false);
    });
  }
}

function labeled_(body, label, text) {
  const p = para_(body, label + ': ' + text, false);
  p.editAsText().setBold(0, label.length, true);   // bold "Label:"
  return p;
}
