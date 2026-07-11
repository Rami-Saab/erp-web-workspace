# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **System Settings Module** - New organization-wide settings for administrators
  - Company Profile tab (legal name, trading name, address, tax/VAT registration, logo upload)
  - Localization tab (system-wide default language, currency format, date format, timezone)
  - Financial tab (default currency, tax rates CRUD, payment terms, invoice/PO numbering)
  - User Management tab (scoped to existing roles: admin, sales, warehouse, finance)
  - Integrations tab (connect/disconnect third-party services UI)
  - Notifications tab (system-wide event triggers and role-based routing)
  - Data Management tab (export data, backup configuration, retention policy)
  - Branding tab (company logo, brand color, favicon)
  - Danger Zone tab (reset data, deactivate workspace with confirmation and audit logging)
- RequireRole wrapper component for role-based access control
- SystemSettingsContext for centralized system settings state management
- Mock API layer (`src/api/systemSettings.ts`) with realistic delays and failure simulation
- ESLint configuration with TypeScript, React, and React Hooks support
- `.env.example` file with environment variable templates
- Environment variable protection in `.gitignore`
- Full CRUD operations for OrdersPage (Create, Read, Update, Delete)
- Edit modal for OrdersPage with line item management
- Delete functionality for SuppliersPage

### Fixed
- Fixed all 41 TypeScript errors across 19 files
- Removed version numbers from import paths in UI components
- Fixed duplicate export error in `reports/index.ts`
- Fixed type mismatches in CustomSelect onChange handlers
- Fixed StatusBadge variant types (changed 'info' to 'default')
- Fixed UrgencyBadge prop names (changed 'urgency' to 'level')
- Removed unused imports and variables throughout the codebase
- Removed unused functions and incomplete feature placeholders

### Changed
- Updated DataTable component to accept optional config prop
- Consolidated duplicate FilterPanel components (analytics and reports modules remain separate due to different requirements)
- Consolidated CustomSelect components (reports module uses shared UI component)
- Wrapped app with SystemSettingsProvider for organization-wide settings access

### Technical Notes
- TypeScript compilation now passes with no errors (`tsc --noEmit`)
- Build process completes successfully
- ESLint configuration simplified to avoid parsing errors with UI components
- Unused variables and functions prefixed with underscore or removed where appropriate
- System Settings uses mock API layer with 400-900ms delays and 5-15% failure simulation
- System Settings is admin-only (protected by RequireRole wrapper)
- Localization precedence documented: system-wide default is for new users/unauthenticated contexts, personal preference takes precedence for individual sessions
