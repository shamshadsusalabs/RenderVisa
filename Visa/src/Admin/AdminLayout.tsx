import { FiHome, FiFileText, FiPieChart, FiSettings, FiLogOut } from 'react-icons/fi';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
    // ✅ Step 1: Clear entire localStorage
    localStorage.clear();

    // ✅ Step 2: Call logout API
    await fetch('https://govisaa.el.r.appspot.com/api/admin/logout', {
      method: 'POST',
      credentials: 'include', // include cookies if used
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // ✅ Step 3: Navigate to homepage
    navigate('/');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">Visa Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="text-gray-600 hover:text-gray-900">
                <FiFileText className="h-6 w-6" />
              </button>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </div>
            
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                VA
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md z-0">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard/DashboardPage" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                  <FiHome className="h-5 w-5" />
                  <span className="ml-3">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard/AllVisaApplication" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                  <FiFileText className="h-5 w-5" />
                  <span className="ml-3">All Applications</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard/visa-config-form" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                  <FiFileText className="h-5 w-5" />
                  <span className="ml-3">Visa Config Form</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard/VisaConfigList" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                  <FiFileText className="h-5 w-5" />
                  <span className="ml-3">All VisaConfigList</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard/reports" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                  <FiPieChart className="h-5 w-5" />
                  <span className="ml-3">Reports</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard/settings" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                  <FiSettings className="h-5 w-5" />
                  <span className="ml-3">Settings</span>
                </Link>
              </li>
              <li>
                 <li>
                <Link to="/dashboard/Employee" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                  <FiSettings className="h-5 w-5" />
                  <span className="ml-3">Employee</span>
                </Link>
              </li>
              <li></li>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <FiLogOut className="h-5 w-5" />
                  <span className="ml-3">Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content with Outlet */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;