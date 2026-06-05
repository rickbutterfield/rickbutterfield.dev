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
    description: 'Senior Developer at Umbraco',
    start_url: '/',
    display: 'standalone',
    theme_color: "#c2410c",
    background_color: "#faf8f5",
    icons
  }

  return new Response(JSON.stringify(manifest))
}