'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Phone, Mail, MapPin, Sparkles } from 'lucide-react';
import { WebsiteSettings, ServiceItem } from '@/types/database';
import { clientStore } from '@/lib/clientStore';

export default function ContactBookingSection({
  settings,
  services,
  defaultPackage = ''
}: {
  settings: WebsiteSettings;
  services: ServiceItem[];
  defaultPackage?: string;
}) {
  const [formData, setFormData] = useState({
    client_name: '',
    phone: '',
    email: '',
    service_id: '',
    package_name: defaultPackage,
    event_date: '',
    event_location: '',
    guest_count: 1,
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error('Failed to submit appointment request');
      }

      try {
        clientStore.addEnquiry({
          id: `enq-${Date.now()}`,
          client_name: formData.client_name,
          phone: formData.phone,
          email: formData.email,
          service_id: formData.service_id,
          package_name: formData.package_name,
          event_date: formData.event_date,
          event_location: formData.event_location,
          guest_count: formData.guest_count,
          message: formData.message,
          status: 'new',
          created_at: new Date().toISOString()
        });
      } catch {}

      setSuccess(true);
      setFormData({
        client_name: '',
        phone: '',
        email: '',
        service_id: '',
        package_name: '',
        event_date: '',
        event_location: '',
        guest_count: 1,
        message: ''
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred while booking. Please try WhatsApp directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="book" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-brandPink font-semibold tracking-[0.25em] text-xs uppercase mb-3">
            Reserve Your Wedding Date
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brandBlack font-normal mb-4">
            Connect & Book Your Consultation
          </h2>
          <p className="text-brandBlack/70 text-sm sm:text-base font-light">
            Due to high demand during peak wedding seasons, Soumili's Makeover accepts a limited number of brides per date to provide our undivided couture attention.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Contact Cards & Studio Info */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-brandBlack text-white p-8 rounded-3xl shadow-xl border border-brandPink/30 space-y-6">
              <div>
                <span className="text-[10px] text-brandPink font-semibold uppercase tracking-widest">
                  VIP Concierge
                </span>
                <h3 className="font-serif text-2xl text-white mt-1">
                  Soumili's Makeover Studio
                </h3>
              </div>

              <p className="text-xs text-brandLightPink/80 leading-relaxed font-light">
                Feel free to call, WhatsApp, or drop by our studio for in-person bridal consultations, trial bookings, and hair ornament styling.
              </p>

              <div className="space-y-4 pt-2 text-xs">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-brandPink shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Main Studio Location</p>
                    <p className="text-brandLightPink/80 mt-0.5">{settings.contact_address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-brandPink shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Direct Line</p>
                    <a href={`tel:${settings.contact_phone}`} className="text-brandLightPink hover:text-white transition-colors">
                      {settings.contact_phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-brandPink shrink-0" />
                  <div>
                    <p className="font-semibold text-white">VIP Inquiries Email</p>
                    <a href={`mailto:${settings.contact_email}`} className="text-brandLightPink hover:text-white transition-colors">
                      {settings.contact_email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-4 border-t border-brandPink/20">
                <a
                  href={`https://wa.me/${settings.contact_whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full text-xs uppercase tracking-wider font-semibold shadow-md flex items-center justify-center space-x-2 transition-all"
                >
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            </div>

            {/* Embedded Google Maps Location */}
            <div className="rounded-3xl overflow-hidden shadow-pink-soft border border-brandPink/20 aspect-[16/10]">
              <iframe
                title="Soumili's Makeover Google Map"
                src={settings.google_maps_embed_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>

          </div>

          {/* Right Column: Appointment Booking Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-brandPink/30 shadow-pink-soft">
            <div className="mb-8">
              <h3 className="font-serif text-2xl text-brandBlack mb-2">
                Send Booking Inquiry to Soumili's Makeover
              </h3>
              <p className="text-xs text-brandBlack/60">
                Fill in your wedding and event specifics. Soumili will respond within 4 hours with availability and a customized beauty plan.
              </p>
            </div>

            {success ? (
              <div className="bg-brandLightPink/60 border border-brandPink/40 p-8 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-brandPink mx-auto" />
                <h4 className="font-serif text-xl text-brandBlack font-medium">
                  Inquiry Received by Soumili's Makeover!
                </h4>
                <p className="text-xs text-brandBlack/80 leading-relaxed max-w-md mx-auto">
                  Thank you for reaching out. Soumili and our concierge team have received your wedding details and will contact you shortly via WhatsApp / Phone.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 px-6 py-2 bg-brandPink text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-brandPink-600 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-brandBlack mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Radhika Sharma"
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-brandPink/20 bg-brandLightPink/20 text-brandBlack text-xs focus:ring-2 focus:ring-brandPink focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-brandBlack mb-1.5">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-brandPink/20 bg-brandLightPink/20 text-brandBlack text-xs focus:ring-2 focus:ring-brandPink focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-brandBlack mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="radhika@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-brandPink/20 bg-brandLightPink/20 text-brandBlack text-xs focus:ring-2 focus:ring-brandPink focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-brandBlack mb-1.5">
                      Event / Wedding Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-brandPink/20 bg-brandLightPink/20 text-brandBlack text-xs focus:ring-2 focus:ring-brandPink focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-brandBlack mb-1.5">
                      Select Service / Look
                    </label>
                    <select
                      value={formData.service_id}
                      onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-brandPink/20 bg-brandLightPink/20 text-brandBlack text-xs focus:ring-2 focus:ring-brandPink focus:outline-none transition-all"
                    >
                      <option value="">-- Choose Desired Service --</option>
                      {services.map((svc) => (
                        <option key={svc.id} value={svc.id}>
                          {svc.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-brandBlack mb-1.5">
                      Package or Custom Note
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Couture HD Bridal or Royal Airbrush"
                      value={formData.package_name}
                      onChange={(e) => setFormData({ ...formData, package_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-brandPink/20 bg-brandLightPink/20 text-brandBlack text-xs focus:ring-2 focus:ring-brandPink focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-brandBlack mb-1.5">
                      Event Venue & City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Taj Lands End, Mumbai"
                      value={formData.event_location}
                      onChange={(e) => setFormData({ ...formData, event_location: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-brandPink/20 bg-brandLightPink/20 text-brandBlack text-xs focus:ring-2 focus:ring-brandPink focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-brandBlack mb-1.5">
                      Number of People Needing Makeup
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.guest_count}
                      onChange={(e) => setFormData({ ...formData, guest_count: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 rounded-xl border border-brandPink/20 bg-brandLightPink/20 text-brandBlack text-xs focus:ring-2 focus:ring-brandPink focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-brandBlack mb-1.5">
                    Special Wishes / Timing / Outfit Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell Soumili about your wedding events, lehenga palette, hair accessories, or specific timing requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-brandPink/20 bg-brandLightPink/20 text-brandBlack text-xs focus:ring-2 focus:ring-brandPink focus:outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full bg-brandPink hover:bg-brandPink-600 text-white font-semibold text-xs uppercase tracking-widest shadow-pink-soft hover:shadow-pink-glow transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting Request...' : "Confirm Appointment with Soumili's Makeover"}</span>
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
