export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Statistiques',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'dashboard',
        title: 'Tableau de bord',
        type: 'item',
        url: '/analytics',
        icon: 'feather icon-home'
      }
    ]
  },
{
  id: 'gestion',
  title: 'Gestion',
  type: 'group',
  icon: 'icon-settings',
  children: [
    {
      id: 'produits',
      title: 'Gestion Produits',
      type: 'item',
      url: '/gestion/produits',
      classes: 'nav-item',
      icon: 'feather icon-box' // Icône plus représentative pour les produits
    },
    {
      id: 'clients',
      title: 'Gestion Clients',
      type: 'item',
      url: '/gestion/clients',
      classes: 'nav-item',
      icon: 'feather icon-users' // Gardé car parfait pour les clients
    },
    {
      id: 'devises',
      title: 'Gestion Devises',
      type: 'item',
      url: '/gestion/devises',
      classes: 'nav-item',
      icon: 'feather icon-credit-card' // Plus moderne pour les transactions financières
    },
    {
      id: 'factures',
      title: 'Gestion Factures',
      type: 'item',
      url: '/gestion/factures',
      classes: 'nav-item',
      icon: 'feather icon-file-text' // Représente bien un document/facture
    },
    {
      id: 'reglements',
      title: 'Gestion Règlements',
      type: 'item',
      url: '/gestion/reglements',
      classes: 'nav-item',
      icon: 'feather icon-check-circle' // Symbolise la validation/achèvement
    }
  ]
},
/*
{
  id: 'Authentication',
  title: 'Authentification',
  type: 'group',
  icon: 'icon-lock',
  children: [
    {
      id: 'signup',
      title: 'Inscription',
      type: 'item',
      url: '/auth/signup',
      icon: 'feather icon-user-plus', // Plus explicite pour l'inscription
      target: true,
      breadcrumbs: false
    },
    {
      id: 'signin',
      title: 'Connexion',
      type: 'item',
      url: '/auth/signin',
      icon: 'feather icon-log-in', // Gardé car parfait pour la connexion
      target: true,
      breadcrumbs: false
    }
  ]
}
,
 {
    id: 'ui-component',
    title: 'Ui Component',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'basic',
        title: 'Component',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'button',
            title: 'Button',
            type: 'item',
            url: '/component/button'
          },
          {
            id: 'badges',
            title: 'Badges',
            type: 'item',
            url: '/component/badges'
          },
          {
            id: 'breadcrumb-pagination',
            title: 'Breadcrumb & Pagination',
            type: 'item',
            url: '/component/breadcrumb-paging'
          },
          {
            id: 'collapse',
            title: 'Collapse',
            type: 'item',
            url: '/component/collapse'
          },
          {
            id: 'tabs-pills',
            title: 'Tabs & Pills',
            type: 'item',
            url: '/component/tabs-pills'
          },
          {
            id: 'typography',
            title: 'Typography',
            type: 'item',
            url: '/component/typography'
          }
        ]
      }
    ]
  },
  {
    id: 'chart',
    title: 'Chart',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'apexchart',
        title: 'ApexChart',
        type: 'item',
        url: '/chart',
        classes: 'nav-item',
        icon: 'feather icon-pie-chart'
      }
    ]
  },
  {
    id: 'forms & tables',
    title: 'Forms & Tables',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'forms',
        title: 'Basic Forms',
        type: 'item',
        url: '/forms',
        classes: 'nav-item',
        icon: 'feather icon-file-text'
      },
      {
        id: 'tables',
        title: 'tables',
        type: 'item',
        url: '/tables',
        classes: 'nav-item',
        icon: 'feather icon-server'
      }
    ]
  },
  

/*
  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'sample-page',
        title: 'Sample Page',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'feather icon-sidebar'
      },
      {
        id: 'menu-level',
        title: 'Menu Levels',
        type: 'collapse',
        icon: 'feather icon-menu',
        children: [
          {
            id: 'menu-level-2.1',
            title: 'Menu Level 2.1',
            type: 'item',
            url: 'javascript:',
            external: true
          },
          {
            id: 'menu-level-2.2',
            title: 'Menu Level 2.2',
            type: 'collapse',
            children: [
              {
                id: 'menu-level-2.2.1',
                title: 'Menu Level 2.2.1',
                type: 'item',
                url: 'javascript:',
                external: true
              },
              {
                id: 'menu-level-2.2.2',
                title: 'Menu Level 2.2.2',
                type: 'item',
                url: 'javascript:',
                external: true
              }
            ]
          }
        ]
      }
    ]
  }*/
];
