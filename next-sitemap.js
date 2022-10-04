module.exports = {
  siteUrl: 'https://www.swissactivities.com',
  sitemapSize: 50000,
  generateRobotsTxt: true,
  exclude: ['/404', '/500'],

  transform: async (config, path) => {
    if (path !== '/') {
      const segments = path.split('/');
      const lastSegment = segments[segments.length - 1];
      if (!isNaN(lastSegment)) {
        console.log('skipped', path);

        return null; // skip URLs with pagination
      }
    }

    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
}
