import { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2, FiCalendar,  FiDollarSign, FiUser, FiAirplay } from 'react-icons/fi';

type FlightBooking = {
  id: string;
  flightNumber: string;
  airline: string;
  departure: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookingStatus: 'booked' | 'cancelled' | 'rescheduled';
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'failed';
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'wallet';
  price: number;
  bookingDate: string;
  seats: string;
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
};

const UserFlightHistory = () => {
  // Sample flight booking data for a single user
  const userFlights: FlightBooking[] = [
    {
      id: 'FB001',
      flightNumber: 'AI-202',
      airline: 'Air India',
      departure: 'Delhi (DEL)',
      destination: 'Mumbai (BOM)',
      departureDate: '2023-06-15',
      returnDate: '2023-06-20',
      status: 'confirmed',
      bookingStatus: 'booked',
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      price: 7500,
      bookingDate: '2023-06-10',
      seats: '12A, 12B',
      cabinClass: 'economy'
    },
    {
      id: 'FB002',
      flightNumber: 'SG-456',
      airline: 'SpiceJet',
      departure: 'Bangalore (BLR)',
      destination: 'Dubai (DXB)',
      departureDate: '2023-07-10',
      returnDate: '2023-07-25',
      status: 'confirmed',
      bookingStatus: 'booked',
      paymentStatus: 'paid',
      paymentMethod: 'upi',
      price: 22500,
      bookingDate: '2023-07-05',
      seats: '8C',
      cabinClass: 'premium_economy'
    },
    {
      id: 'FB003',
      flightNumber: 'UK-789',
      airline: 'Vistara',
      departure: 'Mumbai (BOM)',
      destination: 'London (LHR)',
      departureDate: '2023-08-05',
      returnDate: '2023-09-05',
      status: 'pending',
      bookingStatus: 'booked',
      paymentStatus: 'pending',
      paymentMethod: 'net_banking',
      price: 48500,
      bookingDate: '2023-08-01',
      seats: '3A, 3B',
      cabinClass: 'business'
    },
    {
      id: 'FB004',
      flightNumber: 'EM-321',
      airline: 'IndiGo',
      departure: 'Chennai (MAA)',
      destination: 'Singapore (SIN)',
      departureDate: '2023-06-22',
      returnDate: '2023-06-30',
      status: 'confirmed',
      bookingStatus: 'booked',
      paymentStatus: 'paid',
      paymentMethod: 'debit_card',
      price: 18700,
      bookingDate: '2023-06-18',
      seats: '14F',
      cabinClass: 'economy'
    },
  ];

  // State management
  const [bookings] = useState<FlightBooking[]>(userFlights);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof FlightBooking; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let result = [...bookings];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(booking =>
        booking.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(booking => booking.status === statusFilter);
    }
    
    // Apply sorting
    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [bookings, searchTerm, statusFilter, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredBookings, itemsPerPage]);

  // Sort request
  const requestSort = (key: keyof FlightBooking) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Status badge component
  const StatusBadge = ({ status }: { status: FlightBooking['status'] }) => {
    const statusClasses = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Payment status badge component
  const PaymentStatusBadge = ({ status }: { status: FlightBooking['paymentStatus'] }) => {
    const statusClasses = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      refunded: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    const statusText = {
      paid: 'Paid',
      pending: 'Pending',
      refunded: 'Refunded',
      failed: 'Failed'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  // Cabin class badge
  const CabinClassBadge = ({ cabinClass }: { cabinClass: FlightBooking['cabinClass'] }) => {
    const classColors = {
      economy: 'bg-gray-100 text-gray-800',
      premium_economy: 'bg-blue-100 text-blue-800',
      business: 'bg-purple-100 text-purple-800',
      first: 'bg-amber-100 text-amber-800'
    };
    
    const classText = {
      economy: 'Economy',
      premium_economy: 'Premium Economy',
      business: 'Business',
      first: 'First Class'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${classColors[cabinClass]}`}>
        {classText[cabinClass]}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Stats summary
  const totalFlights = bookings.length;
  const totalSpent = bookings.reduce((sum, booking) => sum + booking.price, 0);
  const upcomingFlights = bookings.filter(b => 
    new Date(b.departureDate) > new Date() && b.status !== 'cancelled'
  ).length;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* User Flight Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FiAirplay className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Flights</h3>
              <p className="text-3xl font-bold text-blue-600">{totalFlights}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiDollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Spent</h3>
              <p className="text-3xl font-bold text-green-600">₹{totalSpent.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FiCalendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Upcoming Trips</h3>
              <p className="text-3xl font-bold text-purple-600">{upcomingFlights}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiUser className="mr-2" /> My Flight History
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search flights..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none w-full"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Flight Bookings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('flightNumber')}
              >
                <div className="flex items-center">
                  Flight
                  {sortConfig?.key === 'flightNumber' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Route
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('departureDate')}
              >
                <div className="flex items-center">
                  <FiCalendar className="mr-1" />
                  Dates
                  {sortConfig?.key === 'departureDate' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Booking Details
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('price')}
              >
                Price
                {sortConfig?.key === 'price' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-900">{booking.airline}</div>
                      <div className="text-sm text-gray-500">{booking.flightNumber}</div>
                      <CabinClassBadge cabinClass={booking.cabinClass} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm">
                        <span className="text-gray-900 font-medium">{booking.departure}</span>
                        <span className="mx-2">→</span>
                        <span className="text-gray-900 font-medium">{booking.destination}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Seats: {booking.seats}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm">
                        <span className="font-medium">Depart:</span> {formatDate(booking.departureDate)}
                      </div>
                      {booking.returnDate && (
                        <div className="text-sm">
                          <span className="font-medium">Return:</span> {formatDate(booking.returnDate)}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        Booked on: {formatDate(booking.bookingDate)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <StatusBadge status={booking.status} />
                      <PaymentStatusBadge status={booking.paymentStatus} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-gray-900">
                      ₹{booking.price.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <FiEdit />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        title="Cancel Booking"
                        disabled={booking.status === 'cancelled'}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No flight bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredBookings.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredBookings.length)}
                </span>{' '}
                of <span className="font-medium">{filteredBookings.length}</span> flights
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === number
                        ? 'z-10 bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFlightHistory;