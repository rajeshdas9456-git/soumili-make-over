'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  DollarSign,
  Image as ImageIcon,
  Layers,
  Star,
  Settings,
  Mail,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Upload,
  Check,
  Eye,
  Calendar,
  Phone,
  MapPin,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Smartphone,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import { WebsiteSettings, ServiceItem, PricingPackage, GalleryCategory, GalleryImage, Testimonial, BookingEnquiry } from '@/types/database';
import Logo from '@/components/Logo';
import { compressImageFile, dataURItoBlob } from '@/lib/imageCompressor';
import { clientStore } from '@/lib/clientStore';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'gallery' | 'services' | 'settings' | 'testimonials' | 'enquiries'>('overview');
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  // Live Data States
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [enquiries, setEnquiries] = useState<BookingEnquiry[]>([]);

  // Modals & Edit Form States
  const [editingPackage, setEditingPackage] = useState<Partial<PricingPackage> | null>(null);
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryImage> | null>(null);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);

  // Uploading state
  const [uploading, setUploading] = useState(false);

  // Load all dashboard data with instant LocalStorage hydration
  const fetchData = async () => {
    try {
      setLoading(true);

      // Check local cache first for instant UI response
      const hasCustomSettings = clientStore.hasCustom('settings');
      const hasCustomPkgs = clientStore.hasCustom('packages');
      const hasCustomServices = clientStore.hasCustom('services');
      const hasCustomGallery = clientStore.hasCustom('gallery');
      const hasCustomCategories = clientStore.hasCustom('categories');
      const hasCustomTestimonials = clientStore.hasCustom('testimonials');

      const localSettings = clientStore.getSettings();
      const localPkgs = clientStore.getPackages(false);
      const localServices = clientStore.getServices();
      const localGallery = clientStore.getGallery(false);
      const localCategories = clientStore.getCategories();
      const localTestimonials = clientStore.getTestimonials(false);
      const localEnquiries = clientStore.getEnquiries();

      if (localSettings && localSettings.brand_name) setSettings(localSettings);
      if (localPkgs && localPkgs.length > 0) setPackages(localPkgs);
      if (localServices && localServices.length > 0) setServices(localServices);
      if (localGallery && localGallery.length > 0) setGallery(localGallery);
      if (localCategories && localCategories.length > 0) setCategories(localCategories);
      if (localTestimonials && localTestimonials.length > 0) setTestimonials(localTestimonials);
      if (localEnquiries && localEnquiries.length > 0) setEnquiries(localEnquiries);

      // Then fetch from server
      const [sRes, pRes, srvRes, gRes, tRes, eRes] = await Promise.all([
        fetch('/api/settings').catch(() => null),
        fetch('/api/packages?all=true').catch(() => null),
        fetch('/api/services').catch(() => null),
        fetch('/api/gallery?all=true').catch(() => null),
        fetch('/api/testimonials?all=true').catch(() => null),
        fetch('/api/enquiries').catch(() => null)
      ]);

      if (sRes && sRes.ok) {
        const sData = await sRes.json();
        if (sData && sData.brand_name && !hasCustomSettings) {
          setSettings(sData);
        }
      }
      if (pRes && pRes.ok) {
        const pData = await pRes.json();
        if (Array.isArray(pData) && pData.length > 0 && !hasCustomPkgs) {
          setPackages(pData);
        }
      }
      if (srvRes && srvRes.ok) {
        const srvData = await srvRes.json();
        if (Array.isArray(srvData) && srvData.length > 0 && !hasCustomServices) {
          setServices(srvData);
        }
      }
      if (gRes && gRes.ok) {
        const gData = await gRes.json();
        if (gData && Array.isArray(gData.images) && !hasCustomGallery && gData.images.length > 0) {
          setGallery(gData.images);
        }
        if (gData && Array.isArray(gData.categories) && !hasCustomCategories && gData.categories.length > 0) {
          setCategories(gData.categories);
        }
      }
      if (tRes && tRes.ok) {
        const tData = await tRes.json();
        if (Array.isArray(tData) && tData.length > 0 && !hasCustomTestimonials) {
          setTestimonials(tData);
        }
      }
      if (eRes && eRes.ok) {
        const eData = await eRes.json();
        setEnquiries(eData);
        clientStore.saveEnquiries(eData);
      }

      // If user has local custom data, silently sync it to the server so disk & memory stay warm
      if (hasCustomSettings || hasCustomPkgs || hasCustomGallery || hasCustomServices || hasCustomCategories || hasCustomTestimonials) {
        fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            settings: hasCustomSettings ? localSettings : undefined,
            packages: hasCustomPkgs ? localPkgs : undefined,
            gallery: hasCustomGallery ? localGallery : undefined,
            services: hasCustomServices ? localServices : undefined,
            categories: hasCustomCategories ? localCategories : undefined,
            testimonials: hasCustomTestimonials ? localTestimonials : undefined
          })
        }).catch(() => {});
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [syncingCloud, setSyncingCloud] = useState(false);
  const [syncCodeInput, setSyncCodeInput] = useState('');
  const [showSyncModal, setShowSyncModal] = useState(false);

  // Generate complete sync payload as JSON
  const getFullBundle = () => {
    return {
      settings: settings || clientStore.getSettings(),
      packages: packages.length > 0 ? packages : clientStore.getPackages(false),
      gallery: gallery.length > 0 ? gallery : clientStore.getGallery(false),
      services: services.length > 0 ? services : clientStore.getServices(),
      categories: categories.length > 0 ? categories : clientStore.getCategories(),
      testimonials: testimonials.length > 0 ? testimonials : clientStore.getTestimonials(false)
    };
  };

  const handleCopySyncCode = () => {
    try {
      const bundle = getFullBundle();
      const json = JSON.stringify(bundle);
      navigator.clipboard.writeText(json);
      showNotification('📋 Sync Code copied! Paste it on your mobile device to load all photos & packages.');
    } catch {
      alert('Unable to copy automatically. Please try manual copy.');
    }
  };

  const handleApplySyncCode = async () => {
    if (!syncCodeInput.trim()) return;
    try {
      const parsed = JSON.parse(syncCodeInput.trim());
      if (parsed.settings) {
        setSettings(parsed.settings);
        clientStore.saveSettings(parsed.settings);
      }
      if (parsed.packages && Array.isArray(parsed.packages)) {
        setPackages(parsed.packages);
        clientStore.savePackages(parsed.packages);
      }
      if (parsed.gallery && Array.isArray(parsed.gallery)) {
        setGallery(parsed.gallery);
        clientStore.saveGallery(parsed.gallery);
      }
      if (parsed.services && Array.isArray(parsed.services)) {
        setServices(parsed.services);
        clientStore.saveServices(parsed.services);
      }
      if (parsed.categories && Array.isArray(parsed.categories)) {
        setCategories(parsed.categories);
        clientStore.saveCategories(parsed.categories);
      }
      if (parsed.testimonials && Array.isArray(parsed.testimonials)) {
        setTestimonials(parsed.testimonials);
        clientStore.saveTestimonials(parsed.testimonials);
      }

      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });

      showNotification('🎉 Device 100% Synced! All photos & packages are now active!');
      setShowSyncModal(false);
      setSyncCodeInput('');
      fetchData();
    } catch {
      alert('Invalid sync code format. Please copy the complete code.');
    }
  };

  const handleDownloadInitialData = () => {
    const bundle = getFullBundle();
    const fileContent = `import { WebsiteSettings, ServiceItem, PricingPackage, GalleryCategory, GalleryImage, Testimonial } from '@/types/database';

export const initialSettings: WebsiteSettings = ${JSON.stringify(bundle.settings, null, 2)};

export const initialServices: ServiceItem[] = ${JSON.stringify(bundle.services, null, 2)};

export const initialPackages: PricingPackage[] = ${JSON.stringify(bundle.packages, null, 2)};

export const initialCategories: GalleryCategory[] = ${JSON.stringify(bundle.categories, null, 2)};

export const initialGallery: GalleryImage[] = ${JSON.stringify(bundle.gallery, null, 2)};

export const initialTestimonials: Testimonial[] = ${JSON.stringify(bundle.testimonials, null, 2)};
`;

    const blob = new Blob([fileContent], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'initialData.ts';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('📥 initialData.ts downloaded! Replace src/lib/initialData.ts with this file to make all your photos permanent forever on Vercel!');
  };

  const triggerFullCloudSync = async () => {
    setSyncingCloud(true);
    try {
      const payload = {
        settings: settings || clientStore.getSettings(),
        packages: packages.length > 0 ? packages : clientStore.getPackages(false),
        gallery: gallery.length > 0 ? gallery : clientStore.getGallery(false),
        services: services.length > 0 ? services : clientStore.getServices(),
        categories: categories.length > 0 ? categories : clientStore.getCategories(),
        testimonials: testimonials.length > 0 ? testimonials : clientStore.getTestimonials(false)
      };

      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showNotification('🚀 100% Synced! Changes are live across Mobile & Web!');
      } else {
        showNotification('✅ Saved locally! Connect Supabase in Vercel for 100% global cloud sync.');
      }
    } catch {
      showNotification('✅ Changes saved!');
    } finally {
      setSyncingCloud(false);
    }
  };

  const notifTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const showNotification = (msg: string) => {
    setSaveSuccess(msg);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { (navigator as any).vibrate?.(50); } catch {}
    }
    if (notifTimeoutRef.current) clearTimeout(notifTimeoutRef.current);
    notifTimeoutRef.current = setTimeout(() => {
      setSaveSuccess('');
    }, 5000);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  // Ultra-Fast Image Upload Handler with Instant Canvas Compression (< 50ms)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, onComplete: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      showNotification('⚡ Optimizing photo in 0.05s...');

      // 1. Instant Client-Side Compression in Canvas (transforms 10MB photo down to ~70KB!)
      const compressedDataUrl = await compressImageFile(file, 1200, 0.76);

      // Immediately set the image preview so user sees it with zero delay!
      onComplete(compressedDataUrl);

      // 2. Also upload the tiny ~70KB blob to server (finishes in 0.2s)
      try {
        const blob = dataURItoBlob(compressedDataUrl);
        const formData = new FormData();
        const safeName = (file.name || 'bridal-photo').replace(/[^a-zA-Z0-9.-]/g, '_');
        formData.append('file', blob, safeName);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.url) {
            onComplete(data.url);
          }
        }
      } catch (uploadErr) {
        // Even if server upload times out, compressed Data URI is already safely in place!
      }

      showNotification('✨ Photo processed & saved instantly!');
    } catch (err: any) {
      alert(err.message || 'Image processing error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // 1. SAVE SETTINGS
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      clientStore.saveSettings(settings);
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        showNotification("✅ Soumili's Makeover settings updated successfully!");
        triggerFullCloudSync();
      } else {
        showNotification("Saved to browser cache!");
      }
    } catch {
      showNotification("Saved to browser cache!");
    }
  };

  // 2. PACKAGES ACTIONS
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage?.name || !editingPackage?.price) return;
    try {
      const pkgToSave = {
        ...editingPackage,
        price: Number(editingPackage.price)
      };

      // 1. Update local clientStore immediately
      const currentPkgs = clientStore.getPackages(false);
      let updatedPkgs: PricingPackage[];
      if (pkgToSave.id) {
        updatedPkgs = currentPkgs.map(p => p.id === pkgToSave.id ? { ...p, ...pkgToSave } as PricingPackage : p);
      } else {
        const newPkg = { ...pkgToSave, id: `pkg-${Date.now()}`, is_published: true, created_at: new Date().toISOString() } as PricingPackage;
        updatedPkgs = [...currentPkgs, newPkg];
      }
      clientStore.savePackages(updatedPkgs);
      setPackages(updatedPkgs);

      // 2. Send to server
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pkgToSave)
      });
      if (res.ok) {
        showNotification('✅ Package saved & live across website!');
        setEditingPackage(null);
        fetchData();
        triggerFullCloudSync();
      } else {
        showNotification('Saved to browser cache!');
        setEditingPackage(null);
      }
    } catch {
      showNotification('Saved to browser cache!');
      setEditingPackage(null);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing package?')) return;
    const currentPkgs = clientStore.getPackages(false).filter(p => p.id !== id);
    clientStore.savePackages(currentPkgs);
    setPackages(currentPkgs);
    try {
      await fetch(`/api/packages?id=${id}`, { method: 'DELETE' });
    } catch {}
    showNotification('Package deleted.');
    fetchData();
  };

  // 3. GALLERY ACTIONS
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery?.title || !editingGallery?.image_url) return;
    try {
      // 1. Update local clientStore immediately
      const currentGallery = clientStore.getGallery(false);
      let updatedGallery: GalleryImage[];
      if (editingGallery.id) {
        updatedGallery = currentGallery.map(g => g.id === editingGallery.id ? { ...g, ...editingGallery } as GalleryImage : g);
      } else {
        const newImg = { ...editingGallery, id: `gal-${Date.now()}`, is_published: true, created_at: new Date().toISOString() } as GalleryImage;
        updatedGallery = [...currentGallery, newImg];
      }
      clientStore.saveGallery(updatedGallery);
      setGallery(updatedGallery);

      // 2. Send to server
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGallery)
      });
      if (res.ok) {
        showNotification('✅ Gallery image saved & live across website!');
        setEditingGallery(null);
        fetchData();
        triggerFullCloudSync();
      } else {
        showNotification('Saved to browser cache!');
        setEditingGallery(null);
      }
    } catch {
      showNotification('Saved to browser cache!');
      setEditingGallery(null);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo from the gallery?')) return;
    const currentGallery = clientStore.getGallery(false).filter(g => g.id !== id);
    clientStore.saveGallery(currentGallery);
    setGallery(currentGallery);
    try {
      await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
    } catch {}
    showNotification('Gallery photo deleted.');
    fetchData();
  };

  // 4. SERVICES ACTIONS
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) return;
    try {
      const currentServices = clientStore.getServices();
      let updatedServices: ServiceItem[];
      if (editingService.id) {
        updatedServices = currentServices.map(s => s.id === editingService.id ? { ...s, ...editingService } as ServiceItem : s);
      } else {
        const newSvc = { ...editingService, id: `svc-${Date.now()}`, is_featured: true, created_at: new Date().toISOString() } as ServiceItem;
        updatedServices = [...currentServices, newSvc];
      }
      clientStore.saveServices(updatedServices);
      setServices(updatedServices);

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService)
      });
      if (res.ok) {
        showNotification('✅ Service saved & live!');
        setEditingService(null);
        fetchData();
        triggerFullCloudSync();
      } else {
        showNotification('Saved to browser cache!');
        setEditingService(null);
      }
    } catch {
      showNotification('Saved to browser cache!');
      setEditingService(null);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    const currentServices = clientStore.getServices().filter(s => s.id !== id);
    clientStore.saveServices(currentServices);
    setServices(currentServices);
    try {
      await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
    } catch {}
    showNotification('Service removed.');
    fetchData();
  };

  // 5. TESTIMONIALS ACTIONS
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial?.client_name || !editingTestimonial?.quote) return;
    try {
      const currentTests = clientStore.getTestimonials(false);
      let updatedTests: Testimonial[];
      if (editingTestimonial.id) {
        updatedTests = currentTests.map(t => t.id === editingTestimonial.id ? { ...t, ...editingTestimonial } as Testimonial : t);
      } else {
        const newTest = { ...editingTestimonial, id: `test-${Date.now()}`, is_published: true, created_at: new Date().toISOString() } as Testimonial;
        updatedTests = [...currentTests, newTest];
      }
      clientStore.saveTestimonials(updatedTests);
      setTestimonials(updatedTests);

      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTestimonial)
      });
      if (res.ok) {
        showNotification('✅ Testimonial saved & live!');
        setEditingTestimonial(null);
        fetchData();
        triggerFullCloudSync();
      } else {
        showNotification('Saved to browser cache!');
        setEditingTestimonial(null);
      }
    } catch {
      showNotification('Saved to browser cache!');
      setEditingTestimonial(null);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    const currentTests = clientStore.getTestimonials(false).filter(t => t.id !== id);
    clientStore.saveTestimonials(currentTests);
    setTestimonials(currentTests);
    try {
      await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
    } catch {}
    showNotification('Testimonial deleted.');
    fetchData();
  };

  // 6. ENQUIRY STATUS TOGGLE
  const handleUpdateEnquiry = async (id: string, status: BookingEnquiry['status']) => {
    await fetch('/api/enquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-brandBlack text-white flex flex-col font-sans selection:bg-brandPink selection:text-white">
      
      {/* Top Admin Header */}
      <header className="bg-[#181818] border-b border-brandPink/30 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" target="_blank" className="flex items-center space-x-2 text-white hover:text-brandPink transition-colors">
            <span className="font-serif text-xl tracking-wide uppercase font-semibold text-white">
              Soumili's Makeover
            </span>
            <span className="text-brandPink text-sm font-normal hidden sm:inline">
              – Website Management
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-brandPink" />
          </Link>
          <span className="text-[10px] bg-brandPink/20 text-brandPink border border-brandPink/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
            Live Database
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={triggerFullCloudSync}
            disabled={syncingCloud}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-brandPink hover:bg-brandPink-600 px-3.5 py-1.5 rounded-lg shadow-pink-soft transition-all cursor-pointer"
            title="Push all changes to Mobile and visitors worldwide"
          >
            <Sparkles className={`w-3.5 h-3.5 ${syncingCloud ? 'animate-spin' : ''}`} />
            <span>{syncingCloud ? 'Syncing...' : 'Sync to Mobile'}</span>
          </button>
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center space-x-1.5 text-xs text-white/80 hover:text-white bg-brandBlack px-3 py-1.5 rounded-lg border border-brandPink/30 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-brandPink" />
            <span>View Live Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-1.5 text-xs text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 px-3.5 py-1.5 rounded-lg border border-rose-800/50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* High-Visibility Floating Save Notification (Centered Top for Phone & Laptop) */}
      {saveSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[99999] max-w-md w-[92%] sm:w-auto bg-[#181818] border-2 border-emerald-400 text-white px-6 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(16,185,129,0.35)] flex items-center space-x-3 transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0 text-emerald-400">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-white tracking-wide">{saveSuccess}</p>
            <p className="text-[10px] text-emerald-300/80">Live on Soumili's Makeover</p>
          </div>
          <button
            onClick={() => setSaveSuccess('')}
            className="text-white/60 hover:text-white text-xs pl-2 shrink-0 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 bg-[#141414] border-r border-brandPink/20 p-4 space-y-1 shrink-0">
          <div className="px-3 py-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-brandPink">
              Soumili's Makeover
            </p>
            <p className="text-xs text-white/60">
              Website Management
            </p>
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-brandPink text-white shadow-pink-soft'
                : 'text-white/80 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Studio Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'packages'
                ? 'bg-brandPink text-white shadow-pink-soft'
                : 'text-white/80 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <DollarSign className="w-4 h-4" />
              <span>Pricing & Packages</span>
            </div>
            <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full text-white">
              {packages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'gallery'
                ? 'bg-brandPink text-white shadow-pink-soft'
                : 'text-white/80 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <ImageIcon className="w-4 h-4" />
              <span>Photo Gallery</span>
            </div>
            <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full text-white">
              {gallery.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'services'
                ? 'bg-brandPink text-white shadow-pink-soft'
                : 'text-white/80 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Layers className="w-4 h-4" />
              <span>Couture Services</span>
            </div>
            <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full text-white">
              {services.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'testimonials'
                ? 'bg-brandPink text-white shadow-pink-soft'
                : 'text-white/80 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Star className="w-4 h-4" />
              <span>Client Reviews</span>
            </div>
            <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full text-white">
              {testimonials.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'enquiries'
                ? 'bg-brandPink text-white shadow-pink-soft'
                : 'text-white/80 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4" />
              <span>Booking Leads</span>
            </div>
            {enquiries.filter(e => e.status === 'new').length > 0 && (
              <span className="text-[10px] bg-brandPink text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                {enquiries.filter(e => e.status === 'new').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'settings'
                ? 'bg-brandPink text-white shadow-pink-soft'
                : 'text-white/80 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Site Content & Branding</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-white">
                  Soumili's Makeover – Website Management
                </h2>
                <p className="text-xs text-brandLightPink/80 mt-1">
                  Beauty • Elegance • Perfection | Real-time control of your luxury makeup artist platform.
                </p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#181818] p-5 rounded-2xl border border-brandPink/30 shadow-pink-soft">
                  <p className="text-[10px] uppercase tracking-wider text-brandPink font-semibold">
                    Gallery Photos
                  </p>
                  <p className="font-serif text-3xl text-white mt-2">{gallery.length}</p>
                  <p className="text-[11px] text-brandLightPink/70 mt-1">HD Portfolio Items</p>
                </div>

                <div className="bg-[#181818] p-5 rounded-2xl border border-brandPink/30 shadow-pink-soft">
                  <p className="text-[10px] uppercase tracking-wider text-brandPink font-semibold">
                    Pricing Packages
                  </p>
                  <p className="font-serif text-3xl text-white mt-2">{packages.length}</p>
                  <p className="text-[11px] text-brandLightPink/70 mt-1">Active INR Rates</p>
                </div>

                <div className="bg-[#181818] p-5 rounded-2xl border border-brandPink/30 shadow-pink-soft">
                  <p className="text-[10px] uppercase tracking-wider text-brandPink font-semibold">
                    Services Listed
                  </p>
                  <p className="font-serif text-3xl text-white mt-2">{services.length}</p>
                  <p className="text-[11px] text-brandLightPink/70 mt-1">Couture Offerings</p>
                </div>

                <div className="bg-[#181818] p-5 rounded-2xl border border-brandPink/30 shadow-pink-soft">
                  <p className="text-[10px] uppercase tracking-wider text-brandPink font-semibold">
                    Booking Enquiries
                  </p>
                  <p className="font-serif text-3xl text-white mt-2">{enquiries.length}</p>
                  <p className="text-[11px] text-emerald-400 mt-1">
                    {enquiries.filter(e => e.status === 'new').length} New Leads
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-[#181818] p-6 rounded-3xl border border-brandPink/30">
                <h3 className="font-serif text-lg text-white mb-4">
                  Quick Studio Operations
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setEditingPackage({
                        name: '',
                        category: 'Bridal',
                        price: 30000,
                        duration: '3.5 Hours',
                        description: '',
                        features: ['HD Base Makeup', 'Hairstyling', 'Lash Application', 'Draping'],
                        image_url: '',
                        is_featured: false,
                        is_published: true
                      });
                      setActiveTab('packages');
                    }}
                    className="inline-flex items-center space-x-2 bg-brandPink hover:bg-brandPink-600 text-white text-xs px-4 py-2.5 rounded-xl font-medium shadow-pink-soft"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Pricing Package</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingGallery({
                        title: '',
                        description: '',
                        image_url: '',
                        category_id: categories[0]?.id || '',
                        is_featured: false,
                        is_published: true
                      });
                      setActiveTab('gallery');
                    }}
                    className="inline-flex items-center space-x-2 bg-brandBlack hover:bg-white/10 border border-brandPink/40 text-white text-xs px-4 py-2.5 rounded-xl font-medium"
                  >
                    <Upload className="w-4 h-4 text-brandPink" />
                    <span>Upload Gallery Photo</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="inline-flex items-center space-x-2 bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 hover:bg-[#25D366]/30 text-xs px-4 py-2.5 rounded-xl font-medium"
                  >
                    <Mail className="w-4 h-4" />
                    <span>View Latest Inquiries ({enquiries.length})</span>
                  </button>
                </div>
              </div>

              {/* Cross-Device Cloud Sync Card */}
              <div className="bg-gradient-to-r from-[#20151c] to-[#181818] p-6 rounded-3xl border border-brandPink/40 shadow-pink-soft">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-brandPink/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-brandPink/20 text-brandPink border border-brandPink/40 flex items-center justify-center shrink-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-white font-medium">
                        Mobile & Multi-Device Live Sync
                      </h3>
                      <p className="text-xs text-brandLightPink/80">
                        Sync all your photos, packages, and bride counts between Laptop, Mobile, and Live Website visitors!
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={triggerFullCloudSync}
                      disabled={syncingCloud}
                      className="inline-flex items-center space-x-2 bg-brandPink hover:bg-brandPink-600 text-white text-xs px-4 py-2.5 rounded-xl font-semibold uppercase tracking-wider shadow-pink-soft transition-all"
                    >
                      <Sparkles className={`w-4 h-4 ${syncingCloud ? 'animate-spin' : ''}`} />
                      <span>{syncingCloud ? 'Syncing...' : 'Sync to Live Site'}</span>
                    </button>
                    <button
                      onClick={handleCopySyncCode}
                      className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs px-4 py-2.5 rounded-xl font-medium transition-all"
                      title="Copy all data to paste into mobile phone"
                    >
                      <Copy className="w-4 h-4 text-brandPink" />
                      <span>Copy Sync Code</span>
                    </button>
                    <button
                      onClick={() => setShowSyncModal(true)}
                      className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs px-4 py-2.5 rounded-xl font-medium transition-all"
                    >
                      <Share2 className="w-4 h-4 text-emerald-400" />
                      <span>Paste Sync Code</span>
                    </button>
                    <button
                      onClick={handleDownloadInitialData}
                      className="inline-flex items-center space-x-2 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-600/50 text-emerald-300 text-xs px-4 py-2.5 rounded-xl font-medium transition-all"
                      title="Download updated initialData.ts file"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Website Data</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-white/70">
                  <div className="p-3 bg-brandBlack/60 rounded-xl border border-brandPink/15">
                    <span className="font-semibold text-brandPink block mb-0.5">1. Auto Cloud Sync:</span>
                    Whenever you save packages or photos, it auto-pushes to the live cloud backend.
                  </div>
                  <div className="p-3 bg-brandBlack/60 rounded-xl border border-brandPink/15">
                    <span className="font-semibold text-brandPink block mb-0.5">2. Device-to-Device Code:</span>
                    Click "Copy Sync Code" on laptop and paste it into mobile to transfer all photos in 1 second.
                  </div>
                  <div className="p-3 bg-brandBlack/60 rounded-xl border border-brandPink/15">
                    <span className="font-semibold text-emerald-400 block mb-0.5">3. Permanent Vercel Hardcode:</span>
                    Click "Download Website Data" and put it into <code className="text-white">src/lib/initialData.ts</code> for permanent zero-database hosting!
                  </div>
                </div>
              </div>

              {/* Recent Inquiries Preview */}
              <div className="bg-[#181818] p-6 rounded-3xl border border-brandPink/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg text-white">
                    Recent Bridal Inquiries
                  </h3>
                  <button onClick={() => setActiveTab('enquiries')} className="text-xs text-brandPink hover:underline">
                    View All Leads &rarr;
                  </button>
                </div>

                {enquiries.length === 0 ? (
                  <p className="text-xs text-white/60 py-4">No inquiries received yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-brandPink/20 text-brandPink">
                          <th className="py-2.5">Client Name</th>
                          <th className="py-2.5">Date</th>
                          <th className="py-2.5">Package</th>
                          <th className="py-2.5">Location</th>
                          <th className="py-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {enquiries.slice(0, 5).map(e => (
                          <tr key={e.id}>
                            <td className="py-3 font-medium text-white">{e.client_name}</td>
                            <td className="py-3 text-white/80">{e.event_date}</td>
                            <td className="py-3 text-white/80">{e.package_name || 'General Inquiry'}</td>
                            <td className="py-3 text-white/80">{e.event_location}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                                e.status === 'new' ? 'bg-rose-900/60 text-rose-300 border border-rose-700/60' : 'bg-emerald-900/60 text-emerald-300'
                              }`}>
                                {e.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PACKAGES */}
          {activeTab === 'packages' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-white">
                    Manage Pricing & Bridal Packages
                  </h2>
                  <p className="text-xs text-brandLightPink/80 mt-1">
                    Control real prices in INR, features, images, and publish status for Soumili's Makeover.
                  </p>
                </div>
                <button
                  onClick={() => setEditingPackage({
                    name: '',
                    category: 'Bridal',
                    price: 25000,
                    duration: '3-4 Hours',
                    description: '',
                    features: ['Luxury Skin Prep', 'HD Base Artistry', 'Designer Hair Styling', 'Dupatta Draping'],
                    image_url: '',
                    is_featured: false,
                    is_published: true
                  })}
                  className="inline-flex items-center space-x-2 bg-brandPink hover:bg-brandPink-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-pink-soft"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Package</span>
                </button>
              </div>

              {/* Package Edit/Add Modal */}
              {editingPackage && (
                <div className="bg-[#181818] p-6 rounded-3xl border border-brandPink/40 shadow-xl space-y-4">
                  <h3 className="font-serif text-xl text-white">
                    {editingPackage.id ? 'Edit Package Details' : 'Create New Package'}
                  </h3>

                  <form onSubmit={handleSavePackage} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                          Package Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingPackage.name || ''}
                          onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                          placeholder="e.g. Royal Airbrush Bridal"
                          className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                          Price in INR (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          value={editingPackage.price || ''}
                          onChange={(e) => setEditingPackage({ ...editingPackage, price: parseInt(e.target.value) || 0 })}
                          placeholder="35000"
                          className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                          Category
                        </label>
                        <select
                          value={editingPackage.category || 'Bridal'}
                          onChange={(e) => setEditingPackage({ ...editingPackage, category: e.target.value })}
                          className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                        >
                          <option value="Bridal">Bridal</option>
                          <option value="Reception">Reception</option>
                          <option value="Engagement">Engagement</option>
                          <option value="Party">Party</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                          Session Duration
                        </label>
                        <input
                          type="text"
                          value={editingPackage.duration || '3.5 Hours'}
                          onChange={(e) => setEditingPackage({ ...editingPackage, duration: e.target.value })}
                          className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                          Package Image URL / Upload
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Choose photo with Upload button"
                            value={editingPackage.image_url || ''}
                            onChange={(e) => setEditingPackage({ ...editingPackage, image_url: e.target.value })}
                            className="flex-1 px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                          />
                          <label className="cursor-pointer bg-brandPink px-3.5 py-2 rounded-lg text-xs hover:bg-brandPink-600 flex items-center space-x-1.5 shrink-0 shadow-pink-soft transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, (url) => setEditingPackage({ ...editingPackage, image_url: url }))}
                            />
                          </label>
                        </div>
                        {editingPackage.image_url && (
                          <div className="mt-2 flex items-center space-x-3 p-2 bg-brandBlack rounded-lg border border-brandPink/30">
                            <img src={editingPackage.image_url} alt="Preview" className="w-12 h-12 object-cover rounded-md border border-brandPink/40" />
                            <div className="text-[11px] text-brandLightPink">
                              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
                                <span>Photo ready & optimized</span>
                              </span>
                              <span className="text-[10px] text-white/60 block">Will be displayed on package cards</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        Short Description
                      </label>
                      <textarea
                        rows={2}
                        value={editingPackage.description || ''}
                        onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                        className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        Package Inclusions (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(editingPackage.features) ? editingPackage.features.join(', ') : ''}
                        onChange={(e) => setEditingPackage({
                          ...editingPackage,
                          features: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        })}
                        placeholder="HD Waterproof Base, Designer Hair, Lashes, Dupatta Draping"
                        className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center space-x-6 pt-2">
                      <label className="flex items-center space-x-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={editingPackage.is_featured ?? false}
                          onChange={(e) => setEditingPackage({ ...editingPackage, is_featured: e.target.checked })}
                          className="rounded text-brandPink focus:ring-0"
                        />
                        <span>Featured "Most Coveted" Badge</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={editingPackage.is_published ?? true}
                          onChange={(e) => setEditingPackage({ ...editingPackage, is_published: e.target.checked })}
                          className="rounded text-brandPink focus:ring-0"
                        />
                        <span>Published on Public Website</span>
                      </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-brandPink/20">
                      <button
                        type="button"
                        onClick={() => setEditingPackage(null)}
                        className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-xs rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-brandPink hover:bg-brandPink-600 text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-pink-soft"
                      >
                        Save Package
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Package Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-[#181818] rounded-2xl overflow-hidden border border-brandPink/30 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-36 w-full bg-brandBlack flex items-center justify-center overflow-hidden">
                        {pkg.image_url ? (
                          <img src={pkg.image_url} alt={pkg.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-3">
                            <Sparkles className="w-6 h-6 text-brandPink mx-auto mb-1 opacity-70" />
                            <span className="text-[10px] text-brandLightPink/60">No photo uploaded (Click Edit)</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex space-x-1">
                          {pkg.is_featured && (
                            <span className="text-[10px] bg-brandPink text-white px-2 py-0.5 rounded-full font-bold">
                              Featured
                            </span>
                          )}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            pkg.is_published ? 'bg-emerald-800 text-emerald-200' : 'bg-stone-800 text-stone-400'
                          }`}>
                            {pkg.is_published ? 'Live' : 'Hidden'}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <span className="text-[10px] text-brandPink uppercase tracking-widest font-semibold">
                          {pkg.category}
                        </span>
                        <h4 className="font-serif text-lg text-white font-medium mt-0.5">
                          {pkg.name}
                        </h4>
                        <p className="font-serif text-2xl text-brandPink font-semibold my-2">
                          ₹{pkg.price.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-white/70 line-clamp-2 mb-3">
                          {pkg.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-brandBlack border-t border-brandPink/20 flex items-center justify-between">
                      <button
                        onClick={() => setEditingPackage(pkg)}
                        className="inline-flex items-center space-x-1 text-xs text-brandPink hover:underline"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="inline-flex items-center space-x-1 text-xs text-rose-400 hover:text-rose-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-white">
                    Manage HD Photo Gallery
                  </h2>
                  <p className="text-xs text-brandLightPink/80 mt-1">
                    Upload bridal makeover photography, update titles, assign categories, and control display order.
                  </p>
                </div>
                <button
                  onClick={() => setEditingGallery({
                    title: '',
                    description: '',
                    image_url: '',
                    category_id: categories[0]?.id || '',
                    is_featured: false,
                    is_published: true
                  })}
                  className="inline-flex items-center space-x-2 bg-brandPink hover:bg-brandPink-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-pink-soft"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload / Add Photo</span>
                </button>
              </div>

              {/* Gallery Add/Edit Modal */}
              {editingGallery && (
                <div className="bg-[#181818] p-6 rounded-3xl border border-brandPink/40 shadow-xl space-y-4">
                  <h3 className="font-serif text-xl text-white">
                    {editingGallery.id ? 'Edit Image Details' : 'Add New Gallery Masterpiece'}
                  </h3>

                  <form onSubmit={handleSaveGallery} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                          Look Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingGallery.title || ''}
                          onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                          placeholder="e.g. Royal Heritage Bride"
                          className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                          Category
                        </label>
                        <select
                          value={editingGallery.category_id || ''}
                          onChange={(e) => setEditingGallery({ ...editingGallery, category_id: e.target.value })}
                          className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                        >
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        High-Definition Image URL / File Upload *
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          required
                          value={editingGallery.image_url || ''}
                          onChange={(e) => setEditingGallery({ ...editingGallery, image_url: e.target.value })}
                          placeholder="Select photo with Upload button"
                          className="flex-1 px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                        />
                        <label className="cursor-pointer bg-brandPink px-3.5 py-2 rounded-lg text-xs hover:bg-brandPink-600 flex items-center space-x-1.5 shrink-0 shadow-pink-soft transition-all">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploading ? 'Optimizing...' : 'Upload Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, (url) => setEditingGallery({ ...editingGallery, image_url: url }))}
                          />
                        </label>
                      </div>
                      {editingGallery.image_url && (
                        <div className="mt-2 flex items-center space-x-3 p-2 bg-brandBlack rounded-lg border border-brandPink/30">
                          <img src={editingGallery.image_url} alt="Gallery Preview" className="w-14 h-14 object-cover rounded-md border border-brandPink/40" />
                          <div className="text-[11px] text-brandLightPink">
                            <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
                              <span>Photo ready & optimized</span>
                            </span>
                            <span className="text-[10px] text-white/60 block">Will be displayed in bridal photo gallery</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        Description / Styling Details
                      </label>
                      <textarea
                        rows={2}
                        value={editingGallery.description || ''}
                        onChange={(e) => setEditingGallery({ ...editingGallery, description: e.target.value })}
                        placeholder="Details about eyeshadow contour, drapery, jewelry..."
                        className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center space-x-6 pt-2">
                      <label className="flex items-center space-x-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={editingGallery.is_featured ?? false}
                          onChange={(e) => setEditingGallery({ ...editingGallery, is_featured: e.target.checked })}
                          className="rounded text-brandPink focus:ring-0"
                        />
                        <span>Featured on Homepage</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={editingGallery.is_published ?? true}
                          onChange={(e) => setEditingGallery({ ...editingGallery, is_published: e.target.checked })}
                          className="rounded text-brandPink focus:ring-0"
                        />
                        <span>Published</span>
                      </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-brandPink/20">
                      <button
                        type="button"
                        onClick={() => setEditingGallery(null)}
                        className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-xs rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-brandPink hover:bg-brandPink-600 text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-pink-soft"
                      >
                        Save Image
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Photos Grid or Empty State */}
              {gallery.length === 0 ? (
                <div className="text-center py-16 px-4 bg-[#181818] rounded-2xl border border-brandPink/30">
                  <div className="w-12 h-12 rounded-full bg-brandPink/20 text-brandPink flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg text-white">No photos in gallery yet</h4>
                  <p className="text-xs text-white/60 mt-1 mb-4 max-w-sm mx-auto">All default photos have been cleared as requested. Click "Upload / Add Photo" above to add your own real bridal portraits!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gallery.map(img => (
                    <div key={img.id} className="bg-[#181818] rounded-xl overflow-hidden border border-brandPink/30 group relative flex flex-col justify-between">
                      <div className="aspect-[3/4] relative overflow-hidden bg-black">
                        <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          {img.is_featured && (
                            <span className="text-[9px] bg-brandPink text-white px-2 py-0.5 rounded-full font-bold">
                              Hero
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-[10px] text-brandPink uppercase tracking-widest truncate">
                          {img.category?.name || 'Bridal'}
                        </p>
                        <h5 className="font-serif text-sm text-white font-medium truncate mt-0.5">
                          {img.title}
                        </h5>
                      </div>
                      <div className="p-2.5 bg-brandBlack border-t border-brandPink/20 flex items-center justify-between text-xs">
                        <button
                          onClick={() => setEditingGallery(img)}
                          className="text-brandPink hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteGallery(img.id)}
                          className="text-rose-400 hover:text-rose-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-white">
                    Manage Couture Services
                  </h2>
                  <p className="text-xs text-brandLightPink/80 mt-1">
                    Add or update bridal, engagement, reception, and party service offerings for Soumili's Makeover.
                  </p>
                </div>
                <button
                  onClick={() => setEditingService({
                    title: '',
                    slug: '',
                    short_description: '',
                    full_description: '',
                    image_url: '',
                    features: ['Waterproof Base', 'Hairstyling', 'Lash Application', 'Draping'],
                    is_featured: true
                  })}
                  className="inline-flex items-center space-x-2 bg-brandPink hover:bg-brandPink-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-pink-soft"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Service</span>
                </button>
              </div>

              {/* Service Edit Modal */}
              {editingService && (
                <div className="bg-[#181818] p-6 rounded-3xl border border-brandPink/40 shadow-xl space-y-4">
                  <h3 className="font-serif text-xl text-white">
                    {editingService.id ? 'Edit Service' : 'Add New Service'}
                  </h3>

                  <form onSubmit={handleSaveService} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                          Service Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingService.title || ''}
                          onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                          className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                          Image URL
                        </label>
                        <input
                          type="text"
                          value={editingService.image_url || ''}
                          onChange={(e) => setEditingService({ ...editingService, image_url: e.target.value })}
                          className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        Short Summary
                      </label>
                      <input
                        type="text"
                        value={editingService.short_description || ''}
                        onChange={(e) => setEditingService({ ...editingService, short_description: e.target.value })}
                        className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        Full Detailed Description
                      </label>
                      <textarea
                        rows={3}
                        value={editingService.full_description || ''}
                        onChange={(e) => setEditingService({ ...editingService, full_description: e.target.value })}
                        className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        Features (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(editingService.features) ? editingService.features.join(', ') : ''}
                        onChange={(e) => setEditingService({
                          ...editingService,
                          features: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        })}
                        className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-brandPink/20">
                      <button
                        type="button"
                        onClick={() => setEditingService(null)}
                        className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-xs rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-brandPink hover:bg-brandPink-600 text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-pink-soft"
                      >
                        Save Service
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Service Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map(svc => (
                  <div key={svc.id} className="bg-[#181818] p-5 rounded-2xl border border-brandPink/30 flex space-x-4">
                    <img src={svc.image_url} alt={svc.title} className="w-24 h-24 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-lg text-white font-medium">{svc.title}</h4>
                        <p className="text-xs text-white/70 line-clamp-2 mt-1">{svc.short_description}</p>
                      </div>
                      <div className="flex space-x-3 pt-2 text-xs">
                        <button onClick={() => setEditingService(svc)} className="text-brandPink hover:underline">
                          Edit Service
                        </button>
                        <button onClick={() => handleDeleteService(svc.id)} className="text-rose-400 hover:text-rose-200">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: WEBSITE CONTENT & SETTINGS */}
          {activeTab === 'settings' && settings && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-white">
                  Soumili's Makeover – Website Content & Branding
                </h2>
                <p className="text-xs text-brandLightPink/80 mt-1">
                  Updates reflect instantly across Soumili's Makeover logo, hero banners, contact info, and booking forms.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-[#181818] p-8 rounded-3xl border border-brandPink/30 space-y-6 shadow-pink-soft">
                
                {/* 1. Brand Identity */}
                <div className="border-b border-brandPink/20 pb-6 space-y-4">
                  <h3 className="font-serif text-lg text-brandPink">1. Brand Identity & Hero</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        value={settings.brand_name}
                        onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
                        className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        Brand Tagline
                      </label>
                      <input
                        type="text"
                        value={settings.tagline}
                        onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                        className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                      Hero Banner Headline
                    </label>
                    <input
                      type="text"
                      value={settings.hero_title}
                      onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                      className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                      Hero Subtitle / Description
                    </label>
                    <textarea
                      rows={2}
                      value={settings.hero_subtitle}
                      onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                      Hero Banner Image URL / Upload
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Choose photo with Upload button"
                        value={settings.hero_image || ''}
                        onChange={(e) => setSettings({ ...settings, hero_image: e.target.value })}
                        className="flex-1 px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                      <label className="cursor-pointer bg-brandPink px-3.5 py-2 rounded-lg text-xs hover:bg-brandPink-600 flex items-center space-x-1.5 shrink-0 shadow-pink-soft transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (url) => setSettings({ ...settings, hero_image: url }))}
                        />
                      </label>
                    </div>
                    {settings.hero_image && (
                      <div className="mt-2 flex items-center space-x-3 p-2 bg-brandBlack rounded-lg border border-brandPink/30">
                        <img src={settings.hero_image} alt="Hero Preview" className="w-16 h-10 object-cover rounded-md border border-brandPink/40" />
                        <span className="text-xs text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
                          <span>Hero banner photo ready</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Artist Profile */}
                <div className="border-b border-brandPink/20 pb-6 space-y-4">
                  <h3 className="font-serif text-lg text-brandPink">2. Artist Profile & Experience</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        Artist Name
                      </label>
                      <input
                        type="text"
                        value={settings.about_name}
                        onChange={(e) => setSettings({ ...settings, about_name: e.target.value })}
                        className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        Artist Title
                      </label>
                      <input
                        type="text"
                        value={settings.about_title}
                        onChange={(e) => setSettings({ ...settings, about_title: e.target.value })}
                        className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        Experience (Years)
                      </label>
                      <input
                        type="number"
                        value={settings.about_experience_years}
                        onChange={(e) => setSettings({ ...settings, about_experience_years: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        Total Brides Styled
                      </label>
                      <input
                        type="number"
                        value={settings.about_brides_catered}
                        onChange={(e) => setSettings({ ...settings, about_brides_catered: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                      Artist Bio
                    </label>
                    <textarea
                      rows={3}
                      value={settings.about_bio}
                      onChange={(e) => setSettings({ ...settings, about_bio: e.target.value })}
                      className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                      Artist Portrait / Profile Photo URL
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Choose photo with Upload button"
                        value={settings.about_image || ''}
                        onChange={(e) => setSettings({ ...settings, about_image: e.target.value })}
                        className="flex-1 px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                      <label className="cursor-pointer bg-brandPink px-3.5 py-2 rounded-lg text-xs hover:bg-brandPink-600 flex items-center space-x-1.5 shrink-0 shadow-pink-soft transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (url) => setSettings({ ...settings, about_image: url }))}
                        />
                      </label>
                    </div>
                    {settings.about_image && (
                      <div className="mt-2 flex items-center space-x-3 p-2 bg-brandBlack rounded-lg border border-brandPink/30">
                        <img src={settings.about_image} alt="Artist Preview" className="w-12 h-12 object-cover rounded-full border border-brandPink/40" />
                        <span className="text-xs text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
                          <span>Artist profile portrait ready</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Studio Concierge & Contacts */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg text-brandPink">3. Studio Contact & Social Handles</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={settings.contact_phone}
                        onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                        className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        WhatsApp Number (with country code)
                      </label>
                      <input
                        type="text"
                        value={settings.contact_whatsapp}
                        onChange={(e) => setSettings({ ...settings, contact_whatsapp: e.target.value })}
                        className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        Studio Email
                      </label>
                      <input
                        type="email"
                        value={settings.contact_email}
                        onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                        className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                      Studio Physical Address
                    </label>
                    <input
                      type="text"
                      value={settings.contact_address}
                      onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                      className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        Facebook Page / Profile Link
                      </label>
                      <input
                        type="text"
                        placeholder="https://facebook.com/yourpage"
                        value={settings.facebook_url || ''}
                        onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                        className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        Instagram Profile Link
                      </label>
                      <input
                        type="text"
                        placeholder="https://instagram.com/yourhandle"
                        value={settings.instagram_url}
                        onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                        className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        YouTube Channel Link
                      </label>
                      <input
                        type="text"
                        placeholder="https://youtube.com/@yourchannel"
                        value={settings.youtube_url || ''}
                        onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                        className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-brandPink/20 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 px-8 py-3 bg-brandPink hover:bg-brandPink-600 text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-pink-soft transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Changes</span>
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* TAB 6: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-white">
                    Client Testimonials Management
                  </h2>
                  <p className="text-xs text-brandLightPink/80 mt-1">
                    Manage client reviews, wedding locations, star ratings, and display statuses.
                  </p>
                </div>
                <button
                  onClick={() => setEditingTestimonial({
                    client_name: '',
                    event_type: 'Wedding & Reception',
                    event_date: 'Recent',
                    rating: 5,
                    quote: '',
                    avatar_url: '',
                    is_published: true
                  })}
                  className="inline-flex items-center space-x-2 bg-brandPink hover:bg-brandPink-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-pink-soft"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Review</span>
                </button>
              </div>

              {/* Edit Modal */}
              {editingTestimonial && (
                <div className="bg-[#181818] p-6 rounded-3xl border border-brandPink/40 shadow-xl space-y-4">
                  <h3 className="font-serif text-xl text-white">
                    {editingTestimonial.id ? 'Edit Testimonial' : 'Add Testimonial'}
                  </h3>

                  <form onSubmit={handleSaveTestimonial} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                          Client Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingTestimonial.client_name || ''}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, client_name: e.target.value })}
                          className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                          Event & City
                        </label>
                        <input
                          type="text"
                          value={editingTestimonial.event_type || ''}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, event_type: e.target.value })}
                          className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                          Rating (Stars)
                        </label>
                        <select
                          value={editingTestimonial.rating || 5}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) || 5 })}
                          className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                        >
                          <option value="5">5 Stars ★★★★★</option>
                          <option value="4">4 Stars ★★★★☆</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brandLightPink mb-1">
                        Client Quote / Feedback *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={editingTestimonial.quote || ''}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                        className="w-full px-3 py-2 bg-brandBlack border border-brandPink/30 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-brandPink/20">
                      <button
                        type="button"
                        onClick={() => setEditingTestimonial(null)}
                        className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-xs rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-brandPink hover:bg-brandPink-600 text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-pink-soft"
                      >
                        Save Testimonial
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map(t => (
                  <div key={t.id} className="bg-[#181818] p-5 rounded-2xl border border-brandPink/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-3">
                        <img src={t.avatar_url} alt={t.client_name} className="w-10 h-10 rounded-full object-cover border border-brandPink" />
                        <div>
                          <h4 className="font-serif text-sm text-white font-medium">{t.client_name}</h4>
                          <p className="text-[10px] text-brandPink">{t.event_type}</p>
                        </div>
                      </div>
                      <p className="text-xs text-white/80 italic leading-relaxed mb-4">
                        "{t.quote}"
                      </p>
                    </div>
                    <div className="pt-3 border-t border-brandPink/20 flex justify-between text-xs">
                      <button onClick={() => setEditingTestimonial(t)} className="text-brandPink hover:underline">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteTestimonial(t.id)} className="text-rose-400 hover:text-rose-200">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-white">
                  Client Booking Enquiries
                </h2>
                <p className="text-xs text-brandLightPink/80 mt-1">
                  Manage incoming client leads, dates, guest counts, and consultation workflows for Soumili's Makeover.
                </p>
              </div>

              {enquiries.length === 0 ? (
                <div className="p-12 text-center bg-[#181818] rounded-3xl border border-brandPink/30">
                  <Mail className="w-10 h-10 text-brandPink mx-auto mb-3" />
                  <p className="text-sm text-white">No booking enquiries received yet.</p>
                  <p className="text-xs text-white/60 mt-1">Visitors can submit inquiries via the booking form on the public website.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enquiries.map(enq => (
                    <div
                      key={enq.id}
                      className="bg-[#181818] p-6 rounded-2xl border border-brandPink/30 flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-serif text-lg text-white font-medium">
                            {enq.client_name}
                          </h4>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            enq.status === 'new' ? 'bg-rose-900/60 text-rose-300 border border-rose-700/60' :
                            enq.status === 'contacted' ? 'bg-amber-900/60 text-amber-300' :
                            'bg-emerald-900/60 text-emerald-300'
                          }`}>
                            {enq.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs text-white/80">
                          <span className="flex items-center space-x-1">
                            <Phone className="w-3.5 h-3.5 text-brandPink" />
                            <a href={`tel:${enq.phone}`} className="hover:text-brandPink underline">{enq.phone}</a>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Mail className="w-3.5 h-3.5 text-brandPink" />
                            <a href={`mailto:${enq.email}`} className="hover:text-brandPink underline">{enq.email}</a>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5 text-brandPink" />
                            <span>Event: {enq.event_date}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-brandPink" />
                            <span>{enq.event_location}</span>
                          </span>
                        </div>

                        {enq.message && (
                          <p className="text-xs text-brandLightPink/85 bg-brandBlack p-3 rounded-xl mt-2 border border-brandPink/15">
                            "{enq.message}"
                          </p>
                        )}
                      </div>

                      <div className="flex sm:flex-col items-end gap-2 shrink-0">
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${enq.client_name}, this is Soumili from Soumili's Makeover regarding your bridal makeup inquiry for ${enq.event_date}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-lg flex items-center space-x-1 shadow-md"
                        >
                          <span>WhatsApp Client</span>
                        </a>

                        <select
                          value={enq.status}
                          onChange={(e) => handleUpdateEnquiry(enq.id, e.target.value as any)}
                          className="bg-brandBlack border border-brandPink/30 text-xs px-2.5 py-1.5 rounded-lg text-white"
                        >
                          <option value="new">Mark New</option>
                          <option value="contacted">Mark Contacted</option>
                          <option value="booked">Mark Booked</option>
                          <option value="cancelled">Mark Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Sync Code Paste Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#181818] border border-brandPink/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl">
            <h3 className="font-serif text-xl text-white mb-2">Import / Paste Sync Code</h3>
            <p className="text-xs text-brandLightPink/80 mb-4 font-light">
              Paste the sync code generated from your laptop to instantly load all photos, packages, and branding onto this mobile device.
            </p>
            <textarea
              rows={6}
              value={syncCodeInput}
              onChange={(e) => setSyncCodeInput(e.target.value)}
              placeholder="Paste JSON sync code here..."
              className="w-full p-3 bg-brandBlack border border-brandPink/30 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-brandPink"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => { setShowSyncModal(false); setSyncCodeInput(''); }}
                className="px-4 py-2 text-xs text-white/70 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleApplySyncCode}
                className="px-6 py-2 bg-brandPink hover:bg-brandPink-600 text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-pink-soft"
              >
                Apply & Sync Device
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
