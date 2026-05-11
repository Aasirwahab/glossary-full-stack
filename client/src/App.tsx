import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductPage from "./pages/ProductPage";
import SearchResults from "./pages/SearchResults";
import FlashDeals from "./pages/FlashDeals";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import OrderTracking from "./pages/OrderTracking";
import Addresses from "./pages/Addresses";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import About from "./pages/About";
import Policy from "./pages/Policy";
import Faqs from "./pages/Faqs";
import Support from "./pages/Support";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminDeliveryPartners from "./pages/admin/AdminDeliveryPartners";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDeliveryZones from "./pages/admin/AdminDeliveryZones";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import DeliveryLogin from "./pages/delivery/DeliveryLogin";
import DeliveryLayout from "./pages/delivery/DeliveryLayout";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

const App = () => {
    return (
        <>
            <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: "#1B3022", color: "#fff", borderRadius: "12px", fontSize: "14px" } }} />

            <Routes>
                {/* Auth pages - No Navbar/Footer */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                {/* Main pages - With Navbar/Footer */}
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path="products" element={<Products />} />
                    <Route path="products/:id" element={<ProductPage />} />
                    <Route path="search" element={<SearchResults />} />
                    <Route path="deals" element={<FlashDeals />} />
                    <Route path="about" element={<About />} />
                    <Route path="policy" element={<Policy />} />
                    <Route path="faqs" element={<Faqs />} />
                    <Route path="support" element={<Support />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="checkout" element={<Checkout />} />
                        <Route path="orders" element={<MyOrders />} />
                        <Route path="orders/:id" element={<OrderTracking />} />
                        <Route path="addresses" element={<Addresses />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="wishlist" element={<Wishlist />} />
                    </Route>
                </Route>
                {/* Admin pages */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="products/new" element={<AdminProductForm />} />
                    <Route path="products/:id/edit" element={<AdminProductForm />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="delivery-partners" element={<AdminDeliveryPartners />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="delivery-zones" element={<AdminDeliveryZones />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                </Route>

                {/* Delivery Partner pages */}
                <Route path="/delivery/login" element={<DeliveryLogin />} />
                <Route path="/delivery" element={<DeliveryLayout />}>
                    <Route index element={<DeliveryDashboard />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
