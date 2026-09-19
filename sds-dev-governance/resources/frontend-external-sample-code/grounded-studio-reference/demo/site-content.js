export const SITE = {
  visual: {
    themeColor: '#14110f'
  },
  ui: {
    homeLabel: 'Home',
    navigationLabel: 'Main navigation',
    navigationToggleLabel: 'Toggle navigation',
    continueLabel: 'Continue to approach',
    noScriptMessage:
      'Interactive navigation is unavailable, but all content and the complete hero remain readable.'
  },
  business: {
    name: 'Northline Works',
    shortName: 'Northline',
    location: '57.7°N · 11.9°E',
    email: 'hello@example.test'
  },
  nav: [
    ['Approach', '#approach'],
    ['Work', '#work'],
    ['Contact', '#contact']
  ],
  hero: {
    title: 'Northline Works',
    summary:
      'We design and operate useful digital systems from the edge of the northern coast.',
    primary: ['Start a conversation', '#contact'],
    secondary: ['See the work', '#work']
  },
  approach: {
    lede: 'A small product practice that stays close to the systems it puts into the world.',
    columns: [
      {
        title: 'We carry the consequence',
        body:
          'Our work continues after launch. Maintenance, support and daily use shape the next decision.'
      },
      {
        title: 'We make the structure visible',
        body:
          'Clear interfaces, explicit constraints and evidence replace presentation theatre.'
      }
    ]
  },
  workTitle: 'Selected systems',
  projects: [
    {
      name: 'Tidal Ledger',
      summary:
        'A planning surface that turns uncertain arrivals into a shared operational view.',
      facts: [['Web', 'Platform'], ['Operations', 'Field'], ['Live', 'Status']],
      action: ['Read the outline', '#contact'],
      variant: 'flow'
    },
    {
      name: 'Common Signal',
      summary:
        'A compact publishing tool for teams that need one dependable source instead of another feed.',
      facts: [['Web', 'Platform'], ['Knowledge', 'Field'], ['Pilot', 'Status']],
      action: ['Discuss the system', '#contact'],
      variant: 'signal',
      visualValues: ['36%', '64%', '82%', '48%', '70%']
    }
  ],
  contact: {
    title: 'Bring the hard part.',
    body: 'A short note about the constraint is enough to begin.',
    action: 'Write to us'
  }
};
