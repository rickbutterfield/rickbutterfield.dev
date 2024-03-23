import type { APIRoute } from 'astro'
import { getImage } from 'astro:assets'
import favicon from '../../public/favicon.svg';

const faviconPngSizes = [192, 512];

export const GET: APIRoute = async () => {
  const icons = await Promise.all(
    faviconPngSizes.map(async (size) => {
      const image = await getImage({
        src: favicon,
        width: size,
        height: size,
        format: 'png'
      })
      return {
        src: image.src,
        type: `image/${image.options.format}`,
        sizes: `${image.options.width}x${image.options.height}`
      }
    })
  )

  const manifest = {
    name: 'Rick Butterfield',
    description: 'Lead Software Engineer &amp; Umbraco MVP',
    start_url: '/',
    display: 'standalone',
    theme_color: "rgb(79, 70, 229)",
    background_color: "rgb(79, 70, 229)",
    icons
  }

  return new Response(JSON.stringify(manifest))
}