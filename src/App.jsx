import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage'
import CounterSalesPage from './pages/CounterSalesPage'
import QuotationPage from './pages/QuotationPage'
import ReturnsPage from './pages/ReturnsPage'
import ApprovalQueuePage from './pages/ApprovalQueuePage'
import FinanceQueuePage from './pages/FinanceQueuePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/counter" element={<CounterSalesPage />} />
        <Route path="/quotation" element={<QuotationPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/approvals" element={<ApprovalQueuePage />} />
        <Route path="/finance" element={<FinanceQueuePage />} />
        {/* Catch-all → login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
