// AppRoutes.tsx
// index.tsx
import './utils/fetchWithAuth';

import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
// Lazy loaded Visa components
const Navbar = lazy(() => import('./Visa/Navbar'));
const DetailsNavbar = lazy(() => import('./Visa/DetailsNavbar'));
const VisaService = lazy(() => import('./Visa/Header'));
const VisaDestinations = lazy(() => import('./Visa/VisaDestinations'));
const Banner = lazy(() => import('./Visa/Banner'));
const VisaBookingCard = lazy(() => import('./Visa/VisaBookingCard'));
const VisasOnTime = lazy(() => import('./Visa/VisasOnTime'));
const AtlysNews = lazy(() => import('./Visa/AtlysNews'));
const Footer = lazy(() => import('./Visa/Footer'));
const VisaRequirements = lazy(() => import('./Visa/VisaRequirements'));
const VisaProcess = lazy(() => import('./Visa/VisaProcess'));
const VisaRejectionReasons = lazy(() => import('./Visa/VisaRejectionReasons'));
const VisaWizard = lazy(() => import('./VisaConfiq/VisaWizard'));

// Lazy loaded Admin/User components
const AdminLayout = lazy(() => import('./Admin/AdminLayout'));
const DashboardPage = lazy(() => import('./Admin/DashboardPage'));
const Login = lazy(() => import('./Admin/Login'));
const AllVisaApplication = lazy(() => import('./Admin/AllVisaApplication'));
const VisaFullDetails = lazy(() => import('./Admin/VisaFullDeatils'));
const VisaConfigList = lazy(() => import('./Admin/VisaConfigList')); // fixed typo

const Auth = lazy(() => import('./User/auth'));
const UserLayout = lazy(() => import('./User/UserLayout'));
const GovissaWelcome = lazy(() => import('./User/GovissaWelcome'));
const ApplyVisa = lazy(() => import('./User/ApplyVisa'));
const Approved = lazy(() => import('./User/Approved'));
const Rejected = lazy(() => import('./User/Rejected'));
const Visatarcker = lazy(() => import('./User/Visatarcker'));
const Bill = lazy(() => import('./User/Bill'));
const BillList = lazy(() => import('./User/BillList'));
const UploadDocuments = lazy(() => import('./User/UplodDocumnets/upload-documents'));

function AppRoutes() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <Routes>
        {/* Public Home Page */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <VisaService />
              <VisaDestinations />
              <VisasOnTime />
              <AtlysNews />
              <Footer />
            </>
          }
        />

        {/* Public Visa Details Page */}
        <Route
          path="/visa-details/:id"
          element={
            <>
              <DetailsNavbar />
              <Banner />
              <VisaBookingCard />
              <VisaRequirements />
              <VisaProcess />
              <VisaRejectionReasons />
              <Footer />
            </>
          }
        />

        {/* Auth Page */}
        <Route
          path="/auth"
          element={
            <Auth
              onAuthSuccess={(token: string) => {
                console.log("Access token received:", token);
              }}
            />
          }
        />

        {/* Protected User Dashboard */}
        <Route
          path="/user-dashboard/*"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
           <Route index element={<GovissaWelcome />} />
          <Route path="GovissaWelcome" element={<GovissaWelcome />} />
          <Route path="ApplyVisa" element={<ApplyVisa />} />
          <Route path="Approved" element={<Approved />} />
          <Route path="Rejected" element={<Rejected />} />
          <Route path="Visatarcker/:paymentId" element={<Visatarcker />} />
          <Route path="BillList" element={<BillList />} />
          <Route path="bill" element={<Bill />} />
          <Route path="upload-documents/:visaId/:travellers/:paymentId/:country" element={<UploadDocuments />} />
        </Route>

        {/* Public Admin Login */}
        <Route path="/admin" element={<Login />} />

        {/* Protected Admin Dashboard */}
        <Route
          path="/dashboard/*"
          element={
          <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        ><Route index element={<DashboardPage />} />
     
        <Route path="VisaConfigList" element={<    VisaConfigList />} />
          <Route path="visa-config-form" element={<VisaWizard />} />
          <Route path="DashboardPage" element={<DashboardPage />} />
          <Route path="AllVisaApplication" element={<AllVisaApplication />} />
          <Route path="VisaFullDeatils/:id" element={<VisaFullDetails />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<div className="text-center py-10">404 - Page Not Found</div>} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
