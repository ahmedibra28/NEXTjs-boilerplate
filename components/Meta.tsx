import Head from 'next/head'
import { useRouter } from 'next/router'

interface Props {
  title?: string
  description?: string
  author?: string
  image?: string
}

const Meta = (props: Props) => {
  const { pathname } = useRouter()

  const title = 'Next-ts-boilerplate | Ahmed Ibrahim'
  const description = `Next.js typescript boilerplate`
  const image = 'https://www.ahmedibra.com/logo.png'
  const url = `https://www.ahmedibra.com${pathname}`
  const author = 'Ahmed Ibrahim'

  return (
    <Head>
      <meta charSet="utf-8" />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <link rel="canonical" href={url} />

      <title>{props?.title ? props?.title : title}</title>
      <meta
        name="title"
        content={props?.title ? props?.title : title}
        key="title"
      />
      <meta
        name="description"
        content={props?.description ? props?.description : description}
        key="description"
      />

      <meta
        name="keywords"
        content="ahmedibra, ahmedibra.com, https://ahmedibra.com, https://github.com/ahmaat19, github.com/ahmaat19, next.js, next-ts, typescript, next-typescript, boilerplate, next-ts-boilerplate, next-boilerplate, next.js-boilerplate"
      />
      <meta name="author" content={props?.author ? props?.author : author} />
      <meta name="publisher" content={props?.author ? props?.author : author} />
      <meta name="robots" content="index, follow" />
      <link rel="icon" href="/favicon.png" />
      <link
        rel="shortcut icon"
        type="image/vnd.microsoft.icon"
        href="/logo.png"
      />
      <link rel="apple-touch-icon" type="image/png" href="/logo.png" />
      <link
        rel="apple-touch-icon"
        type="image/png"
        sizes="72x72"
        href="/logo.png"
      />
      <link
        rel="apple-touch-icon"
        type="image/png"
        sizes="114x114"
        href="/logo.png"
      />
      <link rel="icon" type="image/png" href="/logo.png" />

      {/* <!-- Google / Search Engine Tags --> */}
      <meta
        itemProp="name"
        content={props?.title ? props?.title : title}
        key="g:title"
      />
      <meta
        itemProp="description"
        content={props?.description ? props?.description : description}
        key="g:description"
      />
      <meta
        itemProp="image"
        content={props?.image ? `https://ahmedibra.com${props?.image}` : image}
        key="g:image"
      />

      {/* <!-- Facebook Meta Tags --> */}
      <meta property="og:url" content={url} key="og:url" />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content={props?.title ? props?.title : title}
        key="og:title"
      />
      <meta
        property="og:description"
        content={props?.description ? props?.description : description}
        key="og:description"
      />
      <meta
        property="og:image"
        content={props?.image ? `https://ahmedibra.com${props?.image}` : image}
        key="og:image"
      />

      {/* <!-- Twitter Meta Tags --> */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content={props?.title ? props?.title : title}
        key="twitter:title"
      />
      <meta
        name="twitter:description"
        content={props?.description ? props?.description : description}
        key="twitter:description"
      />
      <meta
        name="twitter:image"
        content={props?.image ? `https://ahmedibra.com${props?.image}` : image}
        key="twitter:image"
      />
    </Head>
  )
}
export default Meta
