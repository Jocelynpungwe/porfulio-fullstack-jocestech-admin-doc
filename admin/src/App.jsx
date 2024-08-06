import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorPage, LandingPage, LoginPage, ProtectedRoute } from './pages'
import {
  CustomersPage,
  MainDashboard,
  OrderPage,
  ProductsPage,
  ReviewsPage,
  SettingsPage,
  SharedLayout,
  AddProductPage,
  SingleProductPage,
  ViewOrderPage,
  SingleCustomerPage,
} from './pages/dashboard'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SharedLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MainDashboard />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<SingleProductPage />} />
            <Route path="new-product" element={<AddProductPage />} />
            <Route path="orders" element={<OrderPage />} />
            <Route path="orders/:id" element={<ViewOrderPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/:id" element={<SingleCustomerPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="/admin/landing" element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <ToastContainer position="top-center" />
      </BrowserRouter>
    </>
  )
}

export default App
