import { createRoot } from 'react-dom/client'

// import { Scene as App } from './planet'
// import { Scene as App } from './planet+blob'
import { App } from './audio-cubes'

// import { App } from './blob/index.js'
// import { App } from './main'

import './styles.css'

createRoot(document.getElementById('root')).render(<App />)
