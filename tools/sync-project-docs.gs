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
    body.appendParagraph(section.eyebrow).setHeading(DocumentApp.ParagraphHeading.HEADING1);
    done.eyebrow = true;
  }
  if (section.titleLead || section.titleHighlight) {
    const t = [section.titleLead, section.titleHighlight].filter(Boolean).join(' ');
    body.appendParagraph(t).setHeading(DocumentApp.ParagraphHeading.HEADING2);
    done.titleLead = true; done.titleHighlight = true;
  }
  Object.keys(section).forEach(function (key) {
    if (done[key]) return;
    renderField_(body, key, section[key], section, done);
  });
}

function renderField_(body, key, val, section, done) {
  // Combine "...Lead" + "...Highlight" pairs into one line (HMW, quotes, etc.)
  if (/Lead$/.test(key)) {
    const hk = key.replace(/Lead$/, 'Highlight');
    if (typeof section[hk] === 'string') {
      body.appendParagraph(val + ' ' + section[hk]);
      done[hk] = true;
      return;
    }
  }
  if (typeof val === 'string') {
    if (/(Label|Title)$/.test(key))
      body.appendParagraph(val).setHeading(DocumentApp.ParagraphHeading.HEADING3);
    else
      body.appendParagraph(val);
    return;
  }
  if (Array.isArray(val) && val.length) {
    if (typeof val[0] === 'string') {
      const bullets = BULLET_KEYS.indexOf(key) !== -1;
      val.forEach(function (s) {
        if (bullets) body.appendListItem(s).setGlyphType(DocumentApp.GlyphType.BULLET);
        else body.appendParagraph(s);
      });
    } else {
      val.forEach(function (item) { renderObject_(body, item); });
    }
  }
}

function renderObject_(body, item) {
  if (!item || typeof item !== 'object') return;
  if ('value' in item && 'label' in item) {                 // stat
    const p = body.appendParagraph(item.value + '  ' + item.label);
    if (item.value.length) p.editAsText().setBold(0, item.value.length - 1, true);
  } else if ('n' in item && 'q' in item) {                  // numbered question
    body.appendParagraph(item.n + '.  ' + item.q);
  } else if ('title' in item && 'question' in item) {       // case study
    body.appendParagraph(item.title).setHeading(DocumentApp.ParagraphHeading.HEADING3);
    body.appendParagraph(item.question).editAsText().setItalic(true);
  } else if ('insight' in item) {                           // insight -> response
    labeled_(body, 'Insight', item.insight);
    if (item.requirement) labeled_(body, 'Requirement', item.requirement);
    if (item.response) labeled_(body, 'Response', item.response);
  } else if ('title' in item && 'tradeoff' in item) {       // decision
    body.appendParagraph((item.n ? item.n + '.  ' : '') + item.title)
        .setHeading(DocumentApp.ParagraphHeading.HEADING3);
    if (item.desc) body.appendParagraph(item.desc);
    labeled_(body, 'Tradeoff', item.tradeoff);
  } else if ('title' in item && 'flow' in item) {           // product-system model
    body.appendParagraph(item.title).setHeading(DocumentApp.ParagraphHeading.HEADING3);
    body.appendParagraph(item.flow).editAsText().setItalic(true);
    if (item.desc) body.appendParagraph(item.desc);
  } else if ('title' in item && 'desc' in item) {           // {title, desc} or {title, desc[]}
    body.appendParagraph(item.title).setHeading(DocumentApp.ParagraphHeading.HEADING3);
    [].concat(item.desc).forEach(function (d) { body.appendParagraph(d); });
  } else {                                                  // unknown shape: dump strings
    Object.keys(item).forEach(function (k) {
      if (typeof item[k] === 'string') body.appendParagraph(item[k]);
    });
  }
}

function labeled_(body, label, text) {
  const p = body.appendParagraph(label + ': ' + text);
  p.editAsText().setBold(0, label.length, true);   // bold "Label:"
  return p;
}
