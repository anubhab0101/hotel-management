'use client';

import React, { useState } from 'react';
import { MenuCategoryType, MenuItemType } from '@/lib/db/queries/guest';
import { useCart } from '@/components/guest/CartContext';
import { Plus } from 'lucide-react';

export function MenuList({ categories }: { categories: MenuCategoryType[] }) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id);
  const { addToCart, items } = useCart();

  const handleAdd = (item: MenuItemType) => {
    addToCart(item);
  };

  const getQuantity = (itemId: string) => {
    return items.find(i => i.menuItem.id === itemId)?.quantity || 0;
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              document.getElementById(cat.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full font-semibold transition-all ${
              activeCategory === cat.id 
                ? 'bg-brand-primary text-white shadow-md' 
                : 'bg-white text-brand-text/70 hover:bg-brand-primary/10'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Sections */}
      <div className="space-y-10">
        {categories.map(cat => (
          <section key={cat.id} id={cat.id} className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-bold tracking-tight">{cat.name}</h2>
            <div className="space-y-4">
              {cat.items.map(item => {
                const qty = getQuantity(item.id);
                return (
                  <div key={item.id} className={`bg-white rounded-2xl p-4 shadow-sm border border-brand-text/5 flex gap-4 ${!item.isAvailable ? 'opacity-50 grayscale' : ''}`}>
                    {/* Placeholder image block */}
                    <div className="w-24 h-24 bg-brand-surface rounded-xl flex-shrink-0 flex items-center justify-center text-brand-primary/30">
                      Img
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                          <span className={`text-xs px-1.5 py-0.5 rounded border ${
                            item.foodType === 'veg' ? 'border-green-500 text-green-600' :
                            item.foodType === 'veg_egg' ? 'border-yellow-500 text-yellow-600' :
                            'border-red-500 text-red-600'
                          }`}>
                            {item.foodType === 'veg' ? 'V' : item.foodType === 'veg_egg' ? 'E' : 'NV'}
                          </span>
                        </div>
                        <p className="text-sm text-brand-text/70 mt-1 line-clamp-2 leading-snug">{item.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-bold">₹{(item.priceMinor / 100).toFixed(0)}</span>
                        {item.isAvailable ? (
                          <button 
                            onClick={() => handleAdd(item)}
                            className="bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary rounded-full px-4 py-1.5 text-sm font-bold flex items-center gap-1 transition-colors active:scale-95"
                          >
                            {qty > 0 ? (
                              <>Added <span className="bg-brand-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{qty}</span></>
                            ) : (
                              <><Plus size={16} /> Add</>
                            )}
                          </button>
                        ) : (
                          <span className="text-sm font-semibold text-critical">Sold out</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
