import Head from 'next/head'
import { useRouter } from 'next/dist/client/router'
import styles from '../styles/404.module.css'

export default function Custom40s4() {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>404: This page could not be found</title>
        <meta
          property='og:title'
          content='404: This page could not be found'
          key='title'
        />
      </Head>
      <div className={styles.container}>
        <span className={styles.bold}>404 </span>
        <span className={styles.line}>|</span>
        <span>
          This page <code> {router.asPath}</code> could not be found
        </span>
      </div>
    </>
  )
}
