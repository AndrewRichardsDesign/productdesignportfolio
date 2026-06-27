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

  keys.forEach(function (key) {
    if (!content[key]) { Logger.log('SKIP "' + key + '": no content section by that key.'); return; }
    writeProjectDoc_(map[key], content[key]);
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

function writeProjectDoc_(docId, data) {
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
    if (typeof val[0] === 'string') {
      const bullets = BULLET_KEYS.indexOf(key) !== -1;
      val.forEach(function (s) { bullets ? bullet_(body, s) : para_(body, s, false); });
    } else {
      val.forEach(function (item) { renderObject_(body, item); });
    }
  }
}

function renderObject_(body, item) {
  if (!item || typeof item !== 'object') return;
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
