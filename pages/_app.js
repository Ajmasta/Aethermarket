import '../styles/globals.css'
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
  <>

  
  
  <RecoilRoot>
  <Component {...pageProps} />
  </RecoilRoot>
  </>)
}

export default MyApp
