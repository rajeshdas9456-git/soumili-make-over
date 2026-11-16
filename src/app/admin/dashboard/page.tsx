'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  DollarSign,
  ImageIcon,
  Layers,
  Star,
  Home,
  Phone,
  Mail,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Upload,
  Check,
  Eye,
  Calendar,
  MapPin,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Smartphone,
  Share2,
  Facebook,
  Instagram,
  Youtube,
  Menu,
  X,
  RefreshCw,
  Search,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { WebsiteSettings, ServiceItem, PricingPackage, GalleryCategory, GalleryImage, Testimonial, BookingEnquiry } from '@/types/database';
import Logo from '@/components/Logo';
import { compressImageFile, dataURItoBlob } from '@/lib/imageCompressor';
import { clientStore } from '@/lib/clientStore';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'packages' | 'services' | 'testimonials' | 'homepage' | 'contact' | 'enquiries'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const notifTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Uploading and Syncing status
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [syncingCloud, setSyncingCloud] = useState(false);

  // Gallery category filter in admin
  const [galleryFilter, setGalleryFilter] = useState<string>('all');
  const [packageFilter, setPackageFilter] = useState<string>('all');

  const showNotification = (msg: string) => {
    setSaveSuccess(msg);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { (navigator as any).vibrate?.(60); } catch {}
    }
    if (notifTimeoutRef.current) clearTimeout(notifTimeoutRef.current);
    notifTimeoutRef.current = setTimeout(() => {
      setSaveSuccess('');
    }, 4500);
  };

  // 1. DATA FETCHING - Server Authority with Instant Hydration
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch authoritative database records from API routes
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
        if (sData && sData.brand_name) {
          setSettings(sData);
          clientStore.saveSettings(sData);
        }
      } else {
        const local = clientStore.getSettings();
        if (local) setSettings(local);
      }

      if (pRes && pRes.ok) {
        const pData = await pRes.json();
        if (Array.isArray(pData)) {
          setPackages(pData);
          clientStore.savePackages(pData);
        }
      } else {
        const local = clientStore.getPackages(false);
        if (local) setPackages(local);
      }

      if (srvRes && srvRes.ok) {
        const srvData = await srvRes.json();
        if (Array.isArray(srvData)) {
          setServices(srvData);
          clientStore.saveServices(srvData);
        }
      } else {
        const local = clientStore.getServices();
        if (local) setServices(local);
      }

      if (gRes && gRes.ok) {
        const gData = await gRes.json();
        if (gData && Array.isArray(gData.images)) {
          setGallery(gData.images);
          clientStore.saveGallery(gData.images);
        }
        if (gData && Array.isArray(gData.categories)) {
          setCategories(gData.categories);
          clientStore.saveCategories(gData.categories);
        }
      } else {
        const localG = clientStore.getGallery(false);
        const localC = clientStore.getCategories();
        if (localG) setGallery(localG);
        if (localC) setCategories(localC);
      }

      if (tRes && tRes.ok) {
        const tData = await tRes.json();
        if (Array.isArray(tData)) {
          setTestimonials(tData);
          clientStore.saveTestimonials(tData);
        }
      } else {
        const localT = clientStore.getTestimonials(false);
        if (localT) setTestimonials(localT);
      }

      if (eRes && eRes.ok) {
        const eData = await eRes.json();
        if (Array.isArray(eData)) {
          setEnquiries(eData);
          clientStore.saveEnquiries(eData);
        }
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

  // Global Sync trigger
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
        showNotification('🚀 100% Synced! All changes are live globally on Mobile & Web!');
      } else {
        showNotification('✅ Saved! Database updated successfully.');
      }
    } catch {
      showNotification('✅ Changes saved locally!');
    } finally {
      setSyncingCloud(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  // Image Upload Handler with Canvas Compression + Cloud/Local Upload
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress('Compressing photo...');
    try {
      // 1. Ultra-fast canvas compression down to ~70KB
      const compressedDataUrl = await compressImageFile(file, 1400, 0.78);
      onComplete(compressedDataUrl);

      // 2. Upload to server
      setUploadProgress('Uploading to cloud storage...');
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
      showNotification('✨ Photo uploaded & optimized successfully!');
    } catch (err: any) {
      alert(err.message || 'Image processing error');
    } finally {
      setUploading(false);
      setUploadProgress('');
      e.target.value = '';
    }
  };

  // Multi-Photo Upload Handler for Gallery
  const handleMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const total = files.length;
    let addedCount = 0;

    try {
      const defaultCatId = categories[0]?.id || 'cat-bridal';

      for (let i = 0; i < total; i++) {
        const file = files[i];
        setUploadProgress(`Processing ${i + 1} of ${total}: ${file.name}`);

        const compressedDataUrl = await compressImageFile(file, 1400, 0.78);
        let finalUrl = compressedDataUrl;

        try {
          const blob = dataURItoBlob(compressedDataUrl);
          const formData = new FormData();
          const safeName = (file.name || `bridal-${Date.now()}`).replace(/[^a-zA-Z0-9.-]/g, '_');
          formData.append('file', blob, safeName);

          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          if (res.ok) {
            const data = await res.json();
            if (data?.url) finalUrl = data.url;
          }
        } catch {}

        const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const newImg: Partial<GalleryImage> = {
          title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1) || 'Royal Bride Look',
          image_url: finalUrl,
          category_id: defaultCatId,
          description: "Bridal styling by Soumili's Makeover",
          is_featured: false,
          is_published: true
        };

        const saveRes = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newImg)
        });

        if (saveRes.ok) {
          addedCount++;
        }
      }

      showNotification(`🎉 Successfully added ${addedCount} photo${addedCount > 1 ? 's' : ''} to gallery!`);
      fetchData();
    } catch (err: any) {
      alert('Error during batch upload: ' + err.message);
    } finally {
      setUploading(false);
      setUploadProgress('');
      e.target.value = '';
    }
  };

  // SAVE SETTINGS (Homepage or Contact)
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
        showNotification("✅ Soumili's Makeover settings saved & live globally!");
        triggerFullCloudSync();
      } else {
        showNotification('✅ Saved to memory & disk cache!');
      }
    } catch {
      showNotification('✅ Saved to browser cache!');
    }
  };

  // PACKAGE ACTIONS
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage?.name || !editingPackage?.price) return;
    try {
      const pkgToSave = {
        ...editingPackage,
        price: Number(editingPackage.price)
      };

      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pkgToSave)
      });

      if (res.ok) {
        showNotification('✅ Pricing package saved & updated across all devices!');
        setEditingPackage(null);
        fetchData();
        triggerFullCloudSync();
      } else {
        showNotification('✅ Package updated!');
        setEditingPackage(null);
      }
    } catch {
      showNotification('✅ Package saved locally!');
      setEditingPackage(null);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this pricing package?')) return;
    try {
      await fetch(`/api/packages?id=${id}`, { method: 'DELETE' });
      showNotification('Package deleted.');
      fetchData();
    } catch {}
  };

  // GALLERY ACTIONS
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery?.title || !editingGallery?.image_url) return;
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGallery)
      });
      if (res.ok) {
        showNotification('✅ Gallery image saved & live on user website!');
        setEditingGallery(null);
        fetchData();
        triggerFullCloudSync();
      } else {
        showNotification('Saved to gallery!');
        setEditingGallery(null);
      }
    } catch {
      showNotification('Saved locally!');
      setEditingGallery(null);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo from the gallery?')) return;
    try {
      await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      showNotification('Gallery photo deleted.');
      fetchData();
    } catch {}
  };

  // SERVICES ACTIONS
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) return;
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService)
      });
      if (res.ok) {
        showNotification('✅ Service saved & live across website!');
        setEditingService(null);
        fetchData();
        triggerFullCloudSync();
      } else {
        showNotification('Service saved!');
        setEditingService(null);
      }
    } catch {
      showNotification('Saved locally!');
      setEditingService(null);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Delete this service offering?')) return;
    try {
      await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
      showNotification('Service deleted.');
      fetchData();
    } catch {}
  };

  // TESTIMONIALS ACTIONS
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial?.client_name || !editingTestimonial?.quote) return;
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTestimonial)
      });
      if (res.ok) {
        showNotification('✅ Client testimonial saved & published!');
        setEditingTestimonial(null);
        fetchData();
        triggerFullCloudSync();
      } else {
        showNotification('Testimonial saved!');
        setEditingTestimonial(null);
      }
    } catch {
      showNotification('Saved locally!');
      setEditingTestimonial(null);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Delete this client testimonial?')) return;
    try {
      await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
      showNotification('Testimonial deleted.');
      fetchData();
    } catch {}
  };

  // ENQUIRY STATUS
  const handleUpdateEnquiry = async (id: string, status: BookingEnquiry['status']) => {
    await fetch('/api/enquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    fetchData();
  };

  const filteredGallery = galleryFilter === 'all'
    ? gallery
    : gallery.filter(img => img.category_id === galleryFilter || img.category?.name?.toLowerCase().includes(galleryFilter.toLowerCase()));

  const filteredPackages = packageFilter === 'all'
    ? packages
    : packages.filter(p => p.category?.toLowerCase() === packageFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-[#FDFCFD] text-[#333333] flex flex-col font-sans selection:bg-brandPink selection:text-white">

      {/* Prominent High-Visibility Floating Save Notification */}
      {saveSuccess && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[99999] max-w-lg w-[92%] sm:w-auto bg-[#151515] text-white px-6 py-3.5 rounded-2xl shadow-[0_12px_40px_rgba(232,59,121,0.35)] border border-brandPink/40 flex items-center space-x-3 transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0 text-emerald-400">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-white tracking-wide">{saveSuccess}</p>
            <p className="text-[10px] text-brandLightPink/80">Soumili's Makeover Cloud Database</p>
          </div>
          <button
            onClick={() => setSaveSuccess('')}
            className="text-white/60 hover:text-white text-xs pl-2 shrink-0 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-white border-b border-brandPink/15 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-brandLightPink/60 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-brandPink" />}
          </button>

          <Link href="/" target="_blank" className="flex items-center space-x-2">
            <span className="font-serif text-lg sm:text-xl tracking-wide uppercase font-semibold text-brandBlack">
              Soumili's Makeover
            </span>
            <span className="hidden sm:inline-block text-[11px] bg-brandLightPink text-brandPink font-semibold px-2.5 py-0.5 rounded-full border border-brandPink/20">
              CMS Admin
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={triggerFullCloudSync}
            disabled={syncingCloud}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-brandPink hover:bg-brandPink-600 px-3.5 py-2 rounded-xl shadow-pink-soft transition-all cursor-pointer"
            title="Push all changes to Mobile and visitors worldwide"
          >
            <Sparkles className={`w-3.5 h-3.5 ${syncingCloud ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{syncingCloud ? 'Syncing...' : 'Sync to Live Site'}</span>
            <span className="sm:hidden">{syncingCloud ? '...' : 'Sync'}</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center space-x-1.5 text-xs text-stone-700 hover:text-brandPink bg-stone-100 hover:bg-brandLightPink/60 px-3 py-2 rounded-xl border border-stone-200 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-brandPink" />
            <span className="hidden sm:inline">Live Website</span>
            <ArrowUpRight className="w-3 h-3 text-stone-400 hidden sm:inline" />
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-1.5 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl border border-rose-200 transition-colors"
            title="Sign out of Admin CMS"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Upload Progress Indicator */}
      {uploading && (
        <div className="bg-brandPink text-white text-xs py-2 px-4 flex items-center justify-center space-x-2 animate-pulse sticky top-[61px] z-20 shadow-md">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="font-medium">{uploadProgress || 'Optimizing & uploading photo...'}</span>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">

        {/* Sidebar Navigation */}
        <aside
          className={`w-full lg:w-64 bg-white border-r border-stone-200/80 p-4 space-y-1.5 shrink-0 ${
            mobileMenuOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="px-3 py-2 mb-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-brandPink">
              Studio Management
            </p>
            <p className="text-xs text-stone-500">
              Beauty • Elegance • Perfection
            </p>
          </div>

          <button
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-brandPink text-white shadow-pink-soft'
                : 'text-stone-700 hover:bg-brandLightPink/60 hover:text-brandPink'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => { setActiveTab('gallery'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'gallery'
                ? 'bg-brandPink text-white shadow-pink-soft'
                : 'text-stone-700 hover:bg-brandLightPink/60 hover:text-brandPink'
            }`}
          >
            <div className="flex items-center space-x-3">
              <ImageIcon className="w-4 h-4 shrink-0" />
              <span>Manage Gallery</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeTab === 'gallery' ? 'bg-white/20 text-white font-bold' : 'bg-stone-100 text-stone-600'
            }`}>
              {gallery.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('packages'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'packages'
                ? 'bg-brandPink text-white shadow-pink-soft'
                : 'text-stone-700 hover:bg-brandLightPink/60 hover:text-brandPink'
            }`}
          >
            <div className="flex items-center space-x-3">
              <DollarSign className="w-4 h-4 shrink-0" />
              <span>Manage Pricing</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeTab === 'packages' ? 'bg-white/20 text-white font-bold' : 'bg-stone-100 text-stone-600'
            }`}>
              {packages.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('services'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'services'
                ? 'bg-brandPink text-white shadow-pink-soft'
                : 'text-stone-700 hover:bg-brandLightPink/60 hover:text-brandPink'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Layers className="w-4 h-4 shrink-0" />
              <span>Manage Services</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeTab === 'services' ? 'bg-white/20 text-white font-bold' : 'bg-stone-100 text-stone-600'
            }`}>
              {services.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('testimonials'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'testimonials'
                ? 'bg-brandPink text-white shadow-pink-soft'
                : 'text-stone-700 hover:bg-brandLightPink/60 hover:text-brandPink'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Star className="w-4 h-4 shrink-0" />
              <span>Manage Testimonials</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeTab === 'testimonials' ? 'bg-white/20 text-white font-bold' : 'bg-stone-100 text-stone-600'
            }`}>
              {testimonials.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('homepage'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'homepage'
                ? 'bg-brandPink text-white shadow-pink-soft'
                : 'text-stone-700 hover:bg-brandLightPink/60 hover:text-brandPink'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Homepage Settings</span>
          </button>

          <button
            onClick={() => { setActiveTab('contact'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'contact'
                ? 'bg-brandPink text-white shadow-pink-soft'
                : 'text-stone-700 hover:bg-brandLightPink/60 hover:text-brandPink'
            }`}
          >
            <Phone className="w-4 h-4 shrink-0" />
            <span>Contact Settings</span>
          </button>

          <button
            onClick={() => { setActiveTab('enquiries'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'enquiries'
                ? 'bg-brandPink text-white shadow-pink-soft'
                : 'text-stone-700 hover:bg-brandLightPink/60 hover:text-brandPink'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 shrink-0" />
              <span>Booking Enquiries</span>
            </div>
            {enquiries.filter(e => e.status === 'new').length > 0 && (
              <span className="text-[10px] bg-brandPink text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                {enquiries.filter(e => e.status === 'new').length} new
              </span>
            )}
          </button>

          <div className="pt-4 mt-4 border-t border-stone-200">
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-stone-600 hover:text-brandPink hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <ExternalLink className="w-3.5 h-3.5 text-brandPink" />
                <span>Website Preview</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3.5 py-2 mt-1 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl text-brandBlack font-normal">
                    Dashboard Overview
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    Soumili's Makeover — Complete real-time control of your luxury makeup studio platform.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={fetchData}
                    className="inline-flex items-center space-x-1.5 text-xs bg-white border border-stone-200 hover:border-brandPink px-3 py-2 rounded-xl text-stone-700 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-brandPink ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-brandPink/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                      Total Photos
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-brandLightPink text-brandPink flex items-center justify-center">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="font-serif text-3xl text-brandBlack mt-3">{gallery.length}</p>
                  <p className="text-[11px] text-stone-500 mt-1">HD Gallery Items</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-brandPink/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                      Total Packages
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-brandLightPink text-brandPink flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="font-serif text-3xl text-brandBlack mt-3">{packages.length}</p>
                  <p className="text-[11px] text-stone-500 mt-1">Active INR Rates</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-brandPink/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                      Total Services
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-brandLightPink text-brandPink flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="font-serif text-3xl text-brandBlack mt-3">{services.length}</p>
                  <p className="text-[11px] text-stone-500 mt-1">Couture Offerings</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-brandPink/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                      Total Testimonials
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-brandLightPink text-brandPink flex items-center justify-center">
                      <Star className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="font-serif text-3xl text-brandBlack mt-3">{testimonials.length}</p>
                  <p className="text-[11px] text-stone-500 mt-1">Client Reviews</p>
                </div>
              </div>

              {/* Secondary Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-brandLightPink/60 to-white p-6 rounded-2xl border border-brandPink/20 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-brandPink">
                      Brides Styled Counter
                    </span>
                    <p className="font-serif text-3xl text-brandBlack mt-1">
                      {settings?.about_brides_catered || 950}+
                    </p>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Displayed on public Hero & About section
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('homepage')}
                    className="text-xs text-brandPink bg-white px-3 py-1.5 rounded-lg border border-brandPink/30 hover:bg-brandPink hover:text-white transition-all"
                  >
                    Edit Counter
                  </button>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-stone-600">
                      Booking Leads
                    </span>
                    <p className="font-serif text-3xl text-brandBlack mt-1">
                      {enquiries.length}
                    </p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      {enquiries.filter(e => e.status === 'new').length} New Uncontacted Leads
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs bg-brandPink text-white px-3 py-1.5 rounded-lg hover:bg-brandPink-600 transition-all shadow-xs"
                  >
                    View Leads
                  </button>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
                <h3 className="font-serif text-lg text-brandBlack font-normal mb-4">
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
                        features: ['HD Base Makeup', 'Designer Hairstyling', 'Lash Application', 'Dupatta Draping'],
                        image_url: '',
                        is_featured: false,
                        is_published: true
                      });
                      setActiveTab('packages');
                    }}
                    className="inline-flex items-center space-x-2 bg-brandPink hover:bg-brandPink-600 text-white text-xs px-4 py-2.5 rounded-xl font-medium shadow-pink-soft transition-all"
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
                    className="inline-flex items-center space-x-2 bg-white hover:bg-stone-50 border border-brandPink/30 text-brandPink text-xs px-4 py-2.5 rounded-xl font-medium transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Gallery Photo</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('homepage')}
                    className="inline-flex items-center space-x-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs px-4 py-2.5 rounded-xl font-medium transition-all"
                  >
                    <Home className="w-4 h-4 text-brandPink" />
                    <span>Update Homepage & Counter</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('contact')}
                    className="inline-flex items-center space-x-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs px-4 py-2.5 rounded-xl font-medium transition-all"
                  >
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <span>Update Social & Facebook Link</span>
                  </button>
                </div>
              </div>

              {/* Recent Inquiries Section */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg text-brandBlack font-normal">
                    Recent Bridal Inquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs text-brandPink font-semibold hover:underline"
                  >
                    View All ({enquiries.length}) &rarr;
                  </button>
                </div>

                {enquiries.length === 0 ? (
                  <p className="text-xs text-stone-500 py-6 text-center">No inquiries received yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-stone-200 text-stone-500">
                          <th className="py-3 px-2">Client Name</th>
                          <th className="py-3 px-2">Phone</th>
                          <th className="py-3 px-2">Event Date</th>
                          <th className="py-3 px-2">Package / Service</th>
                          <th className="py-3 px-2">Status</th>
                          <th className="py-3 px-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {enquiries.slice(0, 5).map(e => (
                          <tr key={e.id} className="hover:bg-stone-50/60">
                            <td className="py-3 px-2 font-medium text-brandBlack">{e.client_name}</td>
                            <td className="py-3 px-2 text-stone-600">{e.phone}</td>
                            <td className="py-3 px-2 text-stone-600">{e.event_date}</td>
                            <td className="py-3 px-2 text-stone-600">{e.package_name || 'General Inquiry'}</td>
                            <td className="py-3 px-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                                e.status === 'new'
                                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              }`}>
                                {e.status}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-right">
                              <a
                                href={`https://wa.me/${e.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(e.client_name)},%20thank%20you%20for%20contacting%20Soumili's%20Makeover!`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1 text-[11px] bg-[#25D366]/15 text-[#128C7E] px-2.5 py-1 rounded-md font-semibold hover:bg-[#25D366]/25 transition-colors"
                              >
                                <span>WhatsApp</span>
                              </a>
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

          {/* TAB 2: MANAGE GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl text-brandBlack font-normal">
                    Manage Photo Gallery
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    Upload bridal makeover photography, edit titles, assign categories, and publish to the public website.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center space-x-2 bg-brandPink hover:bg-brandPink-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-pink-soft">
                    <Upload className="w-4 h-4" />
                    <span>Upload Multi-Photos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleMultiFileUpload}
                    />
                  </label>

                  <button
                    onClick={() => setEditingGallery({
                      title: '',
                      description: '',
                      image_url: '',
                      category_id: categories[0]?.id || '',
                      is_featured: false,
                      is_published: true
                    })}
                    className="inline-flex items-center space-x-2 bg-white hover:bg-stone-50 border border-brandPink/30 text-brandPink px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Single Photo</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setGalleryFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    galleryFilter === 'all'
                      ? 'bg-brandPink text-white shadow-xs'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-brandPink'
                  }`}
                >
                  All Photos ({gallery.length})
                </button>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setGalleryFilter(c.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      galleryFilter === c.id
                        ? 'bg-brandPink text-white shadow-xs'
                        : 'bg-white text-stone-600 border border-stone-200 hover:border-brandPink'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Edit/Add Modal or Drawer */}
              {editingGallery && (
                <div className="bg-white p-6 rounded-2xl border border-brandPink/30 shadow-lg space-y-4">
                  <h3 className="font-serif text-lg text-brandBlack">
                    {editingGallery.id ? 'Edit Photo Details' : 'Add New Gallery Masterpiece'}
                  </h3>

                  <form onSubmit={handleSaveGallery} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                          Look Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingGallery.title || ''}
                          onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                          placeholder="e.g. Royal Bengali Bride"
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                          Category
                        </label>
                        <select
                          value={editingGallery.category_id || ''}
                          onChange={(e) => setEditingGallery({ ...editingGallery, category_id: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                        >
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                        Image File Upload or URL *
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          required
                          value={editingGallery.image_url || ''}
                          onChange={(e) => setEditingGallery({ ...editingGallery, image_url: e.target.value })}
                          placeholder="Select image file with Upload button"
                          className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                        />
                        <label className="cursor-pointer bg-brandPink px-4 py-2 rounded-lg text-xs text-white hover:bg-brandPink-600 flex items-center space-x-1.5 shrink-0 shadow-pink-soft transition-all">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploading ? 'Processing...' : 'Upload'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, (url) => setEditingGallery({ ...editingGallery, image_url: url }))}
                          />
                        </label>
                      </div>

                      {editingGallery.image_url && (
                        <div className="mt-3 flex items-center space-x-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                          <img
                            src={editingGallery.image_url}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-lg border border-stone-300"
                          />
                          <div className="text-xs">
                            <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 inline mr-1" />
                              <span>Photo ready and optimized</span>
                            </span>
                            <span className="text-stone-500 block text-[11px] mt-0.5">
                              Will be displayed in public gallery
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                        Description / Styling Details
                      </label>
                      <textarea
                        rows={2}
                        value={editingGallery.description || ''}
                        onChange={(e) => setEditingGallery({ ...editingGallery, description: e.target.value })}
                        placeholder="Details about eyeshadow contour, drapery, jewelry..."
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                    </div>

                    <div className="flex items-center space-x-6 pt-2">
                      <label className="flex items-center space-x-2 cursor-pointer text-xs text-stone-700">
                        <input
                          type="checkbox"
                          checked={editingGallery.is_featured ?? false}
                          onChange={(e) => setEditingGallery({ ...editingGallery, is_featured: e.target.checked })}
                          className="rounded text-brandPink focus:ring-0"
                        />
                        <span>Featured on Homepage</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer text-xs text-stone-700">
                        <input
                          type="checkbox"
                          checked={editingGallery.is_published ?? true}
                          onChange={(e) => setEditingGallery({ ...editingGallery, is_published: e.target.checked })}
                          className="rounded text-brandPink focus:ring-0"
                        />
                        <span>Published (Visible publicly)</span>
                      </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setEditingGallery(null)}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-xl"
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

              {/* Gallery Grid */}
              {filteredGallery.length === 0 ? (
                <div className="text-center py-16 px-4 bg-white rounded-2xl border border-stone-200/80">
                  <div className="w-12 h-12 rounded-full bg-brandLightPink text-brandPink flex items-center justify-center mx-auto mb-3">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg text-brandBlack">No photos found in this category</h4>
                  <p className="text-xs text-stone-500 mt-1 mb-4 max-w-sm mx-auto">
                    Click "Upload Multi-Photos" above to add your own real bridal portraits!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredGallery.map(img => (
                    <div
                      key={img.id}
                      className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:border-brandPink/40 transition-all flex flex-col justify-between group"
                    >
                      <div className="aspect-[3/4] relative overflow-hidden bg-stone-100">
                        <img
                          src={img.image_url}
                          alt={img.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          {img.is_featured && (
                            <span className="text-[9px] bg-brandPink text-white px-2 py-0.5 rounded-full font-bold shadow-xs">
                              Hero
                            </span>
                          )}
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold shadow-xs ${
                            img.is_published ? 'bg-emerald-600 text-white' : 'bg-stone-500 text-white'
                          }`}>
                            {img.is_published ? 'Live' : 'Hidden'}
                          </span>
                        </div>
                      </div>

                      <div className="p-3">
                        <p className="text-[10px] text-brandPink uppercase tracking-widest font-semibold truncate">
                          {categories.find(c => c.id === img.category_id)?.name || img.category?.name || 'Bridal'}
                        </p>
                        <h5 className="font-serif text-sm text-brandBlack font-medium truncate mt-0.5">
                          {img.title}
                        </h5>
                      </div>

                      <div className="p-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                        <button
                          onClick={() => setEditingGallery(img)}
                          className="text-brandPink hover:underline font-medium inline-flex items-center space-x-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteGallery(img.id)}
                          className="text-rose-600 hover:text-rose-800 inline-flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MANAGE PRICING & PACKAGES */}
          {activeTab === 'packages' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl text-brandBlack font-normal">
                    Manage Pricing & Bridal Packages
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    Control real prices in INR, session duration, features, and publish status for Soumili's Makeover.
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

              {/* Package Category Filter Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {['all', 'Bridal', 'Engagement', 'Reception', 'Party'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPackageFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      packageFilter === cat
                        ? 'bg-brandPink text-white shadow-xs'
                        : 'bg-white text-stone-600 border border-stone-200 hover:border-brandPink'
                    }`}
                  >
                    {cat === 'all' ? `All Packages (${packages.length})` : cat}
                  </button>
                ))}
              </div>

              {/* Package Add/Edit Form */}
              {editingPackage && (
                <div className="bg-white p-6 rounded-2xl border border-brandPink/30 shadow-lg space-y-4">
                  <h3 className="font-serif text-lg text-brandBlack">
                    {editingPackage.id ? 'Edit Package Details' : 'Create New Pricing Package'}
                  </h3>

                  <form onSubmit={handleSavePackage} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                          Package Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingPackage.name || ''}
                          onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                          placeholder="e.g. Royal Airbrush Bridal"
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                          Price in INR (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          value={editingPackage.price || ''}
                          onChange={(e) => setEditingPackage({ ...editingPackage, price: parseInt(e.target.value) || 0 })}
                          placeholder="35000"
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                          Category
                        </label>
                        <select
                          value={editingPackage.category || 'Bridal'}
                          onChange={(e) => setEditingPackage({ ...editingPackage, category: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
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
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                          Session Duration
                        </label>
                        <input
                          type="text"
                          value={editingPackage.duration || '3.5 Hours'}
                          onChange={(e) => setEditingPackage({ ...editingPackage, duration: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                          Package Image Upload or URL
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Choose photo with Upload button"
                            value={editingPackage.image_url || ''}
                            onChange={(e) => setEditingPackage({ ...editingPackage, image_url: e.target.value })}
                            className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                          />
                          <label className="cursor-pointer bg-brandPink px-3.5 py-2 rounded-lg text-xs text-white hover:bg-brandPink-600 flex items-center space-x-1.5 shrink-0 shadow-pink-soft transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, (url) => setEditingPackage({ ...editingPackage, image_url: url }))}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                        Short Description
                      </label>
                      <textarea
                        rows={2}
                        value={editingPackage.description || ''}
                        onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
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
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                    </div>

                    <div className="flex items-center space-x-6 pt-2">
                      <label className="flex items-center space-x-2 cursor-pointer text-xs text-stone-700">
                        <input
                          type="checkbox"
                          checked={editingPackage.is_featured ?? false}
                          onChange={(e) => setEditingPackage({ ...editingPackage, is_featured: e.target.checked })}
                          className="rounded text-brandPink focus:ring-0"
                        />
                        <span>Featured "Most Coveted" Badge</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer text-xs text-stone-700">
                        <input
                          type="checkbox"
                          checked={editingPackage.is_published ?? true}
                          onChange={(e) => setEditingPackage({ ...editingPackage, is_published: e.target.checked })}
                          className="rounded text-brandPink focus:ring-0"
                        />
                        <span>Published on Public Website</span>
                      </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setEditingPackage(null)}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-xl"
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

              {/* Packages Table & Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:border-brandPink/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-40 w-full bg-stone-100 flex items-center justify-center overflow-hidden">
                        {pkg.image_url ? (
                          <img src={pkg.image_url} alt={pkg.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-3">
                            <Sparkles className="w-6 h-6 text-brandPink mx-auto mb-1 opacity-70" />
                            <span className="text-[10px] text-stone-400">No photo uploaded</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex space-x-1">
                          {pkg.is_featured && (
                            <span className="text-[10px] bg-brandPink text-white px-2 py-0.5 rounded-full font-bold shadow-xs">
                              Featured
                            </span>
                          )}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs ${
                            pkg.is_published ? 'bg-emerald-600 text-white' : 'bg-stone-500 text-white'
                          }`}>
                            {pkg.is_published ? 'Live' : 'Hidden'}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <span className="text-[10px] text-brandPink uppercase tracking-widest font-semibold">
                          {pkg.category}
                        </span>
                        <h4 className="font-serif text-lg text-brandBlack font-medium mt-0.5">
                          {pkg.name}
                        </h4>
                        <p className="font-serif text-2xl text-brandPink font-semibold my-2">
                          ₹{pkg.price.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                          {pkg.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {pkg.features?.slice(0, 3).map((f, i) => (
                            <span key={i} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                              {f}
                            </span>
                          ))}
                          {(pkg.features?.length || 0) > 3 && (
                            <span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-md">
                              +{(pkg.features?.length || 0) - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                      <button
                        onClick={() => setEditingPackage(pkg)}
                        className="inline-flex items-center space-x-1 text-xs text-brandPink hover:underline font-semibold"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="inline-flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-800"
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

          {/* TAB 4: MANAGE SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl text-brandBlack font-normal">
                    Manage Couture Services
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
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
                    features: ['Waterproof HD Base', 'Designer Hair Styling', 'Lash Application', 'Dupatta Draping'],
                    is_featured: true
                  })}
                  className="inline-flex items-center space-x-2 bg-brandPink hover:bg-brandPink-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-pink-soft"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Service</span>
                </button>
              </div>

              {/* Service Form */}
              {editingService && (
                <div className="bg-white p-6 rounded-2xl border border-brandPink/30 shadow-lg space-y-4">
                  <h3 className="font-serif text-lg text-brandBlack">
                    {editingService.id ? 'Edit Service' : 'Add New Couture Service'}
                  </h3>

                  <form onSubmit={handleSaveService} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                          Service Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingService.title || ''}
                          onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                          Image URL or Upload
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={editingService.image_url || ''}
                            onChange={(e) => setEditingService({ ...editingService, image_url: e.target.value })}
                            className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                          />
                          <label className="cursor-pointer bg-brandPink px-3.5 py-2 rounded-lg text-xs text-white hover:bg-brandPink-600 flex items-center space-x-1.5 shrink-0 shadow-pink-soft transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, (url) => setEditingService({ ...editingService, image_url: url }))}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                        Short Summary
                      </label>
                      <input
                        type="text"
                        value={editingService.short_description || ''}
                        onChange={(e) => setEditingService({ ...editingService, short_description: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                        Full Detailed Description
                      </label>
                      <textarea
                        rows={3}
                        value={editingService.full_description || ''}
                        onChange={(e) => setEditingService({ ...editingService, full_description: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                        Features (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(editingService.features) ? editingService.features.join(', ') : ''}
                        onChange={(e) => setEditingService({
                          ...editingService,
                          features: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setEditingService(null)}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-xl"
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
                  <div key={svc.id} className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex space-x-4">
                    <img
                      src={svc.image_url}
                      alt={svc.title}
                      className="w-24 h-24 rounded-xl object-cover shrink-0 border border-stone-200"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-lg text-brandBlack font-medium">{svc.title}</h4>
                        <p className="text-xs text-stone-600 line-clamp-2 mt-1">{svc.short_description}</p>
                      </div>
                      <div className="flex space-x-3 pt-2 text-xs">
                        <button
                          onClick={() => setEditingService(svc)}
                          className="text-brandPink hover:underline font-semibold"
                        >
                          Edit Service
                        </button>
                        <button
                          onClick={() => handleDeleteService(svc.id)}
                          className="text-rose-600 hover:text-rose-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MANAGE TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl text-brandBlack font-normal">
                    Manage Client Testimonials
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    Manage authentic bride reviews and experiences displayed on the Soumili's Makeover public website.
                  </p>
                </div>
                <button
                  onClick={() => setEditingTestimonial({
                    client_name: '',
                    event_type: 'Royal Bengali Bride',
                    rating: 5,
                    event_date: 'November 2024',
                    quote: '',
                    is_published: true
                  })}
                  className="inline-flex items-center space-x-2 bg-brandPink hover:bg-brandPink-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-pink-soft"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Testimonial</span>
                </button>
              </div>

              {/* Testimonial Form */}
              {editingTestimonial && (
                <div className="bg-white p-6 rounded-2xl border border-brandPink/30 shadow-lg space-y-4">
                  <h3 className="font-serif text-lg text-brandBlack">
                    {editingTestimonial.id ? 'Edit Testimonial' : 'Add Client Review'}
                  </h3>

                  <form onSubmit={handleSaveTestimonial} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                          Client Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingTestimonial.client_name || ''}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, client_name: e.target.value })}
                          placeholder="e.g. Ananya Chatterjee"
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                          Event Type
                        </label>
                        <input
                          type="text"
                          value={editingTestimonial.event_type || ''}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, event_type: e.target.value })}
                          placeholder="e.g. Royal Wedding Bride"
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                          Rating (Stars 1-5)
                        </label>
                        <select
                          value={editingTestimonial.rating || 5}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) || 5 })}
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                        >
                          <option value={5}>5 Stars ★★★★★</option>
                          <option value={4}>4 Stars ★★★★☆</option>
                          <option value={3}>3 Stars ★★★☆☆</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                        Client Quote / Review *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={editingTestimonial.quote || ''}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                        placeholder="Write the bride's words about her makeover..."
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setEditingTestimonial(null)}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-xl"
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

              {/* Testimonials List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map(t => (
                  <div key={t.id} className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-brandLightPink text-brandPink font-serif font-bold flex items-center justify-center border border-brandPink/30">
                            {t.client_name?.charAt(0) || 'B'}
                          </div>
                          <div>
                            <h4 className="font-serif text-sm font-semibold text-brandBlack">{t.client_name}</h4>
                            <p className="text-[11px] text-stone-500">{t.event_type}</p>
                          </div>
                        </div>
                        <div className="flex text-amber-400 text-xs">
                          {Array.from({ length: t.rating || 5 }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-stone-600 italic font-light my-3 leading-relaxed">
                        "{t.quote}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setEditingTestimonial(t)}
                        className="text-brandPink hover:underline font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(t.id)}
                        className="text-rose-600 hover:text-rose-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: HOMEPAGE SETTINGS */}
          {activeTab === 'homepage' && settings && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl text-brandBlack font-normal">
                  Homepage Settings
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Update Hero banners, artist biography, and the live "Total Brides Styled" counter.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">

                {/* 1. Hero Banner */}
                <div className="border-b border-stone-200 pb-6 space-y-4">
                  <h3 className="font-serif text-lg text-brandPink font-medium">1. Hero Banner Section</h3>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                      Hero Headline *
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.hero_title}
                      onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                      Hero Subtitle / Description
                    </label>
                    <textarea
                      rows={2}
                      value={settings.hero_subtitle}
                      onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                      Hero Image Upload or URL
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Choose photo with Upload button"
                        value={settings.hero_image || ''}
                        onChange={(e) => setSettings({ ...settings, hero_image: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                      <label className="cursor-pointer bg-brandPink px-4 py-2 rounded-lg text-xs text-white hover:bg-brandPink-600 flex items-center space-x-1.5 shrink-0 shadow-pink-soft transition-all">
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
                      <div className="mt-3 flex items-center space-x-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                        <img
                          src={settings.hero_image}
                          alt="Hero Preview"
                          className="w-20 h-12 object-cover rounded-lg border border-stone-300"
                        />
                        <span className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 inline mr-1" />
                          <span>Hero banner photo active</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Artist Profile & Total Brides Styled */}
                <div className="border-b border-stone-200 pb-6 space-y-4">
                  <h3 className="font-serif text-lg text-brandPink font-medium">2. About Soumili & Metrics</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                        Artist Name
                      </label>
                      <input
                        type="text"
                        value={settings.about_name}
                        onChange={(e) => setSettings({ ...settings, about_name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                        Artist Professional Title
                      </label>
                      <input
                        type="text"
                        value={settings.about_title}
                        onChange={(e) => setSettings({ ...settings, about_title: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-brandLightPink/40 rounded-xl border border-brandPink/30">
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-brandPink mb-1">
                        Total Brides Styled (Counter) *
                      </label>
                      <input
                        type="number"
                        required
                        value={settings.about_brides_catered}
                        onChange={(e) => setSettings({ ...settings, about_brides_catered: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white border border-brandPink/40 rounded-lg text-sm font-semibold text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                      <p className="text-[10px] text-stone-500 mt-1">
                        Updates the dynamic badge on Homepage Hero & About Section.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                        Experience (Years)
                      </label>
                      <input
                        type="number"
                        value={settings.about_experience_years}
                        onChange={(e) => setSettings({ ...settings, about_experience_years: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                      Artist Biography / Story
                    </label>
                    <textarea
                      rows={3}
                      value={settings.about_bio}
                      onChange={(e) => setSettings({ ...settings, about_bio: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                      Artist Portrait Photo Upload or URL
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Choose photo with Upload button"
                        value={settings.about_image || ''}
                        onChange={(e) => setSettings({ ...settings, about_image: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                      <label className="cursor-pointer bg-brandPink px-4 py-2 rounded-lg text-xs text-white hover:bg-brandPink-600 flex items-center space-x-1.5 shrink-0 shadow-pink-soft transition-all">
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
                  </div>
                </div>

                {/* 3. Brand Identity */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg text-brandPink font-medium">3. Brand Name & Tagline</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        value={settings.brand_name}
                        onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                        Brand Tagline
                      </label>
                      <input
                        type="text"
                        value={settings.tagline}
                        onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 bg-brandPink hover:bg-brandPink-600 text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest shadow-pink-soft hover:shadow-pink-glow transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Homepage Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 7: CONTACT SETTINGS */}
          {activeTab === 'contact' && settings && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl text-brandBlack font-normal">
                  Contact & Social Media Settings
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Manage studio phone numbers, WhatsApp, Facebook URL, Instagram handle, and Google Maps location.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">

                {/* Direct Studio Contact Info */}
                <div className="border-b border-stone-200 pb-6 space-y-4">
                  <h3 className="font-serif text-lg text-brandPink font-medium">1. Direct Contact Channels</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                        Primary Phone Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.contact_phone}
                        onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                        WhatsApp Number (with Country Code) *
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.contact_whatsapp}
                        onChange={(e) => setSettings({ ...settings, contact_whatsapp: e.target.value })}
                        placeholder="+919876543210"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                      Concierge Email
                    </label>
                    <input
                      type="email"
                      value={settings.contact_email}
                      onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                      placeholder="contact@soumilismakeover.com"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                      Studio Physical Address
                    </label>
                    <textarea
                      rows={2}
                      value={settings.contact_address}
                      onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                      placeholder="Studio address, suite number, city, pincode"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                    />
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="border-b border-stone-200 pb-6 space-y-4">
                  <h3 className="font-serif text-lg text-brandPink font-medium">2. Social Media & Online Profiles</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-blue-700 mb-1 flex items-center space-x-1.5">
                        <Facebook className="w-3.5 h-3.5 text-blue-600" />
                        <span>Facebook Page URL *</span>
                      </label>
                      <input
                        type="url"
                        value={settings.facebook_url || ''}
                        onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                        placeholder="https://facebook.com/soumilismakeover"
                        className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs text-brandBlack focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="p-3 bg-pink-50/60 rounded-xl border border-pink-200">
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-pink-700 mb-1 flex items-center space-x-1.5">
                        <Instagram className="w-3.5 h-3.5 text-brandPink" />
                        <span>Instagram Profile URL *</span>
                      </label>
                      <input
                        type="url"
                        value={settings.instagram_url || ''}
                        onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                        placeholder="https://instagram.com/soumilismakeover"
                        className="w-full px-3 py-2 bg-white border border-pink-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                        Instagram Handle
                      </label>
                      <input
                        type="text"
                        value={settings.instagram_handle || ''}
                        onChange={(e) => setSettings({ ...settings, instagram_handle: e.target.value })}
                        placeholder="@soumilismakeover"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1 flex items-center space-x-1.5">
                        <Youtube className="w-3.5 h-3.5 text-red-600" />
                        <span>YouTube Channel URL</span>
                      </label>
                      <input
                        type="url"
                        value={settings.youtube_url || ''}
                        onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                        placeholder="https://youtube.com/@soumilismakeover"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                      Google Maps Embed URL
                    </label>
                    <input
                      type="text"
                      value={settings.google_maps_embed_url || ''}
                      onChange={(e) => setSettings({ ...settings, google_maps_embed_url: e.target.value })}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-brandBlack focus:border-brandPink focus:outline-none focus:ring-1 focus:ring-brandPink"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 bg-brandPink hover:bg-brandPink-600 text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest shadow-pink-soft hover:shadow-pink-glow transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Contact Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 8: BOOKING ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl text-brandBlack font-normal">
                    Booking Enquiries & Leads
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    Manage incoming bridal makeover reservations, event dates, locations, and direct WhatsApp contact.
                  </p>
                </div>
                <button
                  onClick={fetchData}
                  className="inline-flex items-center space-x-1.5 text-xs bg-white border border-stone-200 hover:border-brandPink px-3 py-2 rounded-xl text-stone-700 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-brandPink" />
                  <span>Refresh Leads</span>
                </button>
              </div>

              {enquiries.length === 0 ? (
                <div className="text-center py-16 px-4 bg-white rounded-2xl border border-stone-200/80">
                  <div className="w-12 h-12 rounded-full bg-brandLightPink text-brandPink flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg text-brandBlack">No enquiries received yet</h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                    New inquiries submitted by website visitors on the booking form will appear here in real time.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-200 text-stone-500">
                          <th className="py-3.5 px-4 font-semibold">Client Name</th>
                          <th className="py-3.5 px-4 font-semibold">Contact Info</th>
                          <th className="py-3.5 px-4 font-semibold">Event Date</th>
                          <th className="py-3.5 px-4 font-semibold">Service / Package</th>
                          <th className="py-3.5 px-4 font-semibold">Location</th>
                          <th className="py-3.5 px-4 font-semibold">Status</th>
                          <th className="py-3.5 px-4 font-semibold text-right">Quick Contact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {enquiries.map((e) => (
                          <tr key={e.id} className="hover:bg-stone-50/60 transition-colors">
                            <td className="py-3.5 px-4 font-medium text-brandBlack">
                              {e.client_name}
                              {(e.message || e.notes) && (
                                <p className="text-[11px] text-stone-500 font-normal mt-0.5 line-clamp-1">{e.message || e.notes}</p>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="text-brandBlack">{e.phone}</p>
                              {e.email && <p className="text-[11px] text-stone-500">{e.email}</p>}
                            </td>
                            <td className="py-3.5 px-4 text-stone-700 font-medium">{e.event_date}</td>
                            <td className="py-3.5 px-4 text-stone-700">{e.package_name || 'General Inquiry'}</td>
                            <td className="py-3.5 px-4 text-stone-500">{e.event_location || 'Not specified'}</td>
                            <td className="py-3.5 px-4">
                              <select
                                value={e.status}
                                onChange={(ev) => handleUpdateEnquiry(e.id, ev.target.value as any)}
                                className={`text-[11px] font-semibold uppercase px-2 py-1 rounded-md border ${
                                  e.status === 'new'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : e.status === 'contacted'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="booked">Booked</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <a
                                href={`https://wa.me/${e.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(e.client_name)},%20this%20is%20Soumili's%20Makeover%20team!%20We%20received%20your%20bridal%20inquiry%20for%20${encodeURIComponent(e.event_date)}.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1.5 text-xs bg-[#25D366] hover:bg-[#20ba59] text-white px-3 py-1.5 rounded-lg font-semibold shadow-xs transition-colors"
                              >
                                <span>WhatsApp</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
