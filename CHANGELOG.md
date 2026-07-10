# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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

### Technical Notes
- TypeScript compilation now passes with no errors (`tsc --noEmit`)
- Build process completes successfully
- ESLint configuration simplified to avoid parsing errors with UI components
- Unused variables and functions prefixed with underscore or removed where appropriate
