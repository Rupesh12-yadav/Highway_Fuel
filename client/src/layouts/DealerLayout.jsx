import { Outlet } from 'react-router-dom';
import DealerSidebar from '../components/dealer/DealerSidebar';

const DealerLayout = () => (
  <div className="flex min-h-screen bg-gray-50">
    <DealerSidebar />
    <main className="flex-1 p-6 overflow-y-auto">
      <Outlet />
    </main>
  </div>
);

export default DealerLayout;
