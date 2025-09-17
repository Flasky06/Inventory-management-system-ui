import User from "../pages/user/User";
import { AuthProvider } from "./AuthContext";
import { EmployeeProvider } from "./EmployeeContext";
import { ShopProvider } from "./ShopContext";
import UserProvider from "./UserContext";

export default function RootProvider({ children }) {
  return (
    <AuthProvider>
      <EmployeeProvider>
        <ShopProvider>
          <UserProvider>{children}</UserProvider>
        </ShopProvider>
      </EmployeeProvider>
    </AuthProvider>
  );
}
