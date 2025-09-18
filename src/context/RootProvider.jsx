import User from "../pages/user/User";
import { AuthProvider } from "./AuthContext";
import { CategoryProvider } from "./CategoryContext";
import { EmployeeProvider } from "./EmployeeContext";
import ProductProvider from "./ProductContext";
import { ShopProvider } from "./ShopContext";
import UserProvider from "./UserContext";

export default function RootProvider({ children }) {
  return (
    <AuthProvider>
      <EmployeeProvider>
        <ShopProvider>
          <ProductProvider>
            <CategoryProvider>
              <UserProvider>{children}</UserProvider>
            </CategoryProvider>
          </ProductProvider>
        </ShopProvider>
      </EmployeeProvider>
    </AuthProvider>
  );
}
