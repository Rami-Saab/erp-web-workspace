import { useEffect, useMemo, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Plus,
  Truck,
  Package,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Star,
  BarChart3,
  X,
  CheckCircle2,
  XCircle,
  Zap,
  Pencil,
  Trash2,
  Download,
  FileText,
  FileSpreadsheet,
  FileType2,
} from "lucide-react";
import { CustomSelect } from "./ui/CustomSelect";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

type Supplier = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  location: string;
  category: string;
  totalOrders: number;
  totalSpent: string;
  rating: number;
  status: "active" | "inactive";
  leadTimeDays: number;
};

type SupplierTab = "overview" | "pricing" | "performance" | "links";

type NewSupplierFormState = {
  name: string;
  contact: string;
  email: string;
  phoneCountry: string;
  phoneNumber: string;
  location: string;
  category: string;
  totalOrders: string;
  totalSpent: string;
  rating: string;
  status: Supplier["status"];
  leadTimeDays: string;
};

type NewSupplierFormErrors = Partial<Record<keyof NewSupplierFormState, string>>;

const baseSuppliers: Supplier[] = [
  {
    id: "SUP-001",
    name: "Tech Supplies Co.",
    contact: "John Smith",
    email: "contact@techsupplies.com",
    phone: "+966 11 234 5678",
    location: "Riyadh, SA",
    category: "Electronics",
    totalOrders: 45,
    totalSpent: "$125,400",
    rating: 4.8,
    status: "active",
    leadTimeDays: 7,
  },
  {
    id: "SUP-002",
    name: "Office Furniture Ltd.",
    contact: "Sarah Johnson",
    email: "info@officefurn.com",
    phone: "+966 12 345 6789",
    location: "Jeddah, SA",
    category: "Furniture",
    totalOrders: 32,
    totalSpent: "$89,200",
    rating: 4.5,
    status: "active",
    leadTimeDays: 10,
  },
  {
    id: "SUP-003",
    name: "Global Electronics",
    contact: "Mike Brown",
    email: "sales@globalelec.com",
    phone: "+966 13 456 7890",
    location: "Dammam, SA",
    category: "Electronics",
    totalOrders: 67,
    totalSpent: "$234,500",
    rating: 4.9,
    status: "active",
    leadTimeDays: 5,
  },
  {
    id: "SUP-004",
    name: "Office Essentials",
    contact: "Emma Davis",
    email: "orders@officeess.com",
    phone: "+966 11 567 8901",
    location: "Riyadh, SA",
    category: "Office Supplies",
    totalOrders: 28,
    totalSpent: "$45,600",
    rating: 4.3,
    status: "active",
    leadTimeDays: 9,
  },
  {
    id: "SUP-005",
    name: "Premium Stationery",
    contact: "David Wilson",
    email: "info@premiumstat.com",
    phone: "+966 12 678 9012",
    location: "Jeddah, SA",
    category: "Stationery",
    totalOrders: 19,
    totalSpent: "$32,100",
    rating: 4.6,
    status: "inactive",
    leadTimeDays: 12,
  },
];

const mockSuppliers: Supplier[] = Array.from({ length: 100 }, (_, index) => {
  const base = baseSuppliers[index % baseSuppliers.length];
  const sequence = index + 1;
  const totalSpentBase = parseFloat(base.totalSpent.replace(/[$,]/g, ""));
  const totalSpentValue = totalSpentBase + (sequence % 10) * 900;
  return {
    ...base,
    id: `SUP-${String(sequence).padStart(3, "0")}`,
    name: `${base.name} ${sequence}`,
    totalOrders: base.totalOrders + (sequence % 12),
    totalSpent: `$${totalSpentValue.toLocaleString()}`,
    rating: Number(
      Math.min(5, Math.max(3.5, base.rating - (sequence % 4) * 0.1)).toFixed(1),
    ),
    leadTimeDays: Math.max(3, base.leadTimeDays + (sequence % 7) - 3),
    status: sequence % 7 === 0 ? "inactive" : "active",
  };
});

const paginationButtonStyle = {
  base: {
    position: "relative" as const,
    zIndex: 1,
    userSelect: "none" as const,
    WebkitUserSelect: "none" as const,
  },
};

const mockPricingList = [
  {
    id: "PRC-001",
    product: "Laptop HP ProBook",
    sku: "LT-HP-450",
    baseCost: "$720",
    discount: "5%",
    validUntil: "2025-12-31",
  },
  {
    id: "PRC-002",
    product: "Wireless Mouse Logitech",
    sku: "MS-LG-203",
    baseCost: "$18",
    discount: "8%",
    validUntil: "2025-08-31",
  },
  {
    id: "PRC-003",
    product: 'Monitor Dell 27"',
    sku: "MN-DL-270",
    baseCost: "$260",
    discount: "4%",
    validUntil: "2025-10-15",
  },
];

const mockSupplierPOs = [
  {
    id: "PO-2024-003",
    date: "2024-11-18",
    amount: "$21,000",
    status: "Received",
  },
  {
    id: "PO-2024-009",
    date: "2024-11-17",
    amount: "$18,750",
    status: "Received",
  },
  {
    id: "PO-2024-017",
    date: "2024-11-22",
    amount: "$8,150",
    status: "Approved",
  },
];

const mockSupplierInvoices = [
  {
    id: "INV-SUP-014",
    date: "2024-11-25",
    amount: "$7,450",
    status: "Paid",
  },
  {
    id: "INV-SUP-009",
    date: "2024-11-10",
    amount: "$4,200",
    status: "Open",
  },
];

const supplierCategoryOptions = [
  { value: "Electronics", label: "Electronics" },
  { value: "Electrical", label: "Electrical" },
  { value: "IT Hardware", label: "IT Hardware" },
  { value: "Software & Licenses", label: "Software & Licenses" },
  { value: "Networking & Telecom", label: "Networking & Telecom" },
  { value: "Security Systems", label: "Security Systems" },
  { value: "Automation & Controls", label: "Automation & Controls" },
  { value: "Furniture", label: "Furniture" },
  { value: "Office Supplies", label: "Office Supplies" },
  { value: "Stationery", label: "Stationery" },
  { value: "Printing & Imaging", label: "Printing & Imaging" },
  { value: "Consumables", label: "Consumables" },
  { value: "Hardware & Tools", label: "Hardware & Tools" },
  { value: "Machinery & Equipment", label: "Machinery & Equipment" },
  { value: "Industrial Supplies", label: "Industrial Supplies" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Metals & Steel", label: "Metals & Steel" },
  { value: "Plastics & Polymers", label: "Plastics & Polymers" },
  { value: "Glass & Ceramics", label: "Glass & Ceramics" },
  { value: "Chemicals", label: "Chemicals" },
  { value: "Raw Materials", label: "Raw Materials" },
  { value: "Spare Parts", label: "Spare Parts" },
  { value: "Packaging", label: "Packaging" },
  { value: "Logistics & Shipping", label: "Logistics & Shipping" },
  { value: "Transportation", label: "Transportation" },
  { value: "Warehousing", label: "Warehousing" },
  { value: "Customs & Brokerage", label: "Customs & Brokerage" },
  { value: "Fuel & Lubricants", label: "Fuel & Lubricants" },
  { value: "Maintenance & Repairs", label: "Maintenance & Repairs" },
  { value: "Facility Management", label: "Facility Management" },
  { value: "Construction & Facilities", label: "Construction & Facilities" },
  { value: "Building Materials", label: "Building Materials" },
  { value: "HVAC", label: "HVAC" },
  { value: "Plumbing", label: "Plumbing" },
  { value: "Cleaning & Janitorial", label: "Cleaning & Janitorial" },
  { value: "Pest Control", label: "Pest Control" },
  { value: "Safety & PPE", label: "Safety & PPE" },
  { value: "Fire Safety", label: "Fire Safety" },
  { value: "Environmental & Waste", label: "Environmental & Waste" },
  { value: "Medical Supplies", label: "Medical Supplies" },
  { value: "Marketing & Printing", label: "Marketing & Printing" },
  { value: "Advertising & Media", label: "Advertising & Media" },
  { value: "Events & Exhibitions", label: "Events & Exhibitions" },
  { value: "Branded Merchandise", label: "Branded Merchandise" },
  { value: "Apparel & Uniforms", label: "Apparel & Uniforms" },
  { value: "Textiles", label: "Textiles" },
  { value: "Leather & Accessories", label: "Leather & Accessories" },
  { value: "Sports & Fitness", label: "Sports & Fitness" },
  { value: "Toys & Games", label: "Toys & Games" },
  { value: "Books & Media", label: "Books & Media" },
  { value: "Hospitality Supplies", label: "Hospitality Supplies" },
  { value: "Cleaning Chemicals", label: "Cleaning Chemicals" },
  { value: "Personal Care", label: "Personal Care" },
  { value: "Health & Wellness", label: "Health & Wellness" },
  { value: "Cosmetics & Beauty", label: "Cosmetics & Beauty" },
  { value: "Agriculture", label: "Agriculture" },
  { value: "Seeds & Fertilizers", label: "Seeds & Fertilizers" },
  { value: "Animal Feed", label: "Animal Feed" },
  { value: "Food Ingredients", label: "Food Ingredients" },
  { value: "Food & Beverage", label: "Food & Beverage" },
  { value: "Beverages", label: "Beverages" },
  { value: "Perishables", label: "Perishables" },
  { value: "Catering", label: "Catering" },
  { value: "Professional Services", label: "Professional Services" },
  { value: "Consulting", label: "Consulting" },
  { value: "Legal Services", label: "Legal Services" },
  { value: "Accounting & Audit", label: "Accounting & Audit" },
  { value: "Insurance", label: "Insurance" },
  { value: "HR & Recruitment", label: "HR & Recruitment" },
  { value: "Training & Development", label: "Training & Development" },
  { value: "Travel & Accommodation", label: "Travel & Accommodation" },
  { value: "Medical & Pharma", label: "Medical & Pharma" },
  { value: "Laboratory Supplies", label: "Laboratory Supplies" },
  { value: "Biotech", label: "Biotech" },
  { value: "Education & Training", label: "Education & Training" },
  { value: "Publishing", label: "Publishing" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Security Services", label: "Security Services" },
  { value: "Data & Analytics", label: "Data & Analytics" },
  { value: "Cloud Services", label: "Cloud Services" },
  { value: "Hosting & Domains", label: "Hosting & Domains" },
  { value: "Telecommunications Services", label: "Telecommunications Services" },
  { value: "Utilities & Energy", label: "Utilities & Energy" },
  { value: "Water & Sewage", label: "Water & Sewage" },
  { value: "Renewable Energy", label: "Renewable Energy" },
  { value: "Mining & Oil", label: "Mining & Oil" },
  { value: "Real Estate", label: "Real Estate" },
  { value: "Leasing & Rentals", label: "Leasing & Rentals" },
  { value: "Government & Public Sector", label: "Government & Public Sector" },
  { value: "Non-Profit", label: "Non-Profit" },
  { value: "Other", label: "Other" },
];

function useToasts() {
  const [toasts, setToasts] = useState<
    { id: string; type: "success" | "error" | "info"; text: string }[]
  >([]);
  const push = useCallback(
    (t: { type: "success" | "error" | "info"; text: string }) => {
      const id = String(Date.now()) + Math.random();
      setToasts((s) => [...s, { id, ...t }]);
      setTimeout(
        () => setToasts((s) => s.filter((x) => x.id !== id)),
        3000,
      );
    },
    [],
  );
  return { toasts, push };
}

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const suppliersPerPage = 10;
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<SupplierTab>("overview");
  const [isNewSupplierModalOpen, setIsNewSupplierModalOpen] = useState(false);
  const [isEditSupplierModalOpen, setIsEditSupplierModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);
  const [isDownloadSupplierModalOpen, setIsDownloadSupplierModalOpen] = useState(false);
  const [supplierToDownload, setSupplierToDownload] = useState<Supplier | null>(null);
  const { toasts, push } = useToasts();
  const [locationSearch, setLocationSearch] = useState("");
  const [allCities, setAllCities] = useState<
    { name: string; country: string }[] | null
  >(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<NewSupplierFormErrors>({});
  const [newSupplierForm, setNewSupplierForm] = useState<NewSupplierFormState>({
    name: "",
    contact: "",
    email: "",
    phoneCountry: "",
    phoneNumber: "",
    location: "",
    category: "",
    totalOrders: "",
    totalSpent: "",
    rating: "",
    status: "active" as Supplier["status"],
    leadTimeDays: "",
  });
  const [editSupplierForm, setEditSupplierForm] = useState<NewSupplierFormState>({
    name: "",
    contact: "",
    email: "",
    phoneCountry: "",
    phoneNumber: "",
    location: "",
    category: "",
    totalOrders: "",
    totalSpent: "",
    rating: "",
    status: "active" as Supplier["status"],
    leadTimeDays: "",
  });
  const countryDisplayNames = useMemo(() => {
    if (typeof Intl !== "undefined" && "DisplayNames" in Intl) {
      return new Intl.DisplayNames(["en"], { type: "region" });
    }
    return null;
  }, []);
  const phoneCountryOptions = useMemo(() => {
    return getCountries()
      .map((code) => {
        const name = countryDisplayNames?.of(code) ?? code;
        return { value: code, label: name };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [countryDisplayNames]);

  useEffect(() => {
    if (isNewSupplierModalOpen) {
      document.body.classList.add("modal-open");
      return () => document.body.classList.remove("modal-open");
    }
    document.body.classList.remove("modal-open");
    return undefined;
  }, [isNewSupplierModalOpen]);

  useEffect(() => {
    if (!isNewSupplierModalOpen || allCities) {
      return;
    }
    let cancelled = false;
    setIsLocationLoading(true);
    fetch("/cities.json")
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        const normalized = Array.isArray(data)
          ? data.map((city: any) => ({
              name: String(city?.name ?? "").trim(),
              country: String(city?.country ?? "").trim(),
            }))
          : [];
        setAllCities(normalized.filter((c) => c.name && c.country));
      })
      .catch(() => {
        if (!cancelled) {
          setAllCities([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLocationLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isNewSupplierModalOpen, allCities]);

  const locationData = useMemo(() => {
    const query = locationSearch.trim().toLowerCase();
    if (!allCities) {
      return { options: [], codeByLabel: {} as Record<string, string> };
    }
    const source =
      query.length === 0
        ? allCities
        : allCities.filter(
            (city) =>
              city.name.toLowerCase().includes(query) ||
              city.country.toLowerCase().includes(query),
          );
    const codeByLabel: Record<string, string> = {};
    const options = source.map((city) => {
      const countryCode = String(city.country || "").toUpperCase();
      const countryName = countryDisplayNames?.of(countryCode) ?? countryCode;
      const label = `${city.name}, ${countryName}`;
      codeByLabel[label] = countryCode.toLowerCase();
      return { value: label, label };
    });
    return { options, codeByLabel };
  }, [locationSearch, allCities]);

  const handleOpenNewSupplierModal = () => {
    setIsNewSupplierModalOpen(true);
    setLocationSearch("");
    setAllCities(null);
    setFormErrors({});
    setNewSupplierForm({
      name: "",
      contact: "",
      email: "",
      phoneCountry: "",
      phoneNumber: "",
      location: "",
      category: "",
      totalOrders: "",
      totalSpent: "",
      rating: "",
      status: "active",
      leadTimeDays: "",
    });
  };

  const handleOpenEditSupplierModal = (supplier: Supplier) => {
    setIsEditSupplierModalOpen(true);
    setSupplierToEdit(supplier);
    setLocationSearch("");

    const digits = supplier.phone.replace(/[^\d]/g, "");
    let phoneCountry = "";
    for (const code of getCountries()) {
      const calling = getCountryCallingCode(code);
      if (digits.startsWith(calling)) {
        phoneCountry = code;
        break;
      }
    }
    const callingCode = phoneCountry
      ? getCountryCallingCode(phoneCountry as Parameters<typeof getCountryCallingCode>[0])
      : "";
    const phoneNumber = callingCode && digits.startsWith(callingCode)
      ? digits.slice(callingCode.length)
      : digits;

    setEditSupplierForm({
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      phoneCountry,
      phoneNumber,
      location: supplier.location,
      category: supplier.category,
      totalOrders: String(supplier.totalOrders),
      totalSpent: supplier.totalSpent.replace(/[$,]/g, ""),
      rating: String(supplier.rating),
      status: supplier.status,
      leadTimeDays: String(supplier.leadTimeDays),
    });
  };

  const handleCloseNewSupplierModal = () => {
    setIsNewSupplierModalOpen(false);
    setLocationSearch("");
    setAllCities(null);
    setFormErrors({});
    setNewSupplierForm({
      name: "",
      contact: "",
      email: "",
      phoneCountry: "",
      phoneNumber: "",
      location: "",
      category: "",
      totalOrders: "",
      totalSpent: "",
      rating: "",
      status: "active",
      leadTimeDays: "",
    });
  };

  const handleCloseEditSupplierModal = () => {
    setIsEditSupplierModalOpen(false);
    setSupplierToEdit(null);
    setEditSupplierForm({
      name: "",
      contact: "",
      email: "",
      phoneCountry: "",
      phoneNumber: "",
      location: "",
      category: "",
      totalOrders: "",
      totalSpent: "",
      rating: "",
      status: "active",
      leadTimeDays: "",
    });
  };

  const normalizeIntegerInput = (value: string, maxDigits = 6) =>
    value.replace(/\D/g, "").slice(0, maxDigits);

  const normalizeMoneyInput = (value: string, maxDecimals = 2) => {
    const cleaned = value.replace(/[^0-9.]/g, "");
    if (!cleaned) return "";
    const [integerPart, ...rest] = cleaned.split(".");
    const decimals = rest.join("").slice(0, maxDecimals);
    return decimals.length > 0 ? `${integerPart}.${decimals}` : integerPart;
  };

  const countDigits = (value: string) => value.replace(/\D/g, "").length;
  const getWordCount = (value: string) =>
    value.trim().split(/\s+/).filter(Boolean).length;

  const isValidName = (value: string) =>
    /^[\p{L}]+(?:[\p{L}\s'-]*[\p{L}])?$/u.test(value);

  const normalizeContactInput = (value: string) => {
    const cleaned = value.replace(/\s+/g, " ").trim();
    const words = cleaned.split(" ").filter(Boolean);
    const normalizedWords = words.map((word) => {
      const first = word.charAt(0).toLocaleUpperCase();
      const rest = word.slice(1);
      return `${first}${rest}`;
    });
    if (words.length <= 2) {
      return normalizedWords.join(" ");
    }
    return normalizedWords.slice(0, 2).join(" ");
  };

  const handleNameChange = (value: string) => {
    setNewSupplierForm((prev) => ({ ...prev, name: value }));
    if (formErrors.name) {
      setFormErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleContactChange = (value: string) => {
    const limited = normalizeContactInput(value);
    setNewSupplierForm((prev) => ({ ...prev, contact: limited }));
    const wordCount = getWordCount(limited);
    if (wordCount === 1 && limited.trim().length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        contact: "Please enter first and last name separated by a space.",
      }));
      return;
    }
    if (wordCount > 2) {
      setFormErrors((prev) => ({
        ...prev,
        contact: "Contact person must be first and last name only.",
      }));
      return;
    }
    if (formErrors.contact) {
      setFormErrors((prev) => ({ ...prev, contact: undefined }));
    }
  };

  const handleNameBlur = () => {
    const trimmed = newSupplierForm.name.trim();
    if (trimmed && !isValidName(trimmed)) {
      setFormErrors((prev) => ({
        ...prev,
        name: "Supplier name must contain letters only.",
      }));
    }
  };

  const handleContactBlur = () => {
    const normalized = normalizeContactInput(newSupplierForm.contact);
    if (normalized !== newSupplierForm.contact) {
      setNewSupplierForm((prev) => ({ ...prev, contact: normalized }));
    }
    const trimmed = normalized.trim();
    const wordCount = getWordCount(trimmed);
    if (wordCount === 1 && trimmed.length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        contact: "Please enter first and last name separated by a space.",
      }));
      return;
    }
    if (wordCount > 2) {
      setFormErrors((prev) => ({
        ...prev,
        contact: "Contact person must be first and last name only.",
      }));
      return;
    }
    if (trimmed && !isValidName(trimmed)) {
      setFormErrors((prev) => ({
        ...prev,
        contact: "Contact person must contain letters only.",
      }));
    }
  };

  const handleLeadTimeChange = (value: string) => {
    const cleaned = normalizeIntegerInput(value, 3);
    setNewSupplierForm((prev) => ({ ...prev, leadTimeDays: cleaned }));
    if (formErrors.leadTimeDays) {
      setFormErrors((prev) => ({ ...prev, leadTimeDays: undefined }));
    }
  };

  const handlePhoneNumberChange = (value: string) => {
    const cleaned = value.replace(/[^\d\s]/g, "");
    setNewSupplierForm((prev) => ({ ...prev, phoneNumber: cleaned }));
    if (formErrors.phoneNumber) {
      setFormErrors((prev) => ({ ...prev, phoneNumber: undefined }));
    }
  };

  const handleTotalOrdersChange = (value: string) => {
    const cleaned = normalizeIntegerInput(value, 7);
    setNewSupplierForm((prev) => ({ ...prev, totalOrders: cleaned }));
    if (formErrors.totalOrders) {
      setFormErrors((prev) => ({ ...prev, totalOrders: undefined }));
    }
  };

  const handleTotalSpentChange = (value: string) => {
    const cleaned = normalizeMoneyInput(value, 2);
    setNewSupplierForm((prev) => ({ ...prev, totalSpent: cleaned }));
    if (formErrors.totalSpent) {
      setFormErrors((prev) => ({ ...prev, totalSpent: undefined }));
    }
  };

  const handleRatingChange = (value: string) => {
    const cleaned = value.replace(/[^\d.]/g, "");
    const normalized =
      cleaned.indexOf(".") === -1
        ? cleaned
        : `${cleaned.split(".")[0]}.${cleaned
            .split(".")
            .slice(1)
            .join("")}`;
    setNewSupplierForm((prev) => ({ ...prev, rating: normalized }));
    if (!normalized.trim()) {
      setFormErrors((prev) => ({
        ...prev,
        rating: "Please enter a rating between 0 and 5.",
      }));
      return;
    }
    const parsed = parseFloat(normalized);
    if (Number.isNaN(parsed) || parsed < 0 || parsed > 5) {
      setFormErrors((prev) => ({
        ...prev,
        rating: "Rating must be a number from 0 to 5.",
      }));
      return;
    }
    if (formErrors.rating) {
      setFormErrors((prev) => ({ ...prev, rating: undefined }));
    }
  };

  const handleSubmitNewSupplier = () => {
    const errors: NewSupplierFormErrors = {};
    const trimmedName = newSupplierForm.name.trim();
    const trimmedContact = newSupplierForm.contact.trim();
    const trimmedEmail = newSupplierForm.email.trim();
    const trimmedPhoneCountry = newSupplierForm.phoneCountry.trim();
    const trimmedPhoneNumber = newSupplierForm.phoneNumber.trim();
    const trimmedLocation = newSupplierForm.location.trim();
    const trimmedCategory = newSupplierForm.category.trim();
    const trimmedTotalOrders = newSupplierForm.totalOrders.trim();
    const trimmedTotalSpent = newSupplierForm.totalSpent.trim();
    const trimmedRating = newSupplierForm.rating.trim();
    const trimmedLeadTime = newSupplierForm.leadTimeDays.trim();

    if (!trimmedName) {
      errors.name = "Supplier name is required.";
    } else if (!isValidName(trimmedName)) {
      errors.name = "Supplier name must contain letters only.";
    }
    if (!trimmedContact) {
      errors.contact = "Contact person is required.";
    } else if (getWordCount(trimmedContact) === 1) {
      errors.contact = "Please enter first and last name separated by a space.";
    } else if (getWordCount(trimmedContact) > 2) {
      errors.contact = "Contact person must be first and last name only.";
    } else if (!isValidName(trimmedContact)) {
      errors.contact = "Contact person must contain letters only.";
    }
    if (!trimmedEmail) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      errors.email = "Enter a valid email address.";
    }
    if (!trimmedPhoneCountry) errors.phoneCountry = "Select a country.";
    if (!trimmedPhoneNumber) {
      errors.phoneNumber = "Phone number is required.";
    } else if (countDigits(trimmedPhoneNumber) < 6) {
      errors.phoneNumber = "Phone number is too short.";
    }
    if (!trimmedLocation) errors.location = "Location is required.";
    if (!trimmedCategory) errors.category = "Category is required.";
    if (!trimmedTotalOrders) {
      errors.totalOrders = "Orders count is required.";
    } else if (Number.isNaN(Number(trimmedTotalOrders))) {
      errors.totalOrders = "Orders count must be a number.";
    }
    if (!trimmedTotalSpent) {
      errors.totalSpent = "Total spent is required.";
    } else if (Number.isNaN(Number(trimmedTotalSpent))) {
      errors.totalSpent = "Total spent must be a valid amount.";
    }
    if (!trimmedRating) errors.rating = "Rating is required (0-5).";
    if (!trimmedLeadTime) {
      errors.leadTimeDays = "Lead time is required.";
    } else if (Number.isNaN(Number(trimmedLeadTime))) {
      errors.leadTimeDays = "Lead time must be a number.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      push({ type: "error", text: "Please fix the highlighted fields" });
      return;
    }

    const lastSupplier = suppliers[suppliers.length - 1];
    const lastNumber = lastSupplier
      ? parseInt(lastSupplier.id.split("-")[1])
      : 0;
    const newId = `SUP-${String(lastNumber + 1).padStart(3, "0")}`;

    const leadTimeValue = parseInt(newSupplierForm.leadTimeDays, 10);
    if (isNaN(leadTimeValue) || leadTimeValue < 1) {
      setFormErrors((prev) => ({
        ...prev,
        leadTimeDays: "Lead time must be at least 1 day.",
      }));
      push({ type: "error", text: "Please enter a valid lead time" });
      return;
    }

    const totalOrdersValue = parseInt(newSupplierForm.totalOrders, 10);
    if (isNaN(totalOrdersValue) || totalOrdersValue < 0) {
      setFormErrors((prev) => ({
        ...prev,
        totalOrders: "Orders must be 0 or higher.",
      }));
      push({ type: "error", text: "Please enter a valid orders count" });
      return;
    }

    const totalSpentValue = parseFloat(
      newSupplierForm.totalSpent.replace(/[$,]/g, ""),
    );
    if (isNaN(totalSpentValue) || totalSpentValue < 0) {
      setFormErrors((prev) => ({
        ...prev,
        totalSpent: "Total spent must be 0 or higher.",
      }));
      push({ type: "error", text: "Please enter a valid total spent amount" });
      return;
    }

    const ratingValue = parseFloat(newSupplierForm.rating);
    if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
      setFormErrors((prev) => ({
        ...prev,
        rating: "Rating must be between 0 and 5.",
      }));
      push({ type: "error", text: "Please enter a rating between 0 and 5" });
      return;
    }

    const phoneNumber = newSupplierForm.phoneNumber.replace(/\s+/g, " ").trim();
    const callingCode = getCountryCallingCode(
      newSupplierForm.phoneCountry as Parameters<typeof getCountryCallingCode>[0],
    );
    const fullPhone = `+${callingCode} ${phoneNumber}`.trim();

    const newSupplier: Supplier = {
      id: newId,
      name: newSupplierForm.name.trim(),
      contact: newSupplierForm.contact.trim(),
      email: newSupplierForm.email.trim(),
      phone: fullPhone,
      location: newSupplierForm.location.trim(),
      category: newSupplierForm.category,
      totalOrders: totalOrdersValue,
      totalSpent: `$${totalSpentValue.toLocaleString()}`,
      rating: Number(ratingValue.toFixed(1)),
      status: newSupplierForm.status,
      leadTimeDays: leadTimeValue,
    };

    setSuppliers((prev) => [...prev, newSupplier]);
    push({ type: "success", text: `Supplier ${newId} created successfully` });
    handleCloseNewSupplierModal();
  };

  const handleSubmitEditSupplier = () => {
    if (!supplierToEdit) return;

    const trimmedName = editSupplierForm.name.trim();
    const trimmedContact = editSupplierForm.contact.trim();
    const trimmedEmail = editSupplierForm.email.trim();
    const trimmedPhoneCountry = editSupplierForm.phoneCountry.trim();
    const trimmedPhoneNumber = editSupplierForm.phoneNumber.trim();
    const trimmedLocation = editSupplierForm.location.trim();
    const trimmedCategory = editSupplierForm.category.trim();
    const trimmedTotalOrders = editSupplierForm.totalOrders.trim();
    const trimmedTotalSpent = editSupplierForm.totalSpent.trim();
    const trimmedRating = editSupplierForm.rating.trim();
    const trimmedLeadTime = editSupplierForm.leadTimeDays.trim();

    if (!trimmedName) {
      push({ type: "error", text: "Supplier name is required" });
      return;
    }
    if (!trimmedContact) {
      push({ type: "error", text: "Contact person is required" });
      return;
    }
    if (!trimmedEmail || !/\S+@\S+\.\S+/.test(trimmedEmail)) {
      push({ type: "error", text: "Please enter a valid email address" });
      return;
    }
    if (!trimmedPhoneCountry || !trimmedPhoneNumber) {
      push({ type: "error", text: "Please enter a valid phone number" });
      return;
    }
    if (countDigits(trimmedPhoneNumber) < 6) {
      push({ type: "error", text: "Phone number is too short" });
      return;
    }
    if (!trimmedLocation || !trimmedCategory) {
      push({ type: "error", text: "Please select location and category" });
      return;
    }

    const leadTimeValue = parseInt(trimmedLeadTime, 10);
    if (Number.isNaN(leadTimeValue) || leadTimeValue < 1) {
      push({ type: "error", text: "Lead time must be at least 1 day" });
      return;
    }

    const totalOrdersValue = parseInt(trimmedTotalOrders, 10);
    if (Number.isNaN(totalOrdersValue) || totalOrdersValue < 0) {
      push({ type: "error", text: "Orders must be 0 or higher" });
      return;
    }

    const totalSpentValue = parseFloat(trimmedTotalSpent.replace(/[$,]/g, ""));
    if (Number.isNaN(totalSpentValue) || totalSpentValue < 0) {
      push({ type: "error", text: "Total spent must be 0 or higher" });
      return;
    }

    const ratingValue = parseFloat(trimmedRating);
    if (Number.isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
      push({ type: "error", text: "Rating must be between 0 and 5" });
      return;
    }

    const callingCode = getCountryCallingCode(
      editSupplierForm.phoneCountry as Parameters<typeof getCountryCallingCode>[0],
    );
    const phoneNumber = editSupplierForm.phoneNumber.replace(/\s+/g, " ").trim();
    const fullPhone = `+${callingCode} ${phoneNumber}`.trim();

    const updatedSupplier: Supplier = {
      ...supplierToEdit,
      name: trimmedName,
      contact: trimmedContact,
      email: trimmedEmail,
      phone: fullPhone,
      location: trimmedLocation,
      category: editSupplierForm.category,
      totalOrders: totalOrdersValue,
      totalSpent: `$${totalSpentValue.toLocaleString()}`,
      rating: Number(ratingValue.toFixed(1)),
      status: editSupplierForm.status,
      leadTimeDays: leadTimeValue,
    };

    setSuppliers((prev) =>
      prev.map((s) => (s.id === supplierToEdit.id ? updatedSupplier : s)),
    );
    push({ type: "success", text: `Supplier ${supplierToEdit.id} updated successfully` });
    handleCloseEditSupplierModal();
  };

  const handleViewSupplier = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    setActiveTab("overview");
  };

  const handleEditSupplier = (supplierId: string) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    if (supplier) {
      handleOpenEditSupplierModal(supplier);
    }
  };

  const handleDeleteSupplier = (supplierId: string) => {
    push({ type: "info", text: `Delete ${supplierId} (coming soon)` });
  };

  const handleDownloadSupplier = (supplierId: string) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    if (!supplier) return;
    setSupplierToDownload(supplier);
    setIsDownloadSupplierModalOpen(true);
  };

  const handleCloseDownloadSupplierModal = () => {
    setIsDownloadSupplierModalOpen(false);
    setSupplierToDownload(null);
  };

  const downloadSupplierExcel = (supplier: Supplier) => {
    const rows = [
      ["ID", "Name", "Contact", "Email", "Phone", "Location", "Category", "Total Orders", "Total Spent", "Rating", "Status", "Lead Time Days"],
      [
        supplier.id,
        supplier.name,
        supplier.contact,
        supplier.email,
        supplier.phone,
        supplier.location,
        supplier.category,
        String(supplier.totalOrders),
        supplier.totalSpent,
        String(supplier.rating),
        supplier.status,
        String(supplier.leadTimeDays),
      ],
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${supplier.id}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    push({ type: "success", text: `Supplier ${supplier.id} downloaded successfully` });
  };

  const downloadSupplierWord = (supplier: Supplier) => {
    const content = [
      `Supplier ID: ${supplier.id}`,
      `Name: ${supplier.name}`,
      `Contact: ${supplier.contact}`,
      `Email: ${supplier.email}`,
      `Phone: ${supplier.phone}`,
      `Location: ${supplier.location}`,
      `Category: ${supplier.category}`,
      `Total Orders: ${supplier.totalOrders}`,
      `Total Spent: ${supplier.totalSpent}`,
      `Rating: ${supplier.rating}`,
      `Status: ${supplier.status}`,
      `Lead Time Days: ${supplier.leadTimeDays}`,
    ].join("\n");
    const blob = new Blob([content], { type: "application/msword;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${supplier.id}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    push({ type: "success", text: `Supplier ${supplier.id} downloaded successfully` });
  };

  const downloadSupplierPdf = async (supplier: Supplier) => {
    push({ type: "info", text: `Preparing PDF for supplier ${supplier.id}...` });
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      const primaryColor: [number, number, number] = [30, 41, 59];
      const textColor: [number, number, number] = [51, 51, 51];
      const lightGray: [number, number, number] = [200, 200, 200];

      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 32, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("ERP System", 20, 18);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("SUPPLIER", 20, 27);

      doc.setTextColor(...textColor);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(supplier.id, 20, 45);
      doc.setDrawColor(...lightGray);
      doc.setLineWidth(0.5);
      doc.line(20, 50, 190, 50);

      const details = [
        ["Name", supplier.name],
        ["Contact", supplier.contact],
        ["Email", supplier.email],
        ["Phone", supplier.phone],
        ["Location", supplier.location],
        ["Category", supplier.category],
        ["Total Orders", String(supplier.totalOrders)],
        ["Total Spent", supplier.totalSpent],
        ["Rating", String(supplier.rating)],
        ["Status", supplier.status],
        ["Lead Time Days", String(supplier.leadTimeDays)],
      ];

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      let yPos = 62;
      details.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, 20, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(String(value), 70, yPos);
        yPos += 7;
        if (yPos > 275) {
          doc.addPage();
          yPos = 20;
        }
      });

      doc.save(`${supplier.id}.pdf`);
      push({ type: "success", text: `Supplier ${supplier.id} downloaded successfully` });
    } catch (error) {
      console.error("Error generating PDF:", error);
      push({ type: "error", text: `Failed to generate PDF for supplier ${supplier.id}` });
    }
  };

  const handleConfirmDownloadSupplier = async (format: "excel" | "pdf" | "word") => {
    if (!supplierToDownload) return;
    if (format === "excel") {
      downloadSupplierExcel(supplierToDownload);
    } else if (format === "word") {
      downloadSupplierWord(supplierToDownload);
    } else {
      await downloadSupplierPdf(supplierToDownload);
    }
    handleCloseDownloadSupplierModal();
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterCategory === "all" || supplier.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredSuppliers.length / suppliersPerPage);
  const startIndex = (currentPage - 1) * suppliersPerPage;
  const endIndex = startIndex + suppliersPerPage;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    pages.push(1);

    if (currentPage <= 3) {
      for (let i = 2; i <= 4; i++) {
        if (i <= totalPages) pages.push(i);
      }
      if (totalPages > 5) {
        pages.push("...");
        pages.push(totalPages);
      }
    } else if (currentPage >= totalPages - 2) {
      if (totalPages > 5) {
        pages.push("...");
      }
      for (let i = totalPages - 3; i <= totalPages; i++) {
        if (i > 1) pages.push(i);
      }
    } else {
      pages.push("...");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const totalRating =
    suppliers.reduce((sum, supplier) => sum + supplier.rating, 0) || 0;
  const avgRating =
    suppliers.length > 0
      ? (totalRating / suppliers.length).toFixed(1)
      : "0.0";
  const totalSuppliers = suppliers.length;
  const totalOrders = suppliers.reduce(
    (sum, supplier) => sum + supplier.totalOrders,
    0,
  );
  const totalSpentValue = suppliers.reduce((sum, supplier) => {
    const numeric = parseFloat(supplier.totalSpent.replace(/[$,]/g, ""));
    return sum + (Number.isNaN(numeric) ? 0 : numeric);
  }, 0);
  const totalSpentFormatted = `$${totalSpentValue.toLocaleString()}`;
  const getStatusColor = (status: Supplier["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-300 border-green-400/30";
      case "inactive":
        return "bg-red-500/20 text-red-300 border-red-400/30";
      default:
        return "bg-white/15 text-white/80 border-white/20";
    }
  };

  const selectedSupplier =
    selectedSupplierId &&
    suppliers.find((s) => s.id === selectedSupplierId);

  return (
    <div>
      {/* New Supplier Modal */}
      {isNewSupplierModalOpen &&
        createPortal(
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
            style={{ zIndex: 2000000 }}
            onClick={handleCloseNewSupplierModal}
          >
            <div
              className="rounded-2xl w-full max-w-5xl overflow-hidden flex flex-col animate-fadeIn max-h-[calc(100vh-160px)] min-h-0"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(24px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow:
                  "0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 2px 8px 0 rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                zIndex: 2000001,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-blue-300"
                    style={{
                      background: "rgba(59, 130, 246, 0.15)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      boxShadow:
                        "0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <Truck className="w-5 h-5 text-blue-200" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Add New Supplier
                    </h2>
                    <p className="text-sm text-white/50">
                      Fill in supplier details
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseNewSupplierModal}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 min-h-0">
                <div className="space-y-6">
                  <div
                    className="grid gap-5 -mt-3"
                    style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Supplier Name
                      </label>
                      <input
                        type="text"
                        value={newSupplierForm.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        onBlur={handleNameBlur}
                        placeholder="Enter supplier name"
                        className={`w-full px-4 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input ${
                          formErrors.name ? "ring-1 ring-red-400/60" : ""
                        }`}
                      />
                      {formErrors.name && (
                        <p className="mt-2 text-xs text-red-300">
                          {formErrors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        value={newSupplierForm.contact}
                        onChange={(e) => handleContactChange(e.target.value)}
                        onBlur={handleContactBlur}
                        onPaste={(e) => {
                          const text = e.clipboardData.getData("text");
                          if (text && !/\s/.test(text)) {
                            setFormErrors((prev) => ({
                              ...prev,
                              contact:
                                "Please enter first and last name separated by a space.",
                            }));
                          }
                        }}
                        placeholder="Enter contact name"
                        className={`w-full px-4 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input ${
                          formErrors.contact ? "ring-1 ring-red-400/60" : ""
                        }`}
                      />
                      {formErrors.contact && (
                        <p className="mt-2 text-xs text-red-300">
                          {formErrors.contact}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newSupplierForm.email}
                        onChange={(e) => {
                          setNewSupplierForm({
                            ...newSupplierForm,
                            email: e.target.value,
                          });
                          if (formErrors.email) {
                            setFormErrors((prev) => ({ ...prev, email: undefined }));
                          }
                        }}
                        placeholder="name@company.com"
                        className={`w-full px-4 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input ${
                          formErrors.email ? "ring-1 ring-red-400/60" : ""
                        }`}
                      />
                      {formErrors.email && (
                        <p className="mt-2 text-xs text-red-300">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    className="grid gap-5"
                    style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Phone
                      </label>
                      <div
                        className={`glass-input flex items-center w-full rounded-lg ${
                          formErrors.phoneCountry || formErrors.phoneNumber
                            ? "ring-1 ring-red-400/60"
                            : ""
                        }`}
                      >
                        <div className="border-r border-white/20">
                          <CustomSelect
                            value={newSupplierForm.phoneCountry}
                            onChange={(value) => {
                              setNewSupplierForm({
                                ...newSupplierForm,
                                phoneCountry: value as string,
                              });
                              if (formErrors.phoneCountry) {
                                setFormErrors((prev) => ({
                                  ...prev,
                                  phoneCountry: undefined,
                                }));
                              }
                            }}
                            options={phoneCountryOptions}
                            placeholder="Country"
                            className="w-auto"
                            searchable
                            searchPlaceholder="Search country..."
                            variant="plain"
                            renderValue={(option) => {
                              const countryCode = (option.value as string).toLowerCase();
                              const callingCode = getCountryCallingCode(
                                option.value as Parameters<typeof getCountryCallingCode>[0],
                              );
                              return (
                                <span className="flex items-center gap-2 text-xs text-white font-medium">
                                  <span
                                    className={`inline-block rounded-sm fi fi-${countryCode}`}
                                    style={{ width: "1rem", height: "0.75rem" }}
                                  />
                                  <span className="truncate">{option.label}</span>
                                  <span className="text-white/70">+{callingCode}</span>
                                </span>
                              );
                            }}
                            renderOption={(option, isSelected) => {
                              const countryCode = (option.value as string).toLowerCase();
                              const callingCode = getCountryCallingCode(
                                option.value as Parameters<typeof getCountryCallingCode>[0],
                              );
                              return (
                                <span
                                  className={`flex-1 min-w-0 text-xs transition-colors pr-4 flex items-center gap-2 ${
                                    isSelected
                                      ? "text-white font-semibold"
                                      : "text-white/90 group-hover:text-white"
                                  }`}
                                >
                                  <span
                                    className={`inline-block rounded-sm fi fi-${countryCode}`}
                                    style={{ width: "1rem", height: "0.75rem" }}
                                  />
                                  <span className="truncate">{option.label}</span>
                                  <span className="text-white/70">+{callingCode}</span>
                                </span>
                              );
                            }}
                          />
                        </div>
                        <input
                          type="tel"
                          inputMode="tel"
                          value={newSupplierForm.phoneNumber}
                          onChange={(e) => handlePhoneNumberChange(e.target.value)}
                          placeholder="Phone number"
                          className="flex-1 px-3 py-2.5 text-sm text-white bg-transparent placeholder-white/50 focus:outline-none"
                        />
                      </div>
                      {(formErrors.phoneCountry || formErrors.phoneNumber) && (
                        <p className="mt-2 text-xs text-red-300">
                          {formErrors.phoneCountry || formErrors.phoneNumber}
                        </p>
                      )}
                      <div className="mt-5">
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Lead Time (days)
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={newSupplierForm.leadTimeDays}
                          onChange={(e) => handleLeadTimeChange(e.target.value)}
                          placeholder="Enter lead time"
                        className={`w-full px-4 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input ${
                          formErrors.leadTimeDays ? "ring-1 ring-red-400/60" : ""
                        }`}
                        />
                      {formErrors.leadTimeDays && (
                        <p className="mt-2 text-xs text-red-300">
                          {formErrors.leadTimeDays}
                        </p>
                      )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Location
                      </label>
                      <div className="glass-input flex items-center w-full rounded-lg">
                        <div className="w-full px-2">
                          <CustomSelect
                            value={newSupplierForm.location}
                            onChange={(value) => {
                              setNewSupplierForm({
                                ...newSupplierForm,
                                location: value as string,
                              });
                              if (formErrors.location) {
                                setFormErrors((prev) => ({
                                  ...prev,
                                  location: undefined,
                                }));
                              }
                            }}
                            options={locationData.options}
                            placeholder="Select location"
                            className="w-full"
                            error={Boolean(formErrors.location)}
                            searchable
                            searchPlaceholder="Search city..."
                            searchValue={locationSearch}
                            onSearchChange={setLocationSearch}
                            disableInternalFilter
                            virtualized
                            itemSize={44}
                            listPadding="0.9rem"
                            optionPadding="0.6rem 0.75rem"
                            optionInset="0.4rem"
                            dropdownDirection="ltr"
                            variant="plain"
                            renderValue={(option) => {
                              const code =
                                locationData.codeByLabel[option.label] ?? "un";
                              return (
                                <span className="flex items-center gap-2 text-sm text-white">
                                  <span
                                    className={`inline-block rounded-sm fi fi-${code}`}
                                    style={{ width: "1rem", height: "0.75rem" }}
                                  />
                                  <span className="truncate">{option.label}</span>
                                </span>
                              );
                            }}
                            renderOption={(option, isSelected) => {
                              const code =
                                locationData.codeByLabel[option.label] ?? "un";
                              return (
                                <span
                                  className={`flex-1 min-w-0 pr-4 flex items-center gap-2 ${
                                    isSelected
                                      ? "text-white font-semibold"
                                      : "text-white/90 group-hover:text-white"
                                  }`}
                                >
                                  <span
                                    className={`inline-block rounded-sm fi fi-${code}`}
                                    style={{ width: "1rem", height: "0.75rem" }}
                                  />
                                  <span className="truncate text-xs">
                                    {option.label}
                                  </span>
                                </span>
                              );
                            }}
                            emptyMessage={
                              isLocationLoading
                                ? "Loading cities..."
                                : locationSearch.trim().length === 0
                                  ? "Type city name to search"
                                  : "No cities found"
                            }
                          />
                        </div>
                      </div>
                      {formErrors.location && (
                        <p className="mt-2 text-xs text-red-300">
                          {formErrors.location}
                        </p>
                      )}
                      <div className="mt-5">
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Rating (0-5)
                        </label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="decimal"
                          pattern="^(?:[0-4](?:\.\d)?|5(?:\.0)?)$"
                          value={newSupplierForm.rating}
                          onChange={(e) => handleRatingChange(e.target.value)}
                          onBlur={() => {
                            const raw = newSupplierForm.rating.trim();
                            if (!raw) {
                              setFormErrors((prev) => ({
                                ...prev,
                                rating: "Please enter a rating between 0 and 5.",
                              }));
                              return;
                            }
                            const parsed = parseFloat(raw);
                            if (Number.isNaN(parsed)) {
                              setNewSupplierForm((prev) => ({ ...prev, rating: "" }));
                              setFormErrors((prev) => ({
                                ...prev,
                                rating: "Rating must be a number from 0 to 5.",
                              }));
                              return;
                            }
                            const clamped = Math.min(5, Math.max(0, parsed));
                            setNewSupplierForm((prev) => ({
                              ...prev,
                              rating: clamped.toFixed(1),
                            }));
                            if (formErrors.rating) {
                              setFormErrors((prev) => ({
                                ...prev,
                                rating: undefined,
                              }));
                            }
                          }}
                          placeholder="0.0"
                          title="Enter a rating between 0 and 5"
                          className={`w-full px-4 py-2.5 pr-10 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input ${
                            formErrors.rating ? "ring-1 ring-red-400/60" : ""
                          }`}
                          style={{
                            textAlign: "left",
                            direction: "ltr",
                            paddingRight: "2.75rem",
                          }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10"
                          style={{ right: "0.75rem" }}
                        >
                          <Star className="w-4 h-4 text-white/60" />
                        </div>
                      </div>
                        {formErrors.rating && (
                          <p className="mt-2 text-xs text-red-300">
                            {formErrors.rating}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Category
                      </label>
                      <CustomSelect
                        value={newSupplierForm.category}
                        onChange={(value) => {
                          setNewSupplierForm({
                            ...newSupplierForm,
                            category: value as string,
                          });
                          if (formErrors.category) {
                            setFormErrors((prev) => ({
                              ...prev,
                              category: undefined,
                            }));
                          }
                        }}
                        options={supplierCategoryOptions}
                        placeholder="Select category"
                        className="w-full"
                        error={Boolean(formErrors.category)}
                        searchable
                        searchPlaceholder="Search category..."
                      />
                      {formErrors.category && (
                        <p className="mt-2 text-xs text-red-300">
                          {formErrors.category}
                        </p>
                      )}
                      <div className="mt-5">
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Status
                        </label>
                        <CustomSelect
                          value={newSupplierForm.status}
                          onChange={(value) =>
                            setNewSupplierForm({
                              ...newSupplierForm,
                              status: value as Supplier["status"],
                            })
                          }
                          options={[
                            { value: "active", label: "Active" },
                            { value: "inactive", label: "Inactive" },
                          ]}
                          placeholder="Select status"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className="grid gap-5"
                    style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Orders
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={newSupplierForm.totalOrders}
                        onChange={(e) => handleTotalOrdersChange(e.target.value)}
                        placeholder="0"
                        className={`w-full px-4 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input ${
                          formErrors.totalOrders ? "ring-1 ring-red-400/60" : ""
                        }`}
                      />
                      {formErrors.totalOrders && (
                        <p className="mt-2 text-xs text-red-300">
                          {formErrors.totalOrders}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Total Spent
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={newSupplierForm.totalSpent}
                          onChange={(e) => handleTotalSpentChange(e.target.value)}
                          placeholder="0.00"
                          className={`w-full pl-4 pr-10 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input ${
                            formErrors.totalSpent ? "ring-1 ring-red-400/60" : ""
                          }`}
                          style={{
                            textAlign: "left",
                            direction: "ltr",
                            paddingRight: "2.75rem",
                          }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10"
                          style={{ right: "0.75rem" }}
                        >
                          <DollarSign className="w-4 h-4 text-white/60" strokeWidth={2.5} />
                        </div>
                      </div>
                      {formErrors.totalSpent && (
                        <p className="mt-2 text-xs text-red-300">
                          {formErrors.totalSpent}
                        </p>
                      )}
                    </div>
                    <div aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                <button
                  onClick={handleCloseNewSupplierModal}
                  className="px-4 py-2 text-white/60 hover:text-white transition rounded-lg hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitNewSupplier}
                  className="px-4 py-2 rounded-lg font-medium transition text-white"
                  style={{
                    background: "rgba(59, 130, 246, 0.2)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(59, 130, 246, 0.35)",
                    boxShadow:
                      "0 4px 12px 0 rgba(59, 130, 246, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(59, 130, 246, 0.3)";
                    e.currentTarget.style.borderColor =
                      "rgba(59, 130, 246, 0.45)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px 0 rgba(59, 130, 246, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(59, 130, 246, 0.2)";
                    e.currentTarget.style.borderColor =
                      "rgba(59, 130, 246, 0.35)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px 0 rgba(59, 130, 246, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Add Supplier
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Edit Supplier Modal */}
      {isEditSupplierModalOpen &&
        supplierToEdit &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
            style={{ zIndex: 2000000 }}
            onClick={handleCloseEditSupplierModal}
          >
            <div
              className="rounded-2xl w-full max-w-5xl overflow-hidden flex flex-col animate-fadeIn max-h-[calc(100vh-160px)] min-h-0"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(24px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow:
                  "0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 2px 8px 0 rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                zIndex: 2000001,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-blue-300"
                    style={{
                      background: "rgba(59, 130, 246, 0.15)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      boxShadow:
                        "0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <Pencil className="w-5 h-5 text-blue-200" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Edit Supplier
                    </h2>
                    <p className="text-sm text-white/50">{supplierToEdit.id}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseEditSupplierModal}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 min-h-0">
                <div className="space-y-6">
                  <div
                    className="grid gap-5 -mt-3"
                    style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Supplier Name
                      </label>
                      <input
                        type="text"
                        value={editSupplierForm.name}
                        onChange={(e) =>
                          setEditSupplierForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter supplier name"
                        className="w-full px-4 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        value={editSupplierForm.contact}
                        onChange={(e) =>
                          setEditSupplierForm((prev) => ({
                            ...prev,
                            contact: e.target.value,
                          }))
                        }
                        placeholder="Enter contact name"
                        className="w-full px-4 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editSupplierForm.email}
                        onChange={(e) =>
                          setEditSupplierForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="name@company.com"
                        className="w-full px-4 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input"
                      />
                    </div>
                  </div>

                  <div
                    className="grid gap-5"
                    style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Phone
                      </label>
                      <div className="glass-input flex items-center w-full rounded-lg">
                        <div className="border-r border-white/20">
                          <CustomSelect
                            value={editSupplierForm.phoneCountry}
                            onChange={(value) =>
                              setEditSupplierForm((prev) => ({
                                ...prev,
                                phoneCountry: value as string,
                              }))
                            }
                            options={phoneCountryOptions}
                            placeholder="Country"
                            className="w-auto"
                            searchable
                            searchPlaceholder="Search country..."
                            variant="plain"
                          />
                        </div>
                        <input
                          type="tel"
                          inputMode="tel"
                          value={editSupplierForm.phoneNumber}
                          onChange={(e) =>
                            setEditSupplierForm((prev) => ({
                              ...prev,
                              phoneNumber: e.target.value,
                            }))
                          }
                          placeholder="Phone number"
                          className="flex-1 px-3 py-2.5 text-sm text-white bg-transparent placeholder-white/50 focus:outline-none"
                        />
                      </div>
                      <div className="mt-5">
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Lead Time (days)
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={editSupplierForm.leadTimeDays}
                          onChange={(e) =>
                            setEditSupplierForm((prev) => ({
                              ...prev,
                              leadTimeDays: e.target.value,
                            }))
                          }
                          placeholder="Enter lead time"
                          className="w-full px-4 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Location
                      </label>
                      <div className="glass-input flex items-center w-full rounded-lg">
                        <div className="w-full px-2">
                          <CustomSelect
                            value={editSupplierForm.location}
                            onChange={(value) =>
                              setEditSupplierForm((prev) => ({
                                ...prev,
                                location: value as string,
                              }))
                            }
                            options={locationData.options}
                            placeholder="Select location"
                            className="w-full"
                            searchable
                            searchPlaceholder="Search city..."
                            searchValue={locationSearch}
                            onSearchChange={setLocationSearch}
                            disableInternalFilter
                            virtualized
                            itemSize={44}
                            listPadding="0.9rem"
                            optionPadding="0.6rem 0.75rem"
                            optionInset="0.4rem"
                            dropdownDirection="ltr"
                            variant="plain"
                            emptyMessage={
                              isLocationLoading
                                ? "Loading cities..."
                                : locationSearch.trim().length === 0
                                  ? "Type city name to search"
                                  : "No cities found"
                            }
                          />
                        </div>
                      </div>
                      <div className="mt-5">
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Rating (0-5)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={editSupplierForm.rating}
                            onChange={(e) =>
                              setEditSupplierForm((prev) => ({
                                ...prev,
                                rating: e.target.value,
                              }))
                            }
                            placeholder="0.0"
                            className="w-full px-4 py-2.5 pr-10 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input"
                            style={{
                              textAlign: "left",
                              direction: "ltr",
                              paddingRight: "2.75rem",
                            }}
                          />
                          <div
                            className="absolute top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10"
                            style={{ right: "0.75rem" }}
                          >
                            <Star className="w-4 h-4 text-white/60" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Category
                      </label>
                      <CustomSelect
                        value={editSupplierForm.category}
                        onChange={(value) =>
                          setEditSupplierForm((prev) => ({
                            ...prev,
                            category: value as string,
                          }))
                        }
                        options={supplierCategoryOptions}
                        placeholder="Select category"
                        className="w-full"
                        searchable
                        searchPlaceholder="Search category..."
                      />
                      <div className="mt-5">
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Status
                        </label>
                        <CustomSelect
                          value={editSupplierForm.status}
                          onChange={(value) =>
                            setEditSupplierForm((prev) => ({
                              ...prev,
                              status: value as Supplier["status"],
                            }))
                          }
                          options={[
                            { value: "active", label: "Active" },
                            { value: "inactive", label: "Inactive" },
                          ]}
                          placeholder="Select status"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className="grid gap-5"
                    style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Orders
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={editSupplierForm.totalOrders}
                        onChange={(e) =>
                          setEditSupplierForm((prev) => ({
                            ...prev,
                            totalOrders: e.target.value,
                          }))
                        }
                        placeholder="0"
                        className="w-full px-4 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Total Spent
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={editSupplierForm.totalSpent}
                          onChange={(e) =>
                            setEditSupplierForm((prev) => ({
                              ...prev,
                              totalSpent: e.target.value,
                            }))
                          }
                          placeholder="0.00"
                          className="w-full pl-4 pr-10 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input"
                          style={{
                            textAlign: "left",
                            direction: "ltr",
                            paddingRight: "2.75rem",
                          }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10"
                          style={{ right: "0.75rem" }}
                        >
                          <DollarSign className="w-4 h-4 text-white/60" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                    <div aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                <button
                  onClick={handleCloseEditSupplierModal}
                  className="px-4 py-2 text-white/60 hover:text-white transition rounded-lg hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitEditSupplier}
                  className="px-4 py-2 rounded-lg font-medium transition text-white"
                  style={{
                    background: "rgba(59, 130, 246, 0.2)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(59, 130, 246, 0.35)",
                    boxShadow:
                      "0 4px 12px 0 rgba(59, 130, 246, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(59, 130, 246, 0.3)";
                    e.currentTarget.style.borderColor =
                      "rgba(59, 130, 246, 0.45)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px 0 rgba(59, 130, 246, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(59, 130, 246, 0.2)";
                    e.currentTarget.style.borderColor =
                      "rgba(59, 130, 246, 0.35)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px 0 rgba(59, 130, 246, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Download Supplier Modal */}
      {isDownloadSupplierModalOpen &&
        supplierToDownload &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99998] p-4"
            onClick={handleCloseDownloadSupplierModal}
          >
            <div
              className="rounded-2xl w-full max-w-md overflow-hidden flex flex-col animate-fadeIn"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(24px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow:
                  "0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 2px 8px 0 rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-blue-300"
                    style={{
                      background: "rgba(59, 130, 246, 0.15)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      boxShadow:
                        "0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <Download className="w-5 h-5 text-blue-200" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Download Supplier</h2>
                    <p className="text-sm text-white/50">{supplierToDownload.id}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseDownloadSupplierModal}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold tracking-wide text-white/60 mb-4 text-center">
                  Select a file type
                </p>
                <div className="p-0">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleConfirmDownloadSupplier("excel")}
                      className="w-full px-3 py-3 text-white/90 hover:text-white transition flex flex-col items-center gap-2 glass-content-inner rounded-xl border border-white/10 hover:bg-white/15"
                      title="Download Excel"
                      aria-label="Download Excel"
                    >
                      <span className="relative w-7 h-7 text-white/80">
                        <FileSpreadsheet className="w-6 h-6" />
                      </span>
                      <span className="text-xs font-semibold tracking-wide">EXCEL</span>
                    </button>
                    <button
                      onClick={() => handleConfirmDownloadSupplier("pdf")}
                      className="w-full px-3 py-3 text-white/90 hover:text-white transition flex flex-col items-center gap-2 glass-content-inner rounded-xl border border-white/10 hover:bg-white/15"
                      title="Download PDF"
                      aria-label="Download PDF"
                    >
                      <span className="relative w-7 h-7 text-white/80">
                        <FileText className="w-6 h-6" />
                      </span>
                      <span className="text-xs font-semibold tracking-wide">PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Toast Notifications */}
      <div
        className="fixed right-2 sm:right-4 top-4 flex flex-col gap-3 max-w-[calc(100vw-1rem)] sm:max-w-none"
        style={{ zIndex: 3000000 }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={`w-full sm:w-80 p-4 rounded-lg shadow-2xl flex items-center gap-3 border transition-all duration-300 glass-stat-card ${
              t.type === "success"
                ? "bg-green-500/20 border-green-400/30 text-green-300"
                : t.type === "error"
                  ? "bg-red-500/20 border-red-400/30 text-red-300"
                  : "bg-blue-500/20 border-blue-400/30 text-blue-300"
            }`}
            style={{ zIndex: 100001 }}
          >
            {t.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : t.type === "error" ? (
              <XCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <Zap className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{t.text}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex items-center gap-3">
                <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Suppliers
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                    Manage vendor relationships, contracts, and performance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-400/30">
              <Truck className="w-6 h-6 text-blue-300" />
            </div>
            <span className="text-sm text-green-300 font-medium">+3</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Total Suppliers</p>
          <p className="text-white text-2xl">{totalSuppliers}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-400/30">
              <Package className="w-6 h-6 text-green-300" />
            </div>
            <span className="text-sm text-green-300 font-medium">+12%</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Total Orders</p>
          <p className="text-white text-2xl">
            {totalOrders.toLocaleString()}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-400/30">
              <DollarSign className="w-6 h-6 text-purple-300" />
            </div>
            <span className="text-sm text-green-300 font-medium">+8%</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Total Spent</p>
          <p className="text-white text-2xl">{totalSpentFormatted}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-400/30">
              <Star className="w-6 h-6 text-yellow-300" />
            </div>
            <span className="text-sm text-yellow-300 font-medium">
              {avgRating}
            </span>
          </div>
          <p className="text-white/70 text-sm mb-1">Avg. Rating</p>
          <p className="text-white text-2xl">{avgRating} / 5.0</p>
        </div>
      </div>

      {/* Suppliers Table + Profile Drawer */}
      <div className="flex gap-6">
        {/* Table container */}
        <div className="glass-container-outer rounded-xl flex-1 min-w-0">
          {/* Table Header Actions */}
          <div className="p-6 border-b border-white/10">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    placeholder="Search suppliers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 glass-input text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
              </div>

              <div
                className="flex gap-3 items-center p-4 rounded-xl"
                style={{
                  background: "rgba(59, 130, 246, 0.08)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  boxShadow:
                    "0 2px 8px 0 rgba(59, 130, 246, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
                }}
              >
                <CustomSelect
                  value={filterCategory}
                  onChange={(value) => setFilterCategory(value as string)}
                  options={[
                    { value: 'all', label: 'All Categories' },
                    ...supplierCategoryOptions,
                  ]}
                  placeholder="All Categories"
                  className="w-[200px]"
                  searchable
                  searchPlaceholder="Search category..."
                />

                <button
                  onClick={handleOpenNewSupplierModal}
                  className="w-[200px] px-6 py-2.5 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all h-auto min-h-[42px]"
                  style={{
                    background: "rgba(59, 130, 246, 0.15)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    boxShadow:
                      "0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(59, 130, 246, 0.25)";
                    e.currentTarget.style.borderColor =
                      "rgba(59, 130, 246, 0.4)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px 0 rgba(59, 130, 246, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(59, 130, 246, 0.15)";
                    e.currentTarget.style.borderColor =
                      "rgba(59, 130, 246, 0.3)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)";
                    e.currentTarget.style.transform = "";
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Supplier
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-40" />
                <col className="w-64" />
                <col className="w-36" />
                <col className="w-28" />
                <col className="w-32" />
                <col className="w-40" />
                <col className="w-32" />
                <col className="w-24" />
                <col className="w-36" />
              </colgroup>
              <thead className="glass-table-header">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider whitespace-nowrap">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider whitespace-nowrap">
                    Contact & Info
                  </th>
                  <th className="px-2 py-3 text-left text-xs text-white/70 uppercase tracking-wider whitespace-nowrap">
                    Category
                  </th>
                  <th className="px-4 py-3 text-center text-xs text-white/70 uppercase tracking-wider whitespace-nowrap">
                    Orders
                  </th>
                  <th className="px-4 py-3 text-center text-xs text-white/70 uppercase tracking-wider whitespace-nowrap">
                    Lead Time (days)
                  </th>
                  <th className="px-4 py-3 text-center text-xs text-white/70 uppercase tracking-wider whitespace-nowrap">
                    Total Spent
                  </th>
                  <th className="px-4 py-3 text-center text-xs text-white/70 uppercase tracking-wider whitespace-nowrap">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {paginatedSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="glass-table-row hover:bg-white/5 transition duration-150 cursor-pointer"
                    onClick={() => {
                      setSelectedSupplierId(supplier.id);
                      setActiveTab("overview");
                    }}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">
                          {supplier.name}
                        </p>
                        <p className="text-sm text-white/60">
                          {supplier.id}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-white font-medium text-sm mb-1">
                          {supplier.contact}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Mail className="w-4 h-4 text-white/60" />
                          {supplier.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Phone className="w-4 h-4 text-white/60" />
                          {supplier.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <MapPin className="w-4 h-4 text-white/60" />
                          {supplier.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-400/30 backdrop-blur-sm whitespace-nowrap">
                        {supplier.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-white text-center">
                      {supplier.totalOrders}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-white text-center">
                      {supplier.leadTimeDays}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-green-400 font-semibold text-center">
                      {supplier.totalSpent}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                        <span className="text-white font-medium">
                          {supplier.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${getStatusColor(
                          supplier.status,
                        )} uppercase backdrop-blur-sm font-medium`}
                      >
                        {supplier.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleEditSupplier(supplier.id);
                          }}
                          className="p-2 text-white/70 hover:text-white hover:bg-blue-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-400/30 group"
                          title="Edit supplier"
                          style={{
                            background: "rgba(255, 255, 255, 0.05)",
                            backdropFilter: "blur(8px)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(59, 130, 246, 0.2)";
                            e.currentTarget.style.borderColor =
                              "rgba(59, 130, 246, 0.3)";
                            e.currentTarget.style.boxShadow =
                              "0 2px 8px rgba(59, 130, 246, 0.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255, 255, 255, 0.05)";
                            e.currentTarget.style.borderColor = "transparent";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDownloadSupplier(supplier.id);
                          }}
                          className="p-2 text-white/70 hover:text-white hover:bg-blue-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-400/30 group"
                          title="Download supplier"
                          style={{
                            background: "rgba(255, 255, 255, 0.05)",
                            backdropFilter: "blur(8px)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(59, 130, 246, 0.2)";
                            e.currentTarget.style.borderColor =
                              "rgba(59, 130, 246, 0.3)";
                            e.currentTarget.style.boxShadow =
                              "0 2px 8px rgba(59, 130, 246, 0.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255, 255, 255, 0.05)";
                            e.currentTarget.style.borderColor = "transparent";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteSupplier(supplier.id);
                          }}
                          className="p-2 text-white/70 hover:text-white hover:bg-red-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-red-400/30 group"
                          title="Delete supplier"
                          style={{
                            background: "rgba(255, 255, 255, 0.05)",
                            backdropFilter: "blur(8px)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(239, 68, 68, 0.2)";
                            e.currentTarget.style.borderColor =
                              "rgba(248, 113, 113, 0.3)";
                            e.currentTarget.style.boxShadow =
                              "0 2px 8px rgba(239, 68, 68, 0.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255, 255, 255, 0.05)";
                            e.currentTarget.style.borderColor = "transparent";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-sm text-white/70">
              Showing{" "}
              <span className="text-white font-medium">
                {filteredSuppliers.length === 0 ? 0 : startIndex + 1}
              </span>
              -{" "}
              <span className="text-white font-medium">
                {Math.min(endIndex, filteredSuppliers.length)}
              </span>{" "}
              of{" "}
              <span className="text-white font-medium">
                {filteredSuppliers.length}
              </span>{" "}
              suppliers
            </p>
            <div className="flex gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium select-none relative ${
                  currentPage === 1
                    ? "glass-content-inner text-white/40 cursor-not-allowed opacity-60"
                    : "glass-content-inner text-white/90 cursor-pointer"
                }`}
                style={
                  currentPage !== 1
                    ? {
                        ...paginationButtonStyle.base,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.5)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3)";
                    e.currentTarget.style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.background = "";
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "";
                    e.currentTarget.style.color = "";
                  }
                }}
                onMouseDown={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.transform = "translateY(1px)";
                  }
                }}
                onMouseUp={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
              >
                Previous
              </button>
              {pageNumbers.map((pageNum, index) => {
                if (pageNum === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-4 py-2 text-white/60 select-none"
                    >
                      ...
                    </span>
                  );
                }

                const pageNumber = pageNum as number;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className="px-4 py-2 rounded-lg font-medium cursor-pointer select-none relative min-w-[40px] text-base"
                    style={{
                      ...paginationButtonStyle.base,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      ...(currentPage === pageNumber
                        ? {
                            background: "rgba(59, 130, 246, 0.25)",
                            border: "1px solid rgba(59, 130, 246, 0.5)",
                            color: "white",
                            boxShadow:
                              "0 6px 20px rgba(59, 130, 246, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
                          }
                        : {
                            background: "rgba(255, 255, 255, 0.15)",
                            border: "1px solid rgba(255, 255, 255, 0.25)",
                            color: "rgba(255, 255, 255, 0.9)",
                            boxShadow:
                              "0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.15)",
                          }),
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        currentPage === pageNumber
                          ? "rgba(59, 130, 246, 0.35)"
                          : "rgba(255, 255, 255, 0.3)";
                      e.currentTarget.style.borderColor =
                        currentPage === pageNumber
                          ? "rgba(59, 130, 246, 0.6)"
                          : "rgba(255, 255, 255, 0.5)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow =
                        currentPage === pageNumber
                          ? "0 8px 24px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3)"
                          : "0 8px 24px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3)";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        currentPage === pageNumber
                          ? "rgba(59, 130, 246, 0.25)"
                          : "rgba(255, 255, 255, 0.15)";
                      e.currentTarget.style.borderColor =
                        currentPage === pageNumber
                          ? "rgba(59, 130, 246, 0.5)"
                          : "rgba(255, 255, 255, 0.25)";
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow =
                        currentPage === pageNumber
                          ? "0 6px 20px rgba(59, 130, 246, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)"
                          : "0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.15)";
                      e.currentTarget.style.color =
                        currentPage === pageNumber
                          ? "white"
                          : "rgba(255, 255, 255, 0.9)";
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = "translateY(1px)";
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-4 py-2 rounded-lg font-medium select-none relative ${
                  currentPage === totalPages || totalPages === 0
                    ? "glass-content-inner text-white/40 cursor-not-allowed opacity-60"
                    : "glass-content-inner text-white/90 cursor-pointer"
                }`}
                style={
                  currentPage !== totalPages && totalPages !== 0
                    ? {
                        ...paginationButtonStyle.base,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages && totalPages !== 0) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.5)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3)";
                    e.currentTarget.style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== totalPages && totalPages !== 0) {
                    e.currentTarget.style.background = "";
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "";
                    e.currentTarget.style.color = "";
                  }
                }}
                onMouseDown={(e) => {
                  if (currentPage !== totalPages && totalPages !== 0) {
                    e.currentTarget.style.transform = "translateY(1px)";
                  }
                }}
                onMouseUp={(e) => {
                  if (currentPage !== totalPages && totalPages !== 0) {
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Supplier profile drawer (desktop) */}
        <div
          className={`hidden md:block transition-all duration-300 w-full lg:w-[360px] xl:w-[400px] ${
            selectedSupplier
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-4 pointer-events-none"
          }`}
        >
          {selectedSupplier && (
            <div className="glass-card rounded-2xl h-full flex flex-col">
              <div className="p-5 border-b border-white/10 flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded-lg flex items-center justify-center border border-white/20">
                  <Truck className="w-6 h-6 text-blue-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">
                    {selectedSupplier.name}
                  </p>
                  <p className="text-xs text-white/70 truncate">
                    {selectedSupplier.id}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white/80">
                      {selectedSupplier.category}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full border ${getStatusColor(
                        selectedSupplier.status,
                      )}`}
                    >
                      {selectedSupplier.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-4 pt-3 border-b border-white/10">
                <div className="flex gap-2 text-xs">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "pricing", label: "Pricing Lists" },
                    { id: "performance", label: "Performance" },
                    { id: "links", label: "Links" },
                  ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as SupplierTab)}
                        className={`flex-1 px-2 py-2 rounded-lg ${
                          isActive
                            ? "glass-content-inner text-white"
                            : "text-white/70 hover:bg-white/10"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-sm">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <div className="glass-content-inner rounded-xl p-4">
                      <p className="text-xs font-medium text-white/70 mb-2">
                        Contact
                      </p>
                      <div className="space-y-2 text-xs text-white/80">
                        <p className="font-medium">{selectedSupplier.contact}</p>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-white/60" />
                          {selectedSupplier.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-white/60" />
                          {selectedSupplier.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-white/60" />
                          {selectedSupplier.location}
                        </div>
                      </div>
                    </div>

                    <div className="glass-content-inner rounded-xl p-4">
                      <p className="text-xs font-medium text-white/70 mb-2">
                        Relationship Snapshot
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-xs text-white/80">
                        <div>
                          <p className="text-white/60">Total Orders</p>
                          <p className="text-white text-base">
                            {selectedSupplier.totalOrders}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60">Total Spent</p>
                          <p className="text-green-300 text-base">
                            {selectedSupplier.totalSpent}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60">Lead Time (avg)</p>
                          <p className="text-white text-base">
                            {selectedSupplier.leadTimeDays} days
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60">Rating</p>
                          <p className="text-yellow-200 text-base flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                            {selectedSupplier.rating}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "pricing" && (
                  <div className="space-y-3 text-xs text-white/80">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-white/70">
                        Pricing Lists (sample data)
                      </p>
                      <button className="text-[11px] text-blue-200 hover:text-white">
                        Manage lists
                      </button>
                    </div>
                    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
                      <div className="grid grid-cols-[1.5fr,1.1fr,0.9fr,0.7fr,0.9fr] px-3 py-2 border-b border-white/10 text-[11px] font-medium text-white/70">
                        <span>Product</span>
                        <span>SKU</span>
                        <span className="text-right">Base Cost</span>
                        <span className="text-right">Discount</span>
                        <span className="text-right">Valid Until</span>
                      </div>
                      <div className="divide-y divide-white/10">
                        {mockPricingList.map((row) => (
                          <div
                            key={row.id}
                            className="grid grid-cols-[1.5fr,1.1fr,0.9fr,0.7fr,0.9fr] px-3 py-2 items-center"
                          >
                            <span className="truncate">{row.product}</span>
                            <span className="truncate text-white/80">
                              {row.sku}
                            </span>
                            <span className="text-right">{row.baseCost}</span>
                            <span className="text-right text-emerald-200">
                              {row.discount}
                            </span>
                            <span className="text-right text-white/70">
                              {row.validUntil}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "performance" && (
                  <div className="space-y-4 text-xs text-white/80">
                    <div className="glass-content-inner rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-white/70">
                          Performance Score (mock)
                        </p>
                        <BarChart3 className="w-4 h-4 text-white/70" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-white/60">On-time Delivery</p>
                          <p className="text-emerald-200 text-base">94%</p>
                        </div>
                        <div>
                          <p className="text-white/60">Lead Time</p>
                          <p className="text-white text-base">
                            {selectedSupplier.leadTimeDays} days
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60">Quality Issues</p>
                          <p className="text-emerald-200 text-base">Low</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "links" && (
                  <div className="space-y-4 text-xs text-white/80">
                    <div className="glass-content-inner rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-white/70">
                          Recent Purchase Orders
                        </p>
                        <button className="text-[11px] text-blue-200 hover:text-white">
                          View all POs
                        </button>
                      </div>
                      <div className="space-y-2">
                        {mockSupplierPOs.map((po) => (
                          <div
                            key={po.id}
                            className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-3 py-2"
                          >
                            <div>
                              <p className="text-white">{po.id}</p>
                              <p className="text-[11px] text-white/60">
                                {po.date}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-green-300">{po.amount}</p>
                              <p className="text-[11px] text-emerald-200">
                                {po.status}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-content-inner rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-white/70">
                          Supplier Invoices
                        </p>
                        <button className="text-[11px] text-blue-200 hover:text-white">
                          View all invoices
                        </button>
                      </div>
                      <div className="space-y-2">
                        {mockSupplierInvoices.map((inv) => (
                          <div
                            key={inv.id}
                            className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-3 py-2"
                          >
                            <div>
                              <p className="text-white">{inv.id}</p>
                              <p className="text-[11px] text-white/60">
                                {inv.date}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-green-300">{inv.amount}</p>
                              <p
                                className={`text-[11px] ${
                                  inv.status === "Paid"
                                    ? "text-emerald-200"
                                    : "text-yellow-200"
                                }`}
                              >
                                {inv.status}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 px-4 py-3 flex items-center justify-end">
                <button
                  onClick={() => setSelectedSupplierId(null)}
                  className="px-4 py-2 glass-content-inner text-xs text-white/80 rounded-lg hover:bg-white/15 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}