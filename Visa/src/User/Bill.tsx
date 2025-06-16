import { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CSSProperties } from 'react';
import GovisaaLogo from '../assets/logo.jpeg';

interface Payment {
  _id: string;
  orderId: string;
  amount: number;
  currency: string;
  country: string;
  status: string;
  email: string;
  phone: string;
  selectedDate: string;
  travellers: number;
  createdAt: number;
  paidAt?: string;
  paymentId?: string;
}

const Bill = () => {
  const billRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<Payment | null>(null);

  useEffect(() => {
    if (!location.state?.payment) {
      navigate('/'); // Redirect if no payment data
      return;
    }
    setPayment(location.state.payment);
  }, [location, navigate]);

  const handleDownloadPDF = () => {
    const input = billRef.current;
    if (input) {
      html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Kehar_Travel_Invoice_${payment?.orderId}.pdf`);
      });
    }
  };

  const formatDate = (dateString: string | number) => {
    if (typeof dateString === 'number') {
      return new Date(dateString * 1000).toLocaleDateString('en-IN');
    }
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const calculateTaxes = (amount: number) => {
    const subtotal = amount / 100;
    const cgst = subtotal * 0.09; // 9% CGST
    const sgst = subtotal * 0.09; // 9% SGST
    const total = subtotal + cgst + sgst;
    return { subtotal, cgst, sgst, total };
  };

  if (!payment) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <p>Loading payment details...</p>
      </div>
    );
  }

  const { subtotal, cgst, sgst, total } = calculateTaxes(payment.amount);

  const styles: { [key: string]: CSSProperties } = {
    container: {
      padding: '16px',
      fontFamily: 'Arial, sans-serif',
    },
    billContainer: {
      width: '210mm',
      minHeight: '297mm',
      backgroundColor: '#ffffff',
      margin: '0 auto',
      padding: '32px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderBottom: '2px solid #d1d5db',
      paddingBottom: '16px',
    },
    logoContainer: {
      width: '33%',
    },
    logo: {
      width: '192px',
      height: 'auto',
    },
    headerRight: {
      width: '66%',
      textAlign: 'right',
    },
    invoiceTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1e3a8a',
      marginBottom: '8px',
    },
    companyInfo: {
      fontSize: '14px',
    },
    sectionTitle: {
      fontWeight: 'bold',
      marginBottom: '8px',
    },
    detailsContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '32px',
      margin: '24px 0',
    },
    detailBox: {
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '4px',
      padding: '12px',
    },
    invoiceInfo: {
      display: 'flex',
      justifyContent: 'flex-end',
      margin: '16px 0',
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
      width: '256px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      margin: '24px 0',
    },
    tableHeader: {
      backgroundColor: '#1f2937',
      color: '#ffffff',
    },
    tableCell: {
      padding: '8px',
      textAlign: 'left',
      border: '1px solid #d1d5db',
    },
    totalsContainer: {
      marginLeft: 'auto',
      width: '288px',
      margin: '24px 0',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '4px 0',
      borderBottom: '1px solid #d1d5db',
    },
    totalAmount: {
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: 'bold',
      fontSize: '18px',
      paddingTop: '8px',
    },
    footer: {
      marginTop: '40px',
      borderTop: '2px solid #d1d5db',
      paddingTop: '16px',
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '32px',
    },
    footerText: {
      textAlign: 'center',
      fontSize: '14px',
      color: '#4b5563',
      marginTop: '32px',
    },
    button: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      fontWeight: 'bold',
      padding: '8px 24px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      margin: '16px auto',
      display: 'block',
    },
  };

  return (
    <div style={styles.container}>
      <div ref={billRef} style={styles.billContainer}>
        {/* Header with logo */}
        <header style={styles.header}>
          <div style={styles.logoContainer}>
            <img src={GovisaaLogo} alt="Govisaa Logo" style={styles.logo} />
          </div>
          <div style={styles.headerRight}>
            <h1 style={styles.invoiceTitle}>TAX INVOICE</h1>
            <div style={styles.companyInfo}>
              <p style={{ fontWeight: 'bold' }}>
                KEHAR TRAVEL SERVICES PRIVATE LIMITED
              </p>
              <p>GSTIN: 06AACCK3779PZZU</p>
              <p style={{ marginTop: '4px', fontSize: '12px' }}>
                Registration Valid From: 15/02/2022
              </p>
            </div>
          </div>
        </header>

        {/* Customer & Visa Details */}
        <div style={styles.detailsContainer}>
          <div>
            <h2 style={styles.sectionTitle}>Customer Details:</h2>
            <div style={styles.detailBox}>
              <p style={{ fontWeight: '500' }}>{payment.email.split('@')[0]}</p>
              <p>Email: {payment.email}</p>
              <p>Contact: {payment.phone}</p>
              <p>Booking Date: {formatDate(payment.createdAt)}</p>
            </div>
          </div>
          <div>
            <h2 style={styles.sectionTitle}>Booking Details:</h2>
            <div style={styles.detailBox}>
              <p style={{ fontWeight: '500' }}>Order ID: {payment.orderId}</p>
              <p>Payment ID: {payment.paymentId || 'N/A'}</p>
              <p>Country: {payment.country}</p>
              <p>Travel Date: {formatDate(payment.selectedDate)}</p>
              <p>Travellers: {payment.travellers}</p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div style={styles.invoiceInfo}>
          <div style={styles.infoGrid}>
            <div style={{ fontWeight: 'bold' }}>Invoice Number:</div>
            <div style={{ textAlign: 'right' }}>{payment.orderId}</div>
            <div style={{ fontWeight: 'bold' }}>Date:</div>
            <div style={{ textAlign: 'right' }}>{formatDate(payment.createdAt)}</div>
            <div style={{ fontWeight: 'bold' }}>GST Category:</div>
            <div style={{ textAlign: 'right' }}>Regular</div>
          </div>
        </div>

        {/* Items Table */}
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableCell}>S.No</th>
              <th style={styles.tableCell}>Service</th>
              <th style={styles.tableCell}>Description</th>
              <th style={styles.tableCell}>Country</th>
              <th style={styles.tableCell}>HSN/SAC</th>
              <th style={styles.tableCell}>Qty</th>
              <th style={styles.tableCell}>Rate (₹)</th>
              <th style={styles.tableCell}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.tableCell}>1</td>
              <td style={styles.tableCell}>Visa Processing</td>
              <td style={styles.tableCell}>
                Travel visa service for {payment.travellers} person(s)
              </td>
              <td style={styles.tableCell}>{payment.country}</td>
              <td style={styles.tableCell}>9983</td>
              <td style={styles.tableCell}>{payment.travellers}</td>
              <td style={styles.tableCell}>
                {(subtotal / payment.travellers).toFixed(2)}
              </td>
              <td style={styles.tableCell}>{subtotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div style={styles.totalsContainer}>
          <div style={styles.totalRow}>
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div style={styles.totalRow}>
            <span>CGST (9%):</span>
            <span>₹{cgst.toFixed(2)}</span>
          </div>
          <div style={styles.totalRow}>
            <span>SGST (9%):</span>
            <span>₹{sgst.toFixed(2)}</span>
          </div>
          <div style={styles.totalAmount}>
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerGrid}>
            <div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                Bank Details:
              </h3>
              <p>Account Name: KEHAR TRAVEL SERVICES PVT LTD</p>
              <p>Account Number: XXXX XXXX XXXX 1523</p>
              <p>Bank Name: Example Bank</p>
              <p>IFSC Code: EXMP0000123</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '48px' }}>Authorized Signatory</p>
              <p>For KEHAR TRAVEL SERVICES PVT LTD</p>
            </div>
          </div>
          <div style={styles.footerText}>
            <p>GSTIN: 06AACCK3779PZZU | Registration Valid From: 15/02/2022</p>
            <p style={{ marginTop: '8px' }}>
              Thank you for choosing Govisaa - Your Gateway to the World!
            </p>
          </div>
        </footer>
      </div>

      <button onClick={handleDownloadPDF} style={styles.button}>
        Download as PDF
      </button>
    </div>
  );
};

export default Bill;