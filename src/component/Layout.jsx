import Navigation from "./Navigation";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on small, visible on lg */}
      <div className="hidden lg:block w-64 bg-white border-r">
        <Navigation />
      </div>

      {/* Mobile nav (top sticky) */}
      <div className="lg:hidden w-full">
        <Navigation />
      </div>

      {/* Main content area */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
