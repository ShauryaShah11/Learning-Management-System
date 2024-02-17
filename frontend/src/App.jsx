// App.jsx
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;