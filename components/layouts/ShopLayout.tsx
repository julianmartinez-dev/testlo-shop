import Head from "next/head"
import { FC } from "react"
import { NavBar } from "../ui"

interface Props{
    title: string,
    pageDescription: string,
    imageFullUrl?: string,
    children: React.ReactNode
}

export const ShopLayout:FC<Props> = ({children, title, pageDescription, imageFullUrl}) => {
  return (
   <>
    <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />
        <meta name="og:description" content={pageDescription} />
        {imageFullUrl && <meta property="og:image" content={imageFullUrl} />} 
    </Head>
    <nav>
        <NavBar />
    </nav>
    {/* SIDEBAR */}
    <main style={{
        margin: '80px auto',
        maxWidth: '1440px',
        padding: '0px 30px'
    }}>
        {children}
    </main>
    <footer>
        {/* footer */}
    </footer>
   </>
  )
}
