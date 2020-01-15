const generateSidebar = require('./generateSidebar');
const name = 'Node-Guidebook';

const setPrefix = (base, route) => `${base}/${route}`;

module.exports = {
  base: `/${name}/`,
  head: [['link', { rel: 'icon', href: 'favicon.ico' }]],
  title: 'Node-Guidebook',
  // ga: 'UA-138047269-1',
  // serviceWorker: true,
  port: 3000,
  themeConfig: {
    repo: 'tsejx/Node-Guidebook',
    logo: '/favicon.png',
    search: true,
    searchMaxSuggestions: 15,
    serviceWorker: {
      updatePopup: {
        message: '新内容已准备就绪',
        buttonText: '刷新',
      },
    },
    sidebar: [
      {
        title: '模块',
        collapsable: false,
        children: ['commonjs', 'module', 'global'].map(r => setPrefix('module', r)),
      },
      {
        title: 'I/O',
        collapsable: false,
        children: ['io', 'stream', 'buffer', 'filesystem', 'path'].map(r => setPrefix('io', r)),
      },
      {
        title: '进程',
        collapsable: false,
        children: ['process', 'child-process', 'cluster', 'ipc', 'daemon'].map(r =>
          setPrefix('process', r)
        ),
      },
      {
        title: '网络',
        collapsable: false,
        children: [
          'socket',
          'dns',
          'net',
          'dgram',
          'http',
          'http-server',
          'http-client-request',
          'http-incoming-message',
          'http-server-response',
          'https',
          'http2',
          'url',
          'querystring',
          'crypto',
        ].map(r => setPrefix('network', r)),
      },
      {
        title: '命令行指令',
        collapsable: false,
        children: ['npm', 'npx', 'nrm', 'nvm'].map(r => setPrefix('3m', r)),
      },
      {
        title: '推荐资料',
        collapsable: false,
        children: ['recommend']
      }
    ],
    sidebarDepth: 2,
    lastUpdated: '最近更新时间',
  },

  vueThemes: {
    links: {
      github: 'https://github.com/tsejx/Node-Guidebook',
    },
  },
};
