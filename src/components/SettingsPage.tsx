import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  User,
  Lock,
  Upload,
  Loader2,
  XCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
  Globe,
  Shield,
  Smartphone,
  Monitor,
  LogOut,
  Laptop,
  Fingerprint,
  History,
  Key,
  ClipboardList,
  Languages,
  MapPin,
  Building2,
  Calendar,
  Settings,
  Trash2,
  Download,
  AlertTriangle,
  Database,
} from "lucide-react";
import { CustomSelect } from "./ui/CustomSelect";
import { DateInput } from "./ui/DateInput";
import { toast } from 'sonner';

/* -------------------------------------------------------- */
/*                           TYPES                         */
/* -------------------------------------------------------- */

const LOCAL_KEY = "erp_settings_v3";

type TabId = "profile" | "security" | "access" | "notifications" | "audit" | "privacy";

interface SettingsState {
  fullName: string;
  emailAddress: string;
  jobTitle: string;
  department: string;
  dateOfEmployment: string;
  notificationsEnabled: boolean;
  billingNotificationsEnabled: boolean;
  billingEmail: string;
  language: string;
  country: string;
  apiKey: string;
  mfaEnabled: boolean;
  avatarUrl: string | null;
}

// Mock Data
const MOCK_ROLE = {
  name: "Senior Administrator",
  department: "IT Operations",
  permissions: ["users.create", "users.edit", "reports.view", "settings.manage", "api.keys.manage", "billing.view"]
};

const MOCK_SESSIONS = [
  { id: 1, device: "Chrome on Windows", location: "Riyadh, SA", ip: "192.168.1.1", lastActive: "Now", current: true },
  { id: 2, device: "Safari on iPhone 14", location: "Jeddah, SA", ip: "10.0.0.45", lastActive: "2 hours ago", current: false },
  { id: 3, device: "Firefox on MacOS", location: "Dubai, AE", ip: "172.16.0.22", lastActive: "1 day ago", current: false },
];

const MOCK_LOGIN_HISTORY = [
  { date: "2023-10-25 09:30 AM", ip: "192.168.1.1", status: "Success", method: "Password" },
  { date: "2023-10-24 08:15 PM", ip: "10.0.0.45", status: "Success", method: "2FA" },
  { date: "2023-10-24 08:10 PM", ip: "10.0.0.45", status: "Failed", method: "Password" },
];

// Language options for CustomSelect
const LANGUAGE_OPTIONS = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'ar-SA', label: 'العربية (السعودية)' },
  { value: 'ar-AE', label: 'العربية (الإمارات)' },
  { value: 'ar-EG', label: 'العربية (مصر)' },
  { value: 'fr-FR', label: 'Français (France)' },
  { value: 'fr-CA', label: 'Français (Canada)' },
  { value: 'de-DE', label: 'Deutsch (Deutschland)' },
  { value: 'es-ES', label: 'Español (España)' },
  { value: 'es-MX', label: 'Español (México)' },
  { value: 'it-IT', label: 'Italiano (Italia)' },
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'pt-PT', label: 'Português (Portugal)' },
  { value: 'ru-RU', label: 'Русский (Россия)' },
  { value: 'zh-CN', label: '中文 (简体)' },
  { value: 'zh-TW', label: '中文 (繁體)' },
  { value: 'ja-JP', label: '日本語 (日本)' },
  { value: 'ko-KR', label: '한국어 (한국)' },
  { value: 'hi-IN', label: 'हिन्दी (भारत)' },
  { value: 'tr-TR', label: 'Türkçe (Türkiye)' },
  { value: 'nl-NL', label: 'Nederlands (Nederland)' },
  { value: 'pl-PL', label: 'Polski (Polska)' },
  { value: 'sv-SE', label: 'Svenska (Sverige)' },
  { value: 'no-NO', label: 'Norsk (Norge)' },
  { value: 'da-DK', label: 'Dansk (Danmark)' },
  { value: 'fi-FI', label: 'Suomi (Suomi)' },
];

// Country options for CustomSelect
const COUNTRY_OPTIONS = [
  { value: 'USA', label: 'United States' },
  { value: 'GBR', label: 'United Kingdom' },
  { value: 'SAU', label: 'Saudi Arabia' },
  { value: 'ARE', label: 'United Arab Emirates' },
  { value: 'EGY', label: 'Egypt' },
  { value: 'FRA', label: 'France' },
  { value: 'CAN', label: 'Canada' },
  { value: 'DEU', label: 'Germany' },
  { value: 'ESP', label: 'Spain' },
  { value: 'MEX', label: 'Mexico' },
  { value: 'ITA', label: 'Italy' },
  { value: 'BRA', label: 'Brazil' },
  { value: 'PRT', label: 'Portugal' },
  { value: 'RUS', label: 'Russia' },
  { value: 'CHN', label: 'China' },
  { value: 'TWN', label: 'Taiwan' },
  { value: 'JPN', label: 'Japan' },
  { value: 'KOR', label: 'South Korea' },
  { value: 'IND', label: 'India' },
  { value: 'TUR', label: 'Turkey' },
  { value: 'NLD', label: 'Netherlands' },
  { value: 'POL', label: 'Poland' },
  { value: 'SWE', label: 'Sweden' },
  { value: 'NOR', label: 'Norway' },
  { value: 'DNK', label: 'Denmark' },
  { value: 'FIN', label: 'Finland' },
  { value: 'AUS', label: 'Australia' },
  { value: 'NZL', label: 'New Zealand' },
  { value: 'SGP', label: 'Singapore' },
  { value: 'MYS', label: 'Malaysia' },
  { value: 'IDN', label: 'Indonesia' },
  { value: 'THA', label: 'Thailand' },
  { value: 'VNM', label: 'Vietnam' },
  { value: 'PHL', label: 'Philippines' },
  { value: 'ZAF', label: 'South Africa' },
  { value: 'ARG', label: 'Argentina' },
  { value: 'CHL', label: 'Chile' },
  { value: 'COL', label: 'Colombia' },
  { value: 'PER', label: 'Peru' },
  { value: 'VEN', label: 'Venezuela' },
  { value: 'BEL', label: 'Belgium' },
  { value: 'CHE', label: 'Switzerland' },
  { value: 'AUT', label: 'Austria' },
  { value: 'IRL', label: 'Ireland' },
  { value: 'ISR', label: 'Israel' },
  { value: 'GRC', label: 'Greece' },
  { value: 'CZE', label: 'Czech Republic' },
  { value: 'HUN', label: 'Hungary' },
  { value: 'ROU', label: 'Romania' },
];

const MOCK_AUDIT_LOG = [
  { id: 1, action: "Role updated to Senior Admin", actor: "System", at: "2024-10-25 09:30", ip: "192.168.1.1", status: "success" },
  { id: 2, action: "Password changed", actor: "You", at: "2024-10-24 21:15", ip: "10.0.0.45", status: "success" },
  { id: 3, action: "Failed login (wrong password)", actor: "Unknown", at: "2024-10-24 20:10", ip: "10.0.0.45", status: "error" },
  { id: 4, action: "2FA disabled", actor: "You", at: "2024-10-23 18:02", ip: "172.16.0.22", status: "error" },
  { id: 5, action: "API key regenerated", actor: "You", at: "2024-10-22 11:47", ip: "192.168.1.1", status: "success" },
  { id: 6, action: "Billing email updated", actor: "You", at: "2024-10-21 09:18", ip: "192.168.1.1", status: "success" },
];

const DEFAULT_SETTINGS: SettingsState = {
  fullName: "Rami Saab",
  emailAddress: "rami.saab2@gmail.com",
  jobTitle: "",
  department: "",
  dateOfEmployment: "",
  notificationsEnabled: true,
  billingNotificationsEnabled: true,
  billingEmail: "",
  language: "en-GB",
  country: "ARE",
  apiKey: generateRandomApiKey(),
  mfaEnabled: false,
  avatarUrl: null,
};

/* -------------------------------------------------------- */
/*                           HELPERS                       */
/* -------------------------------------------------------- */

function loadFromLocal(): SettingsState {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Preserve existing avatarUrl if it exists
      return { ...DEFAULT_SETTINGS, ...parsed, avatarUrl: parsed.avatarUrl || DEFAULT_SETTINGS.avatarUrl };
    }
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveToLocal(payload: SettingsState) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(payload));
  } catch {}
}

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 10) score += 1;
  else if (pw.length >= 8) score += 0.5;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  if (score >= 4) return { score: 4, label: "Strong", color: "bg-green-500" };
  if (score >= 3) return { score: 3, label: "Good", color: "bg-blue-500" };
  if (score >= 1.5) return { score: 2, label: "Fair", color: "bg-yellow-500" };
  return { score: 1, label: "Weak", color: "bg-red-500" };
}

function generateRandomApiKey(): string {
  return "ERP-" + Array(32).fill(0).map(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random()*36)]).join("");
}

function useSettingsState() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSettings(loadFromLocal());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    setSaving(true);
    const t = setTimeout(() => {
      saveToLocal(settings);
      setSaving(false);
    }, 800);
    return () => clearTimeout(t);
  }, [settings, isLoaded]);

  const updateSettings = useCallback(<K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  return { settings, updateSettings, saving };
}

/* -------------------------------------------------------- */
/*                         MAIN COMPONENT                   */
/* -------------------------------------------------------- */

export function SettingsPage(): React.ReactElement {
  const [tab, setTab] = useState<TabId>("profile");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwVisible, setPwVisible] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [auditFilter, setAuditFilter] = useState<"all" | "success" | "error">("all");
  const fileRef = useRef<HTMLInputElement | null>(null);
  
  const { settings, updateSettings, saving } = useSettingsState();
  const [sessions, setSessions] = useState(MOCK_SESSIONS);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [visibleEvents, setVisibleEvents] = useState<Set<number>>(new Set());
  
  // Intersection Observer for scroll animations
  useEffect(() => {
    if (tab !== "audit") return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const eventId = parseInt(entry.target.getAttribute('data-event-id') || '0');
            setVisibleEvents((prev) => new Set([...prev, eventId]));
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    // Use setTimeout to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const eventElements = document.querySelectorAll('[data-event-id]');
      eventElements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      const eventElements = document.querySelectorAll('[data-event-id]');
      eventElements.forEach((el) => observer.unobserve(el));
    };
  }, [tab]);
  

  // Sync avatar preview with saved avatar - preserve existing if available
  useEffect(() => {
    // Only set preview if settings has an avatarUrl, otherwise keep existing preview
    if (settings.avatarUrl) {
      setAvatarPreview(settings.avatarUrl);
    } else if (!avatarPreview) {
      // Only clear if there's no existing preview
      setAvatarPreview(null);
    }
  }, [settings.avatarUrl]);

  // Prevent "sticker" from appearing in password fields (from autofill or other sources)
  useEffect(() => {
    if (newPassword === "sticker") {
      setNewPassword("");
    }
    if (confirmPassword === "sticker") {
      setConfirmPassword("");
    }
  }, [newPassword, confirmPassword]);

  // Handlers
  const handleCopy = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  }, []);

  const handleRevokeSession = useCallback((id: number) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    toast.info("Signed out from device");
  }, []);

  const handleRevokeAllSessions = useCallback(() => {
    setLoadingAction(true);
    setTimeout(() => {
      setSessions(prev => prev.filter(s => s.current));
      setLoadingAction(false);
      toast.success("Signed out of all other devices");
    }, 600);
  }, []);

  const handleSaveProfile = useCallback(() => {
    const errors: Record<string, string> = {};
    if (!settings.fullName.trim()) errors.fullName = "Name is required";
    if (!settings.emailAddress.trim()) errors.email = "Email is required";
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setLoadingAction(true);
    setTimeout(() => { 
      setLoadingAction(false); 
      toast.success("Profile saved"); 
      window.dispatchEvent(new CustomEvent("erp-profile-updated", { detail: {
        fullName: settings.fullName,
        emailAddress: settings.emailAddress,
        jobTitle: settings.jobTitle,
        department: settings.department,
        dateOfEmployment: settings.dateOfEmployment,
        avatarUrl: settings.avatarUrl ?? null,
      }}));
    }, 600);
  }, [settings]);

  const handleUpdatePassword = useCallback(() => {
    if (newPassword.length < 8) {
      toast.error("Password is too short");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoadingAction(true);
    setTimeout(() => {
      setLoadingAction(false);
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated");
    }, 800);
  }, [newPassword, confirmPassword]);

  const handleGeneratePassword = useCallback(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let pwd = "";
    for (let i = 0; i < 16; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    setNewPassword(pwd);
    toast.success("Generated a strong password");
  }, []);

  const pwStr = useMemo(() => passwordStrength(newPassword), [newPassword]);
  const pwStrengthPercent = (pwStr.score / 4) * 100;
  const auditEvents = useMemo(
    () => MOCK_AUDIT_LOG.filter((e) => auditFilter === "all" ? true : e.status === auditFilter),
    [auditFilter],
  );
  
  // Reset visible events when filter changes and show first few immediately
  useEffect(() => {
    setVisibleEvents(new Set());
    // Show first 2-3 events immediately for better UX
    setTimeout(() => {
      const firstFewIds = auditEvents.slice(0, 3).map(e => e.id);
      setVisibleEvents(new Set(firstFewIds));
    }, 50);
  }, [auditFilter, auditEvents]);
  
  const tabList = useMemo(() => [
    { id: "profile" as TabId, label: "Profile", icon: User },
    { id: "security" as TabId, label: "Security & Access", icon: Shield },
    { id: "access" as TabId, label: "Permissions", icon: Key },
    { id: "notifications" as TabId, label: "Notifications", icon: Globe },
    { id: "audit" as TabId, label: "Audit", icon: ClipboardList },
    { id: "privacy" as TabId, label: "Data & Privacy", icon: Database },
  ], []);

  return (
    <div className="overflow-hidden">
      {/* Header Section */}
      <div className="sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div className="min-w-0 flex items-center gap-3">
              <Settings className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  System Settings
                </h2>
                <p className="text-xs sm:text-sm text-white/80 mt-0.5 hidden sm:block">
                  Manage your account preferences and security
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {saving && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-400/40 bg-blue-500/25 text-blue-300 shadow-lg shadow-blue-500/20 backdrop-blur-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-semibold whitespace-nowrap">Saving...</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Horizontal Tab Navigation */}
          <nav className="flex flex-wrap gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {tabList.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 relative ${
                  tab === item.id
                    ? "glass-sidebar-btn-active text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${
                  tab === item.id ? "scale-110 text-white" : "text-white/70"
                }`} />
                <span className="hidden xs:inline">{item.label}</span>
                <span className="xs:hidden">{item.label.split(' ')[0]}</span>
                {tab === item.id && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white/60 rounded-full"></div>
                )}
              </button>
            ))}
          </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5 pb-6 sm:pb-8 -mt-2">
        <div className="glass-card rounded-xl p-6 sm:p-8 shadow-2xl">
          <div className="space-y-6 sm:space-y-8">
            {/* PROFILE TAB */}
            {tab === "profile" && (
              <div className="space-y-6 sm:space-y-8">
                  <div className="mb-4 sm:mb-6">
                    <div className="mb-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Personal and General Settings</h3>
                      <p className="text-sm text-white/60 mt-1">Manage your personal information and preferences. Implemented by the Protection and Security Department.</p>
                    </div>
                  </div>
                  {/* First Row: Profile Picture (Left) + Regional Settings (Right) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                      {/* Avatar Card - Left */}
                      <div className="glass-card rounded-xl p-5 sm:p-6 border border-blue-400/20 bg-gradient-to-br from-blue-600/15 to-purple-600/10 hover:border-blue-400/40 hover:shadow-blue-500/20 transition-all duration-300 shadow-lg">
                        <div className="flex items-center gap-3 mb-4 sm:mb-5">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                          <div>
                            <h4 className="text-base sm:text-lg font-semibold text-white">Change Profile Picture</h4>
                            <p className="text-xs sm:text-sm text-white/60 mt-0.5">Update your profile photo</p>
                          </div>
                        </div>
                        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto rounded-full mb-4 sm:mb-5 ring-2 ring-white/30 border-2 border-white/20">
                          <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-full overflow-hidden flex items-center justify-center relative">
                            {(avatarPreview || settings.avatarUrl) ? (
                              <img 
                                src={avatarPreview || settings.avatarUrl || ''} 
                                alt="Avatar" 
                                className="w-full h-full object-cover object-center rounded-full"
                                style={{ objectFit: 'cover', objectPosition: 'center' }}
                              />
                            ) : (
                              <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-5">
                          <button 
                            onClick={() => fileRef.current?.click()}
                            className="w-full py-2 sm:py-2.5 glass-stat-card rounded-lg transition text-sm font-semibold flex items-center justify-center gap-2 border border-blue-400/40 bg-blue-500/30 hover:bg-blue-500/40 hover:border-blue-400/60 hover:shadow-blue-500/30 text-blue-300 shadow-lg"
                          >
                            <Upload className="w-4 h-4" /> Update photo
                          </button>
                          {(avatarPreview || settings.avatarUrl) && (
                            <button 
                              onClick={() => {
                                setAvatarPreview(null);
                                updateSettings("avatarUrl", null);
                                if (fileRef.current) fileRef.current.value = '';
                                window.dispatchEvent(new CustomEvent("erp-avatar-updated", { detail: null }));
                                // Also clear from localStorage
                                try {
                                  const raw = localStorage.getItem(LOCAL_KEY);
                                  if (raw) {
                                    const parsed = JSON.parse(raw);
                                    parsed.avatarUrl = null;
                                    localStorage.setItem(LOCAL_KEY, JSON.stringify(parsed));
                                  }
                                } catch {
                                  // ignore
                                }
                              }}
                              className="w-full py-2 sm:py-2.5 glass-stat-card rounded-lg transition text-sm font-semibold flex items-center justify-center gap-2 border border-red-400/40 bg-red-500/30 hover:bg-red-500/40 hover:border-red-400/60 hover:shadow-red-500/30 text-red-300 shadow-lg"
                            >
                              <XCircle className="w-4 h-4" /> Remove photo
                            </button>
                          )}
                        </div>
                        <input
                          type="file"
                          ref={fileRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            
                            // Check if we already have an avatar - preserve it unless explicitly replaced
                            const existingAvatar = settings.avatarUrl;
                            
                            const reader = new FileReader();
                            reader.onload = () => {
                              const dataUrl = reader.result as string;
                              // Only update if we have a new file
                              setAvatarPreview(dataUrl);
                              updateSettings("avatarUrl", dataUrl);
                              window.dispatchEvent(new CustomEvent("erp-avatar-updated", { detail: dataUrl }));
                            };
                            reader.onerror = () => {
                              // If read fails, restore existing avatar
                              if (existingAvatar) {
                                setAvatarPreview(existingAvatar);
                              }
                              toast.error("Failed to load image");
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </div>

                      {/* Regional Settings - Right */}
                      <div className="glass-card rounded-xl p-5 sm:p-6 border border-blue-400/20 bg-gradient-to-br from-blue-600/15 to-purple-600/10 hover:border-blue-400/40 hover:shadow-blue-500/20 transition-all duration-300 shadow-lg">
                        <div className="flex items-center gap-3 mb-4 sm:mb-5">
                          <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                          <div>
                            <h4 className="text-base sm:text-lg font-semibold text-white">Regional Settings</h4>
                            <p className="text-xs sm:text-sm text-white/60 mt-0.5">Configure your language and location preferences</p>
                          </div>
                        </div>
                        <div className="space-y-5 sm:space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                          <Languages className="w-3 h-3" />
                          Language
                        </label>
                        <CustomSelect
                          value={settings.language}
                          onChange={(value) => {
                            updateSettings("language", value as string);
                            setFieldErrors(prev => ({ ...prev, language: "" }));
                          }}
                          options={LANGUAGE_OPTIONS}
                          placeholder="Select language..."
                          searchable
                          searchPlaceholder="Search languages..."
                        />
                        {fieldErrors.language && <div className="text-xs text-red-400 mt-1">{fieldErrors.language}</div>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" />
                          Country
                        </label>
                        <CustomSelect
                          value={settings.country}
                          onChange={(value) => {
                            updateSettings("country", value as string);
                            setFieldErrors(prev => ({ ...prev, country: "" }));
                          }}
                          options={COUNTRY_OPTIONS}
                          placeholder="Select country..."
                          searchable
                          searchPlaceholder="Search countries..."
                        />
                        {fieldErrors.country && <div className="text-xs text-red-400 mt-1">{fieldErrors.country}</div>}
                      </div>
                    </div>
                      </div>
                  </div>

                  {/* Personal Info */}
                  <div className="glass-card rounded-xl p-5 sm:p-6 border border-blue-400/20 bg-gradient-to-br from-blue-600/15 to-purple-600/10 hover:border-blue-400/40 hover:shadow-blue-500/20 transition-all duration-300 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                      {/* Left Column */}
                      <div className="space-y-5 sm:space-y-6">
                        <div className="space-y-2">
                          <label className={`text-sm font-semibold uppercase tracking-wider ${
                            "text-white"
                          }`}>Full name</label>
                          <input 
                            type="text" 
                            value={settings.fullName} 
                            onChange={e => {
                              updateSettings("fullName", e.target.value);
                              setFieldErrors(prev => ({ ...prev, fullName: "" }));
                            }}
                            className="w-full px-4 py-3 glass-input text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-sm transition-all"
                            placeholder="Enter your full name"
                          />
                          {fieldErrors.fullName && <div className="text-xs text-red-400 mt-1">{fieldErrors.fullName}</div>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                            <Building2 className="w-3 h-3" />
                            Department
                          </label>
                          <input 
                            type="text" 
                            value={settings.department} 
                            onChange={e => {
                              updateSettings("department", e.target.value);
                              setFieldErrors(prev => ({ ...prev, department: "" }));
                            }}
                            className="w-full px-4 py-3 glass-input text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-sm transition-all"
                            placeholder="Enter your department"
                          />
                          {fieldErrors.department && <div className="text-xs text-red-400 mt-1">{fieldErrors.department}</div>}
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-5 sm:space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold uppercase tracking-wider text-white/70">Email</label>
                          <input 
                            type="email" 
                            value={settings.emailAddress} 
                            onChange={e => {
                              updateSettings("emailAddress", e.target.value);
                              setFieldErrors(prev => ({ ...prev, email: "" }));
                            }}
                            className="w-full px-4 py-3 glass-input text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-sm transition-all"
                            placeholder="Enter your email address"
                          />
                          {fieldErrors.email && <div className="text-xs text-red-400 mt-1">{fieldErrors.email}</div>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            Date of Employment
                          </label>
                          <DateInput
                            value={settings.dateOfEmployment}
                            onChange={(value) => {
                              updateSettings("dateOfEmployment", value);
                              setFieldErrors(prev => ({ ...prev, dateOfEmployment: "" }));
                            }}
                            placeholder="Select date"
                            error={!!fieldErrors.dateOfEmployment}
                          />
                          {fieldErrors.dateOfEmployment && <div className="text-xs text-red-400 mt-1">{fieldErrors.dateOfEmployment}</div>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button 
                    onClick={handleSaveProfile} 
                    disabled={loadingAction || saving} 
                    className="px-6 py-3 glass-stat-card rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 border border-green-400/30 bg-green-500/20 hover:bg-white/15 text-white flex items-center justify-center gap-2 text-base"
                  >
                    {(loadingAction || saving) && <Loader2 className="animate-spin w-5 h-5"/>} Save changes
                  </button>
              </div>
            )}

            {/* SECURITY TAB */}
            {tab === "security" && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1 h-6 sm:h-7 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white">Security & Access</h3>
                        <p className="text-sm text-white/60 mt-1">Manage your account security settings and authentication</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Password Management */}
                  <div className="glass-card rounded-xl p-5 sm:p-6 border border-yellow-400/20 bg-gradient-to-br from-yellow-600/15 to-orange-600/10 hover:border-yellow-400/40 hover:shadow-yellow-500/20 transition-all duration-300 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <Lock className={`w-3.5 h-3.5 text-white`} />
                      <h3 className={`text-sm font-bold text-white`}>Password</h3>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className={`text-xs font-semibold uppercase tracking-wider block ${
                          "text-white"
                        }`}>New password</label>
                        <div className="relative">
                          <input 
                            type={pwVisible ? "text" : "password"} 
                            placeholder="Enter your new password"
                            value={newPassword} 
                            onChange={e => setNewPassword(e.target.value)}
                            onPaste={(e) => {
                              const pastedText = e.clipboardData.getData('text/plain');
                              // Block "sticker" specifically if pasted
                              if (pastedText.trim() === "sticker") {
                                e.preventDefault();
                                return;
                              }
                              // Allow normal paste for everything else
                            }}
                            autoComplete="new-password"
                            autoCapitalize="off"
                            autoCorrect="off"
                            spellCheck="false"
                            name="new-password-field"
                            id="new-password-field"
                            data-lpignore="true"
                            data-form-type="other"
                            className="w-full px-4 py-2.5 pr-12 glass-input text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-sm transition-all"
                          />
                          <button 
                            onClick={() => setPwVisible(!pwVisible)} 
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 transition text-white/70 hover:text-white focus:outline-none"
                          >
                            {pwVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">Confirm password</label>
                        <div className="relative">
                          <input 
                            type={pwVisible ? "text" : "password"} 
                            placeholder="Confirm your password"
                            value={confirmPassword} 
                            onChange={e => setConfirmPassword(e.target.value)}
                            onPaste={(e) => {
                              const pastedText = e.clipboardData.getData('text/plain');
                              // Block "sticker" specifically if pasted
                              if (pastedText.trim() === "sticker") {
                                e.preventDefault();
                                return;
                              }
                              // Allow normal paste for everything else
                            }}
                            autoComplete="new-password"
                            autoCapitalize="off"
                            autoCorrect="off"
                            spellCheck="false"
                            name="confirm-password-field"
                            id="confirm-password-field"
                            data-lpignore="true"
                            data-form-type="other"
                            className="w-full px-4 py-2.5 pr-12 glass-input text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-sm transition-all"
                          />
                          <button 
                            onClick={() => setPwVisible(!pwVisible)} 
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 transition text-white/70 hover:text-white focus:outline-none"
                          >
                            {pwVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {newPassword && (
                        <div className="space-y-3">
                          <span className="text-xs text-white/70 block">Strength</span>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 rounded h-1.5 overflow-hidden bg-white/10">
                              <div
                                style={{ width: `${pwStrengthPercent}%` }}
                                className={`h-full transition-all ${
                                  pwStrengthPercent < 35 ? "bg-red-500" : pwStrengthPercent < 70 ? "bg-yellow-400" : "bg-green-400"
                                }`}
                              />
                            </div>
                            <span className={`text-xs font-semibold whitespace-nowrap ${
                              pwStrengthPercent < 35 ? "text-red-400" : pwStrengthPercent < 70 ? "text-yellow-400" : "text-green-400"
                            }`}>{pwStr.label}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleUpdatePassword}
                          className="px-3 py-1.5 glass-stat-card rounded-lg border border-blue-400/30 bg-blue-500/20 hover:bg-blue-500/30 text-white font-semibold text-xs transition-all duration-300 disabled:opacity-50"
                          disabled={loadingAction}
                        >
                          {loadingAction ? <Loader2 className="animate-spin w-3 h-3 inline mr-1" /> : null} Update
                        </button>
                        <button
                          onClick={handleGeneratePassword}
                          className="px-3 py-1.5 rounded-lg border border-white/15 text-white/80 hover:bg-white/5 flex items-center gap-2 transition glass-stat-card text-xs"
                        >
                          <RefreshCw className="w-3 h-3" /> Generate
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className={`glass-card rounded-xl p-4 sm:p-5 border transition-all duration-300 shadow-lg ${
                    settings.mfaEnabled 
                      ? "border-green-400/20 bg-gradient-to-br from-green-600/15 to-emerald-600/10 hover:border-green-400/40 hover:shadow-green-500/20"
                      : "border-red-400/20 bg-gradient-to-br from-red-600/10 to-orange-600/5 hover:border-red-400/30 hover:shadow-red-500/10"
                  }`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Smartphone className={`w-3.5 h-3.5 ${settings.mfaEnabled ? "text-green-400" : "text-red-400"}`} />
                        <div className="space-y-1">
                          <h3 className={`text-sm font-bold text-white`}>Two-factor authentication</h3>
                          <p className={`text-xs ${settings.mfaEnabled ? "text-green-300/80" : "text-red-300/80"}`}>
                            {settings.mfaEnabled ? "✓ Enabled - Your account is protected" : "✗ Disabled - Your account is vulnerable"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const newState = !settings.mfaEnabled;
                          updateSettings("mfaEnabled", newState);
                          toast.success(newState ? "2FA enabled - Your account is now protected" : "2FA disabled - Your account security has been reduced");
                        }}
                        className={`text-xs font-semibold px-3 py-1.5 rounded transition-all duration-200 cursor-pointer ${
                          settings.mfaEnabled 
                            ? "bg-green-500/20 text-green-300 border border-green-400/30 hover:bg-green-500/30" 
                            : "bg-red-500/20 text-red-300 border border-red-400/30 hover:bg-red-500/30"
                        }`}
                      >
                        {settings.mfaEnabled ? "ON" : "OFF"}
                      </button>
                    </div>
                  </div>

                  {/* API Key Management */}
                  <div className="glass-card rounded-xl p-4 sm:p-5 border border-purple-400/20 bg-gradient-to-br from-purple-600/15 to-indigo-600/10 hover:border-purple-400/40 hover:shadow-purple-500/20 transition-all duration-300 shadow-lg">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <Key className={`w-3.5 h-3.5 text-white`} />
                      <h3 className={`text-sm font-bold text-white`}>API key</h3>
                    </div>
                    <div className="flex gap-3 items-center">
                      <code className="flex-1 glass-input px-4 py-2.5 pr-2 rounded-lg font-mono text-xs tracking-wider break-all text-white">
                        {settings.apiKey}
                      </code>
                      <button 
                        title="Regenerate" 
                        onClick={() => updateSettings("apiKey", generateRandomApiKey())} 
                        className="p-2 glass-stat-card rounded-lg transition border text-white/70 hover:text-white border-white/15 focus:outline-none flex-shrink-0"
                      >
                        <RefreshCw size={14} />
                      </button>
                      <button 
                        title="Copy" 
                        onClick={() => handleCopy(settings.apiKey, "API key")} 
                        className="p-2 glass-stat-card rounded-lg transition border text-white/70 hover:text-white border-white/15 focus:outline-none flex-shrink-0"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="glass-card rounded-xl p-4 sm:p-5 border border-cyan-400/20 bg-gradient-to-br from-cyan-600/15 to-blue-600/10 hover:border-cyan-400/40 hover:shadow-cyan-500/20 transition-all duration-300 shadow-lg">
                    <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Monitor className={`w-3.5 h-3.5 text-white`} />
                        <h3 className={`text-sm font-bold text-white`}>Sessions</h3>
                        <span className={`text-xs font-semibold px-1.5 py-0.5 glass-stat-card rounded-full border ${
                          "text-white/50 border-white/15"
                        }`}>
                          {sessions.length}
                        </span>
                      </div>
                      <button 
                        onClick={handleRevokeAllSessions} 
                        disabled={loadingAction} 
                        className={`text-xs border px-2 py-1 rounded-lg font-medium transition glass-stat-card ${
                          "text-red-300 hover:text-red-400 border-red-400/30 bg-red-500/20"
                        }`}
                      >
                        {loadingAction ? <Loader2 className="animate-spin w-2.5 h-2.5 inline mr-1" /> : null} Sign out
                      </button>
                    </div>
                    <div className="space-y-3">
                      {sessions.map(session => (
                        <div key={session.id} className={`flex items-center justify-between p-3 glass-stat-card rounded-lg border transition ${
                          "border-white/15 hover:bg-white/5"
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`p-1 rounded-lg ${
                              "text-white"
                            }`}>
                              {session.device.toLowerCase().includes("mobile") || session.device.toLowerCase().includes("iphone") ? 
                                <Smartphone className={`w-3 h-3 text-white`}/> : <Laptop className={`w-3 h-3 text-white`}/>
                              }
                            </div>
                            <div className="space-y-1">
                              <div className={`text-white text-xs font-medium flex items-center gap-1.5`}>
                                {session.device} 
                                {session.current && <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-semibold border ${
                                  "bg-green-500/20 text-green-300 border-green-400/30"
                                }`}>current</span>}
                              </div>
                              <div className={`text-white/60 text-xs`}>{session.location} • {session.ip} • {session.lastActive}</div>
                            </div>
                          </div>
                          {!session.current && (
                            <button onClick={() => handleRevokeSession(session.id)} className={`p-1.5 transition ${
                              "text-white"
                            }`}>
                              <LogOut size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Login History */}
                  <div className={`glass-card rounded-xl p-4 sm:p-5 border transition-all duration-300 shadow-lg ${
                    "border-slate-400/20 bg-gradient-to-br from-slate-600/15 to-gray-600/10 hover:border-slate-400/40 hover:shadow-slate-500/20"
                  }`}>
                    <div className="flex items-center gap-2 mb-4">
                      <History className={`w-3.5 h-3.5 text-white`} />
                      <h3 className={`text-sm font-bold text-white`}>Login history</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className={`w-full text-left text-xs text-white/70`}>
                        <thead className={`uppercase rounded-lg text-xs ${
                          "text-white/50 bg-white/5"
                        }`}>
                          <tr>
                            <th className="px-3 py-2.5 rounded-l-lg">Date</th>
                            <th className="px-3 py-2.5">IP</th>
                            <th className="px-3 py-2.5">Method</th>
                            <th className="px-3 py-2.5 rounded-r-lg">Status</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${
                          "text-white"
                        }`}>
                          {MOCK_LOGIN_HISTORY.map((log, i) => (
                            <tr key={i} className={`transition ${
                              "text-white"
                            }`}>
                              <td className="px-3 py-2.5 text-xs">{log.date}</td>
                              <td className="px-3 py-2.5 font-mono text-xs">{log.ip}</td>
                              <td className="px-3 py-2.5 text-xs">{log.method}</td>
                              <td className="px-3 py-2.5">
                                <span className={`px-1.5 py-0.5 rounded text-xs font-medium glass-stat-card border ${
                                  log.status === 'Success' 
                                    ? false
                                      ? 'bg-green-100/60 text-green-700 border-green-400/40'
                                      : 'bg-green-500/20 text-green-300 border-green-400/30'
                                    : false
                                      ? 'bg-red-100/60 text-red-700 border-red-400/40'
                                      : 'bg-red-500/20 text-red-300 border-red-400/30'
                                }`}>
                                  {log.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
            )}

            {/* ACCESS TAB */}
            {tab === "access" && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="mb-4 sm:mb-6">
                    <div className="mb-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Permissions</h3>
                      <p className="text-sm text-white/60 mt-1">Manage your role and access permissions</p>
                    </div>
                  </div>
                  
                  <div className={`glass-card rounded-xl p-5 sm:p-6 border transition-all duration-300 shadow-lg ${
                    "border-blue-400/30 bg-gradient-to-br from-blue-600/20 to-cyan-600/15 hover:border-blue-400/50 hover:shadow-blue-500/30"
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-white/10 ${
                        "text-white"
                      }`}>
                        <Fingerprint className={`w-6 h-6 text-white`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold text-white`}>{MOCK_ROLE.name}</h3>
                        <p className={`text-white/70 text-sm mt-1`}>{MOCK_ROLE.department}</p>
                      </div>
                      <div className={`px-3 py-1.5 glass-stat-card border rounded-lg text-sm font-semibold bg-green-500/20 text-green-300 border-green-400/30`}>
                        RBAC
                      </div>
                    </div>
                  </div>

                  <div className={`glass-card rounded-xl p-5 sm:p-6 border transition-all duration-300 shadow-lg ${
                    "border-white/20 bg-gradient-to-br from-white/5 to-white/2 hover:border-white/30"
                  }`}>
                    <h4 className={`text-lg font-bold text-white mb-4 sm:mb-5`}>
                      Permissions
                    </h4>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {MOCK_ROLE.permissions.map(perm => (
                        <div key={perm} className={`flex items-center gap-2 px-3 py-2 glass-stat-card rounded-lg border text-sm font-medium ${
                          "border-blue-400/30 bg-blue-500/20 text-blue-300"
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full bg-blue-300`}></div>
                          {perm}
                        </div>
                      ))}
                    </div>
                    <p className={`mt-4 sm:mt-5 text-sm text-white/50 border-t border-white/10 ${
                      "text-white"
                    } pt-4`}>
                      * Managed by system administrator
                    </p>
                  </div>
                </div>
            )}


            {/* NOTIFICATIONS TAB */}
            {tab === "notifications" && (
                <div className="space-y-6 sm:space-y-8 animate-fadeIn w-full">
                  <div className="mb-4 sm:mb-6">
                    <div className="mb-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Notification settings</h3>
                      <p className="text-sm text-white/60 mt-1">Configure how and when you receive notifications</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
                    <div className={`flex items-start justify-between gap-4 p-4 sm:p-5 glass-stat-card rounded-lg border transition-all duration-200 ${
                      settings.notificationsEnabled
                        ? "border-green-400/20 bg-green-500/5"
                        : "border-red-400/20 bg-red-500/5"
                    }`}>
                      <div className="space-y-2 flex-1">
                        <div className="text-white font-semibold text-base">Email alerts</div>
                        <div className={`text-sm leading-relaxed ${settings.notificationsEnabled ? "text-green-300/80" : "text-red-300/80"}`}>
                          {settings.notificationsEnabled ? "✓ Enabled – receiving summaries" : "✗ Disabled – no email summaries"}
                        </div>
                      </div>
                      <button
                        onClick={() => updateSettings("notificationsEnabled", !settings.notificationsEnabled)}
                        className={`text-xs font-semibold px-4 py-2 rounded transition-all duration-200 cursor-pointer min-w-[80px] text-center flex-shrink-0 ${
                          settings.notificationsEnabled 
                            ? "bg-green-500/20 text-green-300 border border-green-400/30 hover:bg-green-500/30" 
                            : "bg-red-500/20 text-red-300 border border-red-400/30 hover:bg-red-500/30"
                        }`}
                      >
                        {settings.notificationsEnabled ? "ON" : "OFF"}
                      </button>
                    </div>

                    <div className={`flex items-start justify-between gap-4 p-4 sm:p-5 glass-stat-card rounded-lg border transition-all duration-200 ${
                      settings.billingNotificationsEnabled
                        ? "border-green-400/20 bg-green-500/5"
                        : "border-red-400/20 bg-red-500/5"
                    }`}>
                      <div className="space-y-2 flex-1">
                        <div className="text-white font-semibold text-base">Billing alerts</div>
                        <div className={`text-sm leading-relaxed ${settings.billingNotificationsEnabled ? "text-green-300/80" : "text-red-300/80"}`}>
                          {settings.billingNotificationsEnabled ? "✓ Enabled – receiving billing notifications" : "✗ Disabled – no billing notifications"}
                        </div>
                      </div>
                      <button
                        onClick={() => updateSettings("billingNotificationsEnabled", !settings.billingNotificationsEnabled)}
                        className={`text-xs font-semibold px-4 py-2 rounded transition-all duration-200 cursor-pointer min-w-[80px] text-center flex-shrink-0 ${
                          settings.billingNotificationsEnabled 
                            ? "bg-green-500/20 text-green-300 border border-green-400/30 hover:bg-green-500/30" 
                            : "bg-red-500/20 text-red-300 border border-red-400/30 hover:bg-red-500/30"
                        }`}
                      >
                        {settings.billingNotificationsEnabled ? "ON" : "OFF"}
                      </button>
                    </div>
                  </div>

                  <div className="glass-card rounded-xl p-5 sm:p-6 border border-white/10 bg-white/5">
                    <label className="text-sm font-semibold uppercase tracking-wider text-white/70 block mb-3">Additional email (optional)</label>
                    <input 
                      type="email" 
                      value={settings.billingEmail} 
                      onChange={e => updateSettings("billingEmail", e.target.value)}
                      className="w-full px-4 py-3 glass-input text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-sm transition-all"
                      placeholder="billing@company.com"
                    />
                  </div>
                </div>
            )}

            {/* AUDIT TAB */}
            {tab === "audit" && (
                <div className="space-y-6 sm:space-y-8 animate-fadeIn w-full">
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 mb-4 sm:mb-5">
                      <div className="w-1 h-6 sm:h-7 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-white">Audit log</h3>
                        <p className="text-sm text-white/60 mt-1">Interactive trail of security and settings events</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2 w-fit">
                      {(["all","success","error"] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setAuditFilter(filter)}
                          className={`text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded transition whitespace-nowrap ${
                            auditFilter === filter
                              ? "bg-white/15 text-white border border-white/25 shadow-inner"
                              : "text-white/70 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {filter === "all" ? "All" : filter === "success" ? "Success" : "Errors"}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="glass-card rounded-xl p-5 sm:p-6 border border-cyan-400/20 bg-gradient-to-br from-cyan-600/15 to-blue-600/10 shadow-lg overflow-hidden">
                    <div className="flex items-center justify-between mb-4 sm:mb-5 flex-wrap gap-3">
                      <h4 className="text-lg font-bold text-white">Recent events</h4>
                      <span className="text-sm text-white/60 whitespace-nowrap">{auditEvents.length} items</span>
                    </div>
                    <div className="space-y-3 max-h-[400px] sm:max-h-[500px] overflow-auto custom-scrollbar pr-2 scroll-smooth -mx-1 px-1 pt-0.5 -mt-0.5">
                      {auditEvents.map((event, index) => (
                        <div
                          key={event.id}
                          data-event-id={event.id}
                          className={`flex items-start gap-3 sm:gap-4 rounded-lg border px-4 sm:px-5 py-3 sm:py-4 transition-all duration-700 ease-out hover:bg-white/10 ${
                            event.status === "success"
                              ? "border-green-400/25 bg-white/5"
                              : "border-red-400/25 bg-white/5"
                          } ${
                            visibleEvents.has(event.id)
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-4"
                          }`}
                          style={{
                            transitionDelay: `${Math.min(index * 50, 300)}ms`,
                          }}
                        >
                          <span
                            className={`self-stretch w-1 rounded-full flex-shrink-0 ${
                              event.status === "success" ? "bg-green-400/60" : "bg-red-400/70"
                            }`}
                          />
                          <div className="space-y-2 flex-1 min-w-0">
                            <div className="text-sm sm:text-base text-white font-semibold leading-tight break-words" dir="auto">
                              {event.action}
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm text-white/60">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-white/50 font-medium flex-shrink-0">Actor:</span>
                                <span className="text-white/70 truncate" dir="auto" title={event.actor}>{event.actor}</span>
                              </div>
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-white/50 font-medium flex-shrink-0">Time:</span>
                                <span className="text-white/70 font-mono truncate" dir="ltr" title={event.at}>{event.at}</span>
                              </div>
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-white/50 font-medium flex-shrink-0">IP:</span>
                                <span className="text-white/70 font-mono truncate" dir="ltr" title={event.ip}>{event.ip}</span>
                              </div>
                            </div>
                          </div>
                          <span
                            className={`text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap flex-shrink-0 ${
                              event.status === "success"
                                ? "bg-green-500/15 text-green-300 border border-green-400/30"
                                : "bg-red-500/15 text-red-300 border border-red-400/30"
                            }`}
                          >
                            {event.status === "success" ? "Success" : "Alert"}
                          </span>
                        </div>
                      ))}
                      {auditEvents.length === 0 && (
                        <div className="text-center text-white/60 text-sm py-6 sm:py-8 border border-dashed border-white/10 rounded-lg" dir="auto">
                          <ClipboardList className="w-5 h-5 mx-auto mb-2 opacity-50" />
                          <p>No audit events for this filter.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
            )}

            {/* DATA & PRIVACY TAB */}
            {tab === "privacy" && (
              <div className="space-y-6 sm:space-y-8 animate-fadeIn w-full">
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-6 sm:h-7 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Data & Privacy</h3>
                      <p className="text-sm text-white/60 mt-1">Manage your data, privacy settings, and export options</p>
                    </div>
                  </div>
                </div>

                {/* Data Export */}
                <div className="glass-card rounded-xl p-5 sm:p-6 border border-purple-400/20 bg-gradient-to-br from-purple-600/15 to-pink-600/10 hover:border-purple-400/40 hover:shadow-purple-500/20 transition-all duration-300 shadow-lg">
                  <div className="flex items-center gap-3 mb-4 sm:mb-5">
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold text-white">Export Your Data</h4>
                      <p className="text-xs sm:text-sm text-white/60 mt-0.5">Download all your personal data in a portable format</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        toast.success("Data export request initiated. You will receive an email when ready.");
                      }}
                      className="w-full py-2.5 sm:py-3 glass-stat-card rounded-lg transition text-sm font-semibold flex items-center justify-center gap-2 border border-purple-400/40 bg-purple-500/30 hover:bg-purple-500/40 hover:border-purple-400/60 hover:shadow-purple-500/30 text-purple-300 shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      Request Full Data Export
                    </button>
                    <p className="text-xs text-white/50 text-center">
                      Your data will be compiled and sent to your email within 24-48 hours.
                    </p>
                  </div>
                </div>

                {/* Data Deletion */}
                <div className="glass-card rounded-xl p-5 sm:p-6 border border-red-400/20 bg-gradient-to-br from-red-600/15 to-orange-600/10 hover:border-red-400/40 hover:shadow-red-500/20 transition-all duration-300 shadow-lg">
                  <div className="flex items-center gap-3 mb-4 sm:mb-5">
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold text-white">Delete Account</h4>
                      <p className="text-xs sm:text-sm text-white/60 mt-0.5">Permanently delete your account and all associated data</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 sm:p-4 rounded-lg bg-red-500/10 border border-red-400/20">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          <p className="text-xs sm:text-sm text-red-300 font-medium">Warning: This action cannot be undone</p>
                          <p className="text-xs text-white/60">
                            Deleting your account will permanently remove all your data including orders, customers, invoices, and settings. This action is irreversible.
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        toast.error("Account deletion requires additional verification. Please contact support.");
                      }}
                      className="w-full py-2.5 sm:py-3 glass-stat-card rounded-lg transition text-sm font-semibold flex items-center justify-center gap-2 border border-red-400/40 bg-red-500/30 hover:bg-red-500/40 hover:border-red-400/60 hover:shadow-red-500/30 text-red-300 shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </button>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="glass-card rounded-xl p-5 sm:p-6 border border-blue-400/20 bg-gradient-to-br from-blue-600/15 to-indigo-600/10 hover:border-blue-400/40 hover:shadow-blue-500/20 transition-all duration-300 shadow-lg">
                  <div className="flex items-center gap-3 mb-4 sm:mb-5">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold text-white">Privacy Settings</h4>
                      <p className="text-xs sm:text-sm text-white/60 mt-0.5">Control how your data is used and shared</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10">
                      <div>
                        <p className="text-sm font-medium text-white">Analytics & Usage Data</p>
                        <p className="text-xs text-white/60 mt-1">Help us improve the system by sharing anonymous usage data</p>
                      </div>
                      <button
                        onClick={() => {
                          toast.success("Analytics preference updated");
                        }}
                        className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-medium hover:bg-green-500/30 transition"
                      >
                        Enabled
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10">
                      <div>
                        <p className="text-sm font-medium text-white">Marketing Communications</p>
                        <p className="text-xs text-white/60 mt-1">Receive updates about new features and promotions</p>
                      </div>
                      <button
                        onClick={() => {
                          toast.success("Marketing preference updated");
                        }}
                        className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-medium hover:bg-red-500/30 transition"
                      >
                        Disabled
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


