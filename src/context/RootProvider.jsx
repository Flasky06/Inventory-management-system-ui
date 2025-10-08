import Inventory from "../pages/inventory/Inventory";
import User from "../pages/user/User";
import { AuthProvider } from "./AuthContext";
import { CategoryProvider } from "./CategoryContext";
import DispatchProvider from "./DispatchContext";
import { EmployeeProvider } from "./EmployeeContext";
import { InventoryProvider } from "./InventoryContext";
import ProductProvider from "./ProductContext";
import { ShopProvider } from "./ShopContext";
import UserProvider from "./UserContext";

export default function RootProvider({ children }) {
  return (
    <AuthProvider>
      <InventoryProvider>
        <DispatchProvider>
          <EmployeeProvider>
            <ShopProvider>
              <ProductProvider>
                <CategoryProvider>
                  <UserProvider>{children}</UserProvider>
                </CategoryProvider>
              </ProductProvider>
            </ShopProvider>
          </EmployeeProvider>
        </DispatchProvider>
      </InventoryProvider>
    </AuthProvider>
  );
}
