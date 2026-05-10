import { createRoot } from "react-dom/client";
import "./i18n";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { WishlistProvider } from "./context/WishlistContext.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <AuthProvider>
            <WishlistProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </WishlistProvider>
        </AuthProvider>
    </BrowserRouter>
);
