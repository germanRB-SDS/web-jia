import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE } from './site-content.js';

const root = dirname(fileURLToPath(import.meta.url));
const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const arrow = () =>
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>';

function safeHref(value) {
  const href = String(value).trim();
  const allowed = href.startsWith('#')
    || (/^\/(?!\/)/).test(href)
    || (/^\.\.?\//).test(href)
    || (/^https:\/\//i).test(href)
    || (/^mailto:/i).test(href)
    || (/^tel:/i).test(href);
  if (!allowed || /[\u0000-\u001f\u007f]/.test(href)) {
    throw new Error(`Unsupported link destination: ${href}`);
  }
  return escapeHtml(href);
}

function action([label, href], solid = false) {
  const className = solid ? 'action action--solid' : 'action';
  return `<a class="${className}" href="${safeHref(href)}"><span>${escapeHtml(label)}</span>${solid ? '' : arrow()}</a>`;
}

function projectMarkup(project) {
  if (!['flow', 'signal'].includes(project.variant)) {
    throw new Error(`Unsupported visualization variant: ${project.variant}`);
  }
  const facts = project.facts.map(([value, label]) =>
    `<span class="project__fact"><b>${escapeHtml(value)}</b><small>${escapeHtml(label)}</small></span>`
  ).join('');
  const bars = project.variant === 'signal'
    ? project.visualValues.map((height) => `<span style="--height:${escapeHtml(height)}"></span>`).join('')
    : '';
  return `<article class="project">
    <div class="project__body">
      <h3 class="project__name">${escapeHtml(project.name)}</h3>
      <p class="project__summary">${escapeHtml(project.summary)}</p>
      <div class="project__facts">${facts}</div>
      ${action(project.action)}
    </div>
    <div class="project__visual" aria-hidden="true"><div class="data-viz data-viz--${project.variant}">${bars}</div></div>
  </article>`;
}

const values = {
  themeColor: escapeHtml(SITE.visual.themeColor),
  documentTitle: escapeHtml(`${SITE.business.name} — reference`),
  homeLabel: escapeHtml(SITE.ui.homeLabel),
  navigationToggleLabel: escapeHtml(SITE.ui.navigationToggleLabel),
  navigationLabel: escapeHtml(SITE.ui.navigationLabel),
  continueLabel: escapeHtml(SITE.ui.continueLabel),
  noScriptMessage: escapeHtml(SITE.ui.noScriptMessage),
  businessName: escapeHtml(SITE.business.name),
  businessLocation: escapeHtml(SITE.business.location),
  businessEmail: escapeHtml(SITE.business.email),
  navLinks: SITE.nav.map(([label, href]) => `<a href="${safeHref(href)}">${escapeHtml(label)}</a>`).join(''),
  heroTitle: escapeHtml(SITE.hero.title),
  heroSummary: escapeHtml(SITE.hero.summary),
  heroActions: `${action(SITE.hero.primary, true)}${action(SITE.hero.secondary)}`,
  approachLede: escapeHtml(SITE.approach.lede),
  approachColumns: SITE.approach.columns.map((column) =>
    `<article class="stance__item"><h3>${escapeHtml(column.title)}</h3><p>${escapeHtml(column.body)}</p></article>`
  ).join(''),
  workTitle: escapeHtml(SITE.workTitle),
  projects: SITE.projects.map(projectMarkup).join(''),
  contactTitle: escapeHtml(SITE.contact.title),
  contactBody: escapeHtml(SITE.contact.body),
  contactAction: escapeHtml(SITE.contact.action)
};

let output = await readFile(join(root, 'index.template.html'), 'utf8');
for (const [key, value] of Object.entries(values)) {
  output = output.replaceAll(`{{${key}}}`, value);
}
const unresolved = output.match(/{{[A-Za-z0-9]+}}/g);
if (unresolved) throw new Error(`Unresolved template values: ${unresolved.join(', ')}`);
await writeFile(join(root, 'index.html'), output, 'utf8');
console.log(`Generated index.html for ${SITE.business.name}`);
