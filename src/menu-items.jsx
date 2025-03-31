const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'overview',
          title: 'Overview',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/overview/default'
        }
      ]
    },
    {
      id: 'nations-legacy',
      title: 'Nations and Legacy',
      type: 'group',
      icon: 'feather icon-globe',
      children: [
        {
          id: 'legacy-section',
          title: 'Legacy Insights',
          type: 'collapse',
          icon: 'feather icon-award',
          children: [
            {
              id: 'country-profiles',
              title: 'Country Profiles',
              type: 'item',
              url: '/nations/countries'
            },
            {
              id: 'team-trends',
              title: 'Team Performance Trends',
              type: 'item',
              url: '/nations/trends'
            },
            {
              id: 'flag-map',
              title: 'Interactive Flag Map',
              type: 'item',
              url: '/nations/flag-map'
            },
            {
              id: 'euro-timeline',
              title: 'Championship Timeline',
              type: 'item',
              url: '/nations/timeline'
            }
          ]
        }
      ]
    },
    {
      id: 'performance',
      title: 'Performance',
      type: 'group',
      icon: 'feather icon-activity',
      children: [
        {
          id: 'euro-stats',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-bar-chart',
          url: '/performance/EuroStats',
        },
        {
          id: 'insights',
          title: 'Insights',
          type: 'item',
          icon: 'feather icon-pie-chart',
          url: '/performance/insights'
        }
      ],
    },
    {
      id: 'pages',
      title: 'Pages',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'auth',
          title: 'Authentication',
          type: 'collapse',
          icon: 'feather icon-lock',
          children: [
            {
              id: 'signup-1',
              title: 'Sign up',
              type: 'item',
              url: '/auth/signup-1',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'signin-1',
              title: 'Sign in',
              type: 'item',
              url: '/auth/signin-1',
              target: true,
              breadcrumbs: false
            }
          ]
        },
        {
          id: 'profile-page',
          title: 'Author',
          type: 'item',
          url: '/profile-page',
          classes: 'nav-item',
          icon: 'feather icon-sidebar'
        },
        {
          id: 'disabled-menu',
          title: 'Close Page',
          type: 'item',
          url: '#',
          classes: 'nav-item close-page',
          icon: 'feather icon-power',
          onClick: () => {
            // Ask for confirmation before closing
            if (window.confirm("Are you sure you want to close this page?")) {
              // Try to close the window. This will work only if the window was opened by script.
              window.close();
              // Fallback: redirect to an "empty" page.
              window.location.href = "about:blank";
            }
          }
        }            
      ]
    }
  ]
};


export default menuItems;
