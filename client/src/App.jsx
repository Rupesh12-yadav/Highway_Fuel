import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
