"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Eye, Edit, Users, CreditCard, Calendar, Phone, Mail, FileText } from "lucide-react"

interface Document {
  url: string
  fileName: string
}

interface PassportData {
  travellerIndex: number
  passportNumber: string
  surname: string
  givenName: string
  nationality: string
  dob: string
  placeOfBirth: string
  sex: string
  dateOfIssue: string
  dateOfExpiry: string
  placeOfIssue: string
  fileNumber: string
}

interface StatusEntry {
  label: string
  date: string
}

interface VisaApplication {
  _id: string
  visaId: string
  paymentId: string
  travellers: string
  email: string
  phone: string
  documents: { [key: string]: Document }
  passportData: PassportData[]
  createdAt: string
  updatedAt: string
  __v: number
  statusHistory?: StatusEntry[]
}

interface ApiResponse {
  message: string
  data: VisaApplication[]
}

const AllVisaApplication: React.FC = () => {
  const navigate = useNavigate()
  const [applications, setApplications] = useState<VisaApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<VisaApplication[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [rowsPerPage] = useState(5)
  const [openStatusDialog, setOpenStatusDialog] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [selectedApp, setSelectedApp] = useState<VisaApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://rendervisa.onrender.com/api/VisaApplication/GetAll")
        const data: ApiResponse = await response.json()
        setApplications(data.data)
        setFilteredApplications(data.data)
        setLoading(false)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch visa applications")
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const filtered = applications.filter(
      (app) =>
        app.visaId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.includes(searchTerm) ||
        app.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app._id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredApplications(filtered)
  }, [searchTerm, applications])

  const getLastStatus = (app: VisaApplication) => {
    if (app.statusHistory && app.statusHistory.length > 0) {
      return app.statusHistory[app.statusHistory.length - 1].label
    }
    return "Pending"
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleViewDetails = (app: VisaApplication) => {
    navigate(`/dashboard/VisaFullDeatils/${app._id}`)
  }

  const openStatusModal = (app: VisaApplication) => {
    setSelectedApp(app)
    const currentStatus = getLastStatus(app)
    setNewStatus(currentStatus)
    setOpenStatusDialog(true)
  }

  const handleStatusChange = async () => {
    if (!selectedApp) return

    try {
      const response = await fetch(`https://rendervisa.onrender.com/api/VisaApplication/visa-status/${selectedApp._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newStatus }),
      })

      if (response.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app._id === selectedApp._id
              ? {
                  ...app,
                  statusHistory: [...(app.statusHistory || []), { label: newStatus, date: new Date().toISOString() }],
                }
              : app,
          ),
        )
        setOpenStatusDialog(false)
      } else {
        console.error("Failed to update status")
      }
    } catch (err) {
      console.error("Error updating status:", err)
    }
  }

  const paginatedData = filteredApplications.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visa applications...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500 p-8">
          <FileText className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <p className="text-xl font-semibold mb-2">Error Loading Data</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Visa Applications</h1>
        <p className="text-gray-600">Manage and track all visa applications</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by Visa ID, Email, Phone, Payment ID, or Application ID..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Travellers</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.reduce((sum, app) => sum + Number.parseInt(app.travellers), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter((app) => getLastStatus(app).toLowerCase() === "pending").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Processed</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter((app) => getLastStatus(app).toLowerCase() !== "pending").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Travellers
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{app.visaId.substring(0, 8)}...</div>
                      <div className="text-sm text-gray-500">ID: {app._id.substring(0, 8)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {app.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {app.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{app.travellers}</span>
                      <span className="text-sm text-gray-500 ml-1">
                        traveller{Number.parseInt(app.travellers) > 1 ? "s" : ""}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-900">{app.paymentId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(getLastStatus(app))}`}
                    >
                      {getLastStatus(app)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(app.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(app)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => openStatusModal(app)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Status
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredApplications.length)} of{" "}
          {filteredApplications.length} results
        </div>
        <div className="flex space-x-2">
          {Array.from({ length: Math.ceil(filteredApplications.length / rowsPerPage) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                page === i + 1
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Status Change Modal */}
      {openStatusDialog && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Change Application Status</h2>
              <button
                onClick={() => setOpenStatusDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  placeholder="Enter new status"
                />
              </div>
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                Current status: <strong className="text-gray-900">{getLastStatus(selectedApp)}</strong>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setOpenStatusDialog(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllVisaApplication