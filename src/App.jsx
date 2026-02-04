import { Routes, Route } from 'react-router-dom';
import Homepage from './assets/pages/Homepage/Homepage';
import Secondpage from './assets/pages/Secondpage/Secondpage';
import Store from './assets/pages/Store/Store';
 
function App() {
  return (
  
  <div>
    <Routes>
      {/* When path is empty {root}, show Home */}
      <Route path= "/" element={<Homepage />} />
      <Route path= "/select" element={<Secondpage />} />
      <Route path= "/robot/:robotName" element={<Secondpage />} />
      <Route path= "/store" element={<Store />} />



    </Routes>
  </div>
  )
}

export default App;