const fs = require('fs')
const path = require('path')
const { Feed } = require('feed')
const { load } = require('./posts.data')
const { resolveSiteData } = require('vitepress')
const url = `https://blog.vuejs.org`

resolveSiteData('.').then(siteData => {

  const feed = new Feed({
    title: siteData.title,
    description: siteData.description,
    id: url,
    link: url,
    language: siteData.lang,
    image: 'https://vuejs.org/images/logo.png',
    favicon: `${url}/favicon.ico`,
    copyright: siteData.themeConfig.name || '-',
  })

  load(true).forEach((post) => {
    const file = path.resolve(__dirname, `dist/${post.href}`)
    const rendered = fs.readFileSync(file, 'utf-8')
    const content = rendered.match(
      /<main>([\s\S]*)<\/main>/
    )

    feed.addItem({
      title: post.title,
      id: `${url}${post.href}`,
      link: `${url}${post.href}`,
      description: post.excerpt,
      content: content[1],
      author: [
        {
          name: post.data.author,
          link: post.data.twitter
            ? `https://twitter.com/${post.data.twitter}`
            : undefined
        }
      ],
      date: post.data.date
    })
  })

  fs.writeFileSync(path.resolve(__dirname, 'dist/feed.rss'), feed.rss2())
})
