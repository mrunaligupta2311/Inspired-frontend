
import { useState } from "react";
import {
  BookOpen,
  Building2,
  Images,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Trophy,
  Users,
  X,
} from "lucide-react";
import {
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";

import instituteLogo from "@institute-assets/inspired_institute_logo.jpeg";

import "./AdminLayout.css";

const navigation = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Courses",
    path: "/courses",
    icon: BookOpen,
  },
  {
    label: "Faculty",
    path: "/faculty",
    icon: Users,
  },
  {
    label: "Results",
    path: "/results",
    icon: Trophy,
  },
  {
    label: "Gallery",
    path: "/gallery",
    icon: Images,
  },
  {
    label: "Enquiries",
    path: "/enquiries",
    icon: MessageSquare,
  },
  {
    label: "Institute Information",
    path: "/institute",
    icon: Building2,
  },
];

const pageTitles = {
  "/": "Dashboard",
  "/courses": "Courses",
  "/faculty": "Faculty",
  "/results": "Results",
  "/gallery": "Gallery",
  "/enquiries": "Enquiries",
  "/institute": "Institute Information",
  "/administration": "Administration",
};

function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();

  const currentPageTitle =
    pageTitles[location.pathname] || "Admin Panel";

  const handleOpenMenu = () => {
    setMobileMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside
        className={`admin-sidebar ${
          mobileMenuOpen ? "mobile-open" : ""
        }`}
      >
        {/* Brand */}

        <div className="sidebar-brand">
          <div className="brand-logo">
            <img
              src={instituteLogo}
              alt="Inspired Institute"
            />
          </div>

          <button
            type="button"
            className="mobile-close-button"
            onClick={handleCloseMenu}
            aria-label="Close navigation menu"
          >
            <X
              size={20}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Navigation */}

        <nav
          className="sidebar-nav"
          aria-label="Admin navigation"
        >
          <p className="nav-section-title">
            MAIN MENU
          </p>

          {navigation.map(
            ({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={handleCloseMenu}
              >
                <Icon
                  size={19}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <span>{label}</span>
              </NavLink>
            )
          )}
        </nav>

        {/* ===================================================
            SIDEBAR ADMIN PROFILE
            Existing profile itself opens Administration
            =================================================== */}

        <NavLink
          to="/administration"
          className={({ isActive }) =>
            `sidebar-footer ${
              isActive ? "administration-profile-active" : ""
            }`
          }
          onClick={handleCloseMenu}
        >
          <div
            className="admin-avatar"
            aria-hidden="true"
          >
            A
          </div>

          <div className="admin-footer-info">
            <strong>Administrator</strong>

            <span>Institute Admin</span>
          </div>
        </NavLink>
      </aside>

      {/* =====================================================
          MOBILE OVERLAY
          ===================================================== */}

      {mobileMenuOpen && (
        <button
          type="button"
          className="admin-layout-overlay"
          aria-label="Close navigation menu"
          onClick={handleCloseMenu}
        />
      )}

      {/* =====================================================
          MAIN AREA
          ===================================================== */}

      <div className="admin-layout-main">
        {/* ===================================================
            HEADER
            =================================================== */}

        <header className="admin-header">
          <div className="header-left">
            <button
              type="button"
              className="mobile-menu-button"
              onClick={handleOpenMenu}
              aria-label="Open navigation menu"
            >
              <Menu
                size={21}
                strokeWidth={2}
                aria-hidden="true"
              />
            </button>

            <div className="header-page-info">
              <p className="header-eyebrow">
                ADMIN PANEL
              </p>

              <h2>{currentPageTitle}</h2>
            </div>
          </div>

          {/* =================================================
              HEADER ADMIN PROFILE
              Existing profile itself opens Administration
              ================================================= */}

          <NavLink
            to="/administration"
            className={({ isActive }) =>
              `header-admin ${
                isActive ? "administration-header-active" : ""
              }`
            }
          >
            <div
              className="header-avatar"
              aria-hidden="true"
            >
              A
            </div>

            <div className="header-admin-info">
              <strong>Administrator</strong>

              <span>Admin</span>
            </div>
          </NavLink>
        </header>

        {/* ===================================================
            PAGE CONTENT
            =================================================== */}

        <main className="admin-layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
