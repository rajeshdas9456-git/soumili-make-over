import React from 'react';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { WebsiteSettings } from '@/types/database';

export default function InstagramSection({ settings }: { settings: WebsiteSettings }) {
  const instagramPosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=600',
      caption: "Regal crimson perfection for our palace bride #SoumiliMakeover"
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
      caption: "Reception sparkle and flawless Hollywood waves #BridalGlam #SoumiliMakeover"
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&q=80&w=600',
      caption: 'Pastel peach magic and dewy skin for the engagement ring ceremony'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      caption: 'Emerald elegance and custom wing eyeliner for cocktail night'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=600',
      caption: "Behind the scenes at the bridal suite prep #SoumiliMakeover"
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=600',
      caption: 'Glowing Haldi vibes with fresh floral ornaments'
    }
  ];

  return (
    <section className="py-20 bg-white border-t border-brandPink/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <a
          href={settings.instagram_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-brandPink font-semibold tracking-widest text-xs uppercase mb-2 hover:text-brandPink-700 transition-colors"
        >
          <Instagram className="w-4 h-4" />
          <span>Follow Us On Instagram</span>
        </a>
        <h2 className="font-serif text-2xl sm:text-3xl text-brandBlack">
          {settings.instagram_handle}
        </h2>
        <p className="text-xs text-brandBlack/70 mt-1">
          Daily behind-the-scenes transformations, bridal tutorials, and studio stories by Soumili's Makeover.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 px-2 max-w-[1600px] mx-auto">
        {instagramPosts.map((post) => (
          <a
            key={post.id}
            href={settings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden bg-brandLightPink rounded-xl block shadow-sm"
          >
            <img
              src={post.image}
              alt="Soumili's Makeover Instagram Story"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-brandBlack/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
              <div className="flex justify-end">
                <ArrowUpRight className="w-4 h-4 text-brandPink" />
              </div>
              <p className="text-[11px] font-light leading-snug line-clamp-3">
                {post.caption}
              </p>
              <div className="flex items-center space-x-1 text-[10px] text-brandPink font-medium">
                <Instagram className="w-3 h-3" />
                <span>@soumilismakeover</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
