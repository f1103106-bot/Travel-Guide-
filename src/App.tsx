/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  MapPin, 
  ChevronRight, 
  Compass, 
  Utensils, 
  Train, 
  Bike, 
  Calendar, 
  Search, 
  Heart,
  ExternalLink,
  Loader2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTravelGuide } from './lib/gemini';

interface Activity {
  time: string;
  name: string;
  description: string;
  tip: string;
}

interface DayGuide {
  day: number;
  theme: string;
  activities: Activity[];
}

interface Attraction {
  name: string;
  whyFamous: string;
  bestTimeToVisit: string;
}

interface HiddenGem {
  name: string;
  description: string;
}

interface CulinaryItem {
  dish: string;
  shopRecommendation: string;
  priceTWD: string;
}

interface Update2026 {
  event: string;
  date: string;
  description: string;
}

interface GuideData {
  title: string;
  destination: string;
  persona: string;
  dayGuide: DayGuide[];
  topAttractions: Attraction[];
  hiddenGems: HiddenGem[];
  culinaryBucketList: CulinaryItem[];
  logistics: {
    mrt: string;
    youbike: string;
  };
  year2026Updates: Update2026[];
}

const DESTINATIONS = [
  'Taipei / 台北',
  'Taichung / 台中',
  'Tainan / 台南',
  'Kaohsiung / 高雄',
  'Hualien / 花蓮',
  'Taitung / 台東'
];

const PERSONAS = [
  'Solo Foodie / 單人美食家',
  'Nature Lover / 大自然愛好者',
  'Culture Seeker / 文化愛好者',
  'Family Fun / 家庭旅遊',
  'Adventure Hunter / 冒險者'
];

export default function App() {
  const [destination, setDestination] = useState('Taipei / 台北');
  const [persona, setPersona] = useState('Solo Foodie / 單人美食家');
  const [guide, setGuide] = useState<GuideData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const generateGuide = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getTravelGuide(destination, persona);
      if (data) {
        setGuide(data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateGuide();
  }, []);

  return (
    <div className="min-h-screen bg-brand-cream text-[#1A1A1A] font-sans border-[12px] border-brand-green selection:bg-brand-orange selection:text-white relative">
      {/* Search Bar / Architect Controls */}
      <div className="absolute top-0 right-0 z-50 p-4 pb-0 hidden md:block">
        <div className="bg-white border border-brand-green/20 p-4 shadow-xl flex gap-4 items-end">
           <div>
            <label className="block text-[8px] uppercase tracking-widest font-mono font-bold mb-1 opacity-50">Destination</label>
            <select 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-transparent border-b border-brand-green text-sm py-1 focus:outline-none"
            >
              {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[8px] uppercase tracking-widest font-mono font-bold mb-1 opacity-50">Style</label>
            <select 
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="bg-transparent border-b border-brand-green text-sm py-1 focus:outline-none"
            >
              {PERSONAS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <button 
            onClick={generateGuide}
            disabled={loading}
            className="bg-brand-green text-white px-4 py-2 hover:bg-brand-orange transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin size-4" /> : <Search className="size-4" />}
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="p-8 md:p-12 pb-6 border-b border-black border-opacity-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-5xl md:text-8xl font-serif font-black tracking-tighter text-brand-green uppercase leading-none">
            {destination.split(' / ')[0]} / <span className="text-brand-orange italic font-normal tracking-normal">{destination.split(' / ')[1]}</span>
          </h1>
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-bold opacity-60 mt-4 flex items-center gap-2">
            <span className="shrink-0">{persona}</span>
            <span className="w-8 h-[1px] bg-black/20"></span>
            <span className="shrink-0">Travel Architect v4.2 / 2026</span>
          </p>
        </div>
        
        <div className="text-right w-full md:w-auto">
          <div className="text-[10px] font-mono uppercase bg-brand-orange text-white px-3 py-1 mb-3 inline-block">
             Real-time Grounding Active
          </div>
          <div className="flex gap-4 justify-end">
            <div className="border-l-2 border-brand-orange pl-3 text-left">
              <span className="block text-2xl font-serif italic leading-none">3-Day</span>
              <span className="block text-[10px] uppercase font-bold tracking-widest opacity-50">Curated Path</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Controls */}
      <div className="md:hidden px-8 py-4 bg-white/50 border-b border-black/5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
             <select 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-white border border-brand-green/20 px-3 py-2 text-xs focus:outline-none"
              >
                {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select 
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="bg-white border border-brand-green/20 px-3 py-2 text-xs focus:outline-none"
              >
                {PERSONAS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
          </div>
          <button 
            onClick={generateGuide}
            disabled={loading}
            className="bg-brand-green text-white py-3 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin size-4" /> : <Sparkles className="size-4" />}
            <span className="text-[10px] uppercase font-bold tracking-widest">Update Itinerary</span>
          </button>
      </div>

      <main className="min-h-[80vh]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-40"
            >
              <div className="relative">
                <div className="size-24 border-4 border-brand-green border-t-brand-orange rounded-full animate-spin" />
                <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8 text-brand-green" />
              </div>
              <h2 className="mt-8 font-serif italic text-3xl">Architecting your path...</h2>
              <p className="mt-2 text-[10px] font-mono tracking-widest uppercase opacity-40">Verifying 2026 data structures</p>
            </motion.div>
          ) : guide ? (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-0"
            >
              {/* Left Column: Attractions & Logistics */}
              <section className="md:col-span-3 border-r border-black border-opacity-10 p-8">
                <h2 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center">
                  <span className="w-2 h-2 bg-brand-orange mr-3 rounded-full"></span> Top Attractions
                </h2>
                <div className="space-y-10">
                  {guide.topAttractions.map((attr, idx) => (
                    <div key={idx} className="group">
                      <span className="text-[10px] block opacity-40 font-mono italic mb-1">0{idx+1} // {attr.name.split(' / ')[1]}</span>
                      <h3 className="font-serif text-xl font-bold group-hover:text-brand-orange transition-colors">{attr.name.split(' / ')[0]}</h3>
                      <p className="text-xs leading-relaxed opacity-70 mt-2">{attr.whyFamous}</p>
                      <div className="mt-2 flex items-center gap-1 text-[9px] font-mono uppercase text-brand-green font-bold">
                        <Calendar className="size-3" /> {attr.bestTimeToVisit}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-black border-opacity-10">
                   <h2 className="text-[10px] font-black uppercase mb-4 tracking-widest">Movement Logistics</h2>
                   <div className="p-5 bg-brand-green text-white shadow-xl relative overflow-hidden group">
                      <Train className="absolute -bottom-2 -right-2 size-12 opacity-10 group-hover:scale-125 transition-transform" />
                      <p className="text-[11px] leading-relaxed relative z-10">
                        Primary transport: <strong className="text-brand-orange">EasyCard (悠遊卡)</strong>. 
                        Efficient MRT and extensive YouBike 2.0 coverage. 
                        {guide.logistics.mrt.slice(0, 60)}...
                      </p>
                   </div>
                </div>
              </section>

              {/* Middle Column: Detailed Itinerary */}
              <section className="md:col-span-5 border-r border-black border-opacity-10 p-8 bg-brand-beige">
                <h2 className="text-xs font-black uppercase tracking-widest mb-10">The Daily Sequence</h2>
                <div className="space-y-16">
                  {guide.dayGuide.map((day, dIdx) => (
                    <div key={dIdx} className="relative pl-10 border-l-2 border-brand-green">
                      <div className="absolute -left-[11px] top-0 size-5 bg-brand-green border-4 border-brand-beige rotate-45" />
                      <div className="mb-6">
                        <span className="text-[10px] font-mono font-bold text-brand-orange uppercase tracking-tighter block mb-1">Day {day.day}</span>
                        <h3 className="text-3xl font-serif font-bold">{day.theme}</h3>
                      </div>
                      <div className="space-y-8">
                        {day.activities.map((act, aIdx) => (
                          <div key={aIdx} className="relative">
                            <h4 className="font-bold flex items-center gap-2 text-sm mb-2">
                              <span className="text-[10px] opacity-40 font-mono">{act.time}</span>
                              {act.name}
                            </h4>
                            <p className="text-xs leading-relaxed text-black/70 mb-3">{act.description}</p>
                            <div className="text-[10px] bg-white border border-black/5 p-3 italic flex gap-3">
                               <Sparkles className="size-3 text-brand-orange shrink-0 mt-0.5" />
                               <span>{act.tip}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Right Column: Culinary & Cultural */}
              <section className="md:col-span-4 p-8">
                <h2 className="text-xs font-black uppercase tracking-widest mb-8">Culinary Highlights</h2>
                <div className="space-y-6">
                  {guide.culinaryBucketList.map((item, idx) => (
                    <div key={idx} className="bg-white border border-black/10 p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-serif font-bold italic text-brand-green">{item.dish.split(' / ')[0]}</h3>
                        <span className="text-[9px] bg-brand-beige px-2 py-1 font-mono font-bold">{item.priceTWD}</span>
                      </div>
                      <p className="text-[11px] opacity-70 mb-4">{item.dish.includes('/') ? item.dish.split(' / ')[1] : ''} - Local delicacy verification complete.</p>
                      <div className="text-[10px] font-bold text-brand-orange flex items-center gap-2">
                        <MapPin className="size-3" /> RECO: {item.shopRecommendation}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 space-y-8">
                   <div className="border-4 border-brand-green p-6 bg-white shrink-0">
                      <h2 className="text-xs font-black uppercase mb-4 tracking-widest">2026 Archive Updates</h2>
                      <ul className="text-[11px] space-y-4">
                        {guide.year2026Updates.map((update, idx) => (
                          <li key={idx} className="flex flex-col gap-1">
                            <span className="font-bold text-brand-green flex items-center gap-2 italic">
                              <span className="size-1 bg-brand-orange rounded-full" />
                              {update.event}
                            </span>
                            <span className="text-[9px] font-mono opacity-50 uppercase">{update.date}</span>
                            <p className="opacity-80 italic">{update.description.slice(0, 100)}...</p>
                          </li>
                        ))}
                      </ul>
                   </div>

                   <div className="p-8 bg-brand-orange text-white rotate-1 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
                      <h4 className="text-sm font-bold uppercase tracking-widest mb-4 italic flex items-center gap-2">
                        <Compass className="size-4" /> Architect's Memo
                      </h4>
                      <p className="text-xs leading-snug font-medium italic">
                        "Tipping is not standard in Taiwan. Use your EasyCard for everything from MRT to vending machines. In 2026, look for the 'Digital Formosa' beacons at historical sites for AR overlays."
                      </p>
                      <p className="mt-4 text-[9px] font-mono uppercase tracking-widest opacity-70">- Taiwan Travel Architect Team</p>
                   </div>
                </div>

                <div className="mt-12 pt-8 border-t border-black/10">
                   <h2 className="text-xs font-black uppercase mb-6 tracking-widest">Hidden Gems</h2>
                   <div className="space-y-6">
                      {guide.hiddenGems.map((gem, idx) => (
                        <div key={idx} className="relative pl-6 border-l border-brand-green/30">
                           <div className="absolute -left-1 top-0 w-2 h-2 bg-brand-green rotate-45" />
                           <h4 className="font-serif text-lg font-bold">{gem.name}</h4>
                           <p className="text-[11px] opacity-70 mt-1 leading-relaxed">{gem.description}</p>
                        </div>
                      ))}
                   </div>
                </div>
              </section>
            </motion.div>
          ) : error && (
            <div className="flex flex-col items-center justify-center py-40 border-y border-black/10 mx-8">
               <h2 className="font-serif text-4xl italic mb-6">Database Connection Interrupted</h2>
               <button onClick={generateGuide} className="bg-brand-orange text-white px-8 py-3 text-xs font-mono font-bold uppercase tracking-widest">Reconnect to Architect</button>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Bar */}
      <footer className="h-14 bg-[#1A1A1A] text-white flex flex-col md:flex-row items-center px-8 justify-between text-[10px] tracking-[0.2em] uppercase font-mono">
        <span className="hidden md:inline">Formosa Path Systems / Built for 2026</span>
        <span className="text-brand-orange font-bold">Route ID: {destination.split(' / ')[0].toUpperCase()}-2026-{persona.split(' / ')[0].toUpperCase()}</span>
        <div className="flex gap-8">
          <span className="hover:text-brand-orange cursor-pointer transition-colors">Discover</span>
          <span className="hover:text-brand-orange cursor-pointer transition-colors">Navigate</span>
          <span className="hover:text-brand-orange cursor-pointer transition-colors">Taste</span>
        </div>
      </footer>
    </div>
  );
}
