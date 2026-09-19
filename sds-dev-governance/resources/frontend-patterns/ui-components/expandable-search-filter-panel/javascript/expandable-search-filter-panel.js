function moveFocusBeforeHiding(controller, subtree) {
  if (subtree.contains(subtree.ownerDocument.activeElement)) controller.focus();
}

function setPanelExpanded(panel, expanded, copy) {
  const toggle = panel.querySelector('[data-panel-toggle]');
  const body = panel.querySelector('[data-panel-body]');
  if (!toggle || !body) return;

  if (!expanded) moveFocusBeforeHiding(toggle, body);
  panel.classList.toggle('is-collapsed', !expanded);
  toggle.setAttribute('aria-expanded', String(expanded));
  toggle.setAttribute('aria-label', expanded ? copy.collapsePanel : copy.expandPanel);
  body.setAttribute('aria-hidden', String(!expanded));
  body.toggleAttribute('inert', !expanded);
}

function setFiltersExpanded(form, expanded, copy) {
  const toggle = form.querySelector('[data-filter-toggle]');
  const options = form.querySelector('[data-filter-options]');
  if (!toggle || !options) return;

  if (!expanded) moveFocusBeforeHiding(toggle, options);
  form.classList.toggle('is-expanded', expanded);
  toggle.classList.toggle('is-active', expanded);
  toggle.setAttribute('aria-expanded', String(expanded));
  toggle.setAttribute('aria-label', expanded ? copy.hideFilters : copy.showFilters);
  options.setAttribute('aria-hidden', String(!expanded));
  options.toggleAttribute('inert', !expanded);
}

function readFilterState(form) {
  const values = new FormData(form);
  return {
    query: String(values.get('query') || '').trim(),
    status: String(values.get('status') || ''),
    pageSize: Number(values.get('pageSize') || 10)
  };
}

function emitFilterChange(form, source) {
  // Consumers should use this same state for final results AND autocomplete suggestions.
  form.dispatchEvent(new CustomEvent('expandable-filter:change', {
    bubbles: true,
    detail: { source, filters: readFilterState(form) }
  }));
}

export function initExpandableSearchFilterPanel(panel, {
  copy = {
    collapsePanel: 'Collapse records panel',
    expandPanel: 'Expand records panel',
    showFilters: 'Show filters',
    hideFilters: 'Hide filters'
  }
} = {}) {
  const panelToggle = panel.querySelector('[data-panel-toggle]');
  const form = panel.querySelector('[data-expandable-filters]');
  const filterToggle = form?.querySelector('[data-filter-toggle]');
  if (!panelToggle || !form || !filterToggle) return null;

  setPanelExpanded(panel, true, copy);
  setFiltersExpanded(form, false, copy);

  panelToggle.addEventListener('click', () => {
    setPanelExpanded(panel, panelToggle.getAttribute('aria-expanded') !== 'true', copy);
  });

  filterToggle.addEventListener('click', () => {
    setFiltersExpanded(form, filterToggle.getAttribute('aria-expanded') !== 'true', copy);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    emitFilterChange(form, 'search');
  });

  for (const control of form.querySelectorAll('select')) {
    control.addEventListener('change', () => emitFilterChange(form, control.name));
  }

  return {
    read: () => readFilterState(form),
    setPanelExpanded: (expanded) => setPanelExpanded(panel, expanded, copy),
    setFiltersExpanded: (expanded) => setFiltersExpanded(form, expanded, copy)
  };
}

document.querySelectorAll('[data-filter-panel]').forEach((panel) => {
  initExpandableSearchFilterPanel(panel);
});

