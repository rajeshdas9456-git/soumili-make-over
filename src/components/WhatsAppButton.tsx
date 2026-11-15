'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton({ phone = '+919876543210' }: { phone?: string }) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const message = encodeURIComponent('Hello Elena! I would like to enquire about luxury bridal makeup packages and date availability.');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 animate-pulse" />
      <span className="text-xs font-semibold tracking-wide pr-1 hidden sm:inline-block">
        Book on WhatsApp
      </span>
    </a>
  );
}
