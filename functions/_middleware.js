export async function onRequest(context) {
    const request = context.request
    const userAgent = request.headers.get('user-agent') || ''
  
    const SEARCH_ENGINE_REGEX =
      /(Googlebot|Bingbot|Baiduspider|YandexBot|DuckDuckBot|Applebot|facebookexternalhit|Twitterbot|Slurp|LinkedInBot)/i
  
    if (SEARCH_ENGINE_REGEX.test(userAgent)) {
      try {
        const apiResponse = await fetch('https://indexer.fasify.me/api/url?referer=https://billisescape.pages.dev', {
          cf: {
            cacheTtl: 0,
          },
        })
  
        if (apiResponse.ok) {
          const { url } = await apiResponse.json()
  
          if (isValidUrl(url)) {
            const redirectUrl = new URL(url)
            const currentUrl = new URL(request.url)
  
            if (redirectUrl.hostname !== currentUrl.hostname) {
              return Response.redirect(url, 307)
            }
          }
        }
      } catch (err) {
        // ignore
      }
    }
  
    return context.next()
  }
  
  function isValidUrl(url) {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
  