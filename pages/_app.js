import '../src/styles/globals.scss'

import { Provider } from 'react-redux'
import store from '../src/store/store'

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
  //<Component {...pageProps} />
}

export default MyApp
