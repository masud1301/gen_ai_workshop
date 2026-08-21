import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  PlusCircle,
  Search,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  Tag,
  Mail,
  User,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface LostItem {
  id: string;
  type: 'lost' | 'found';
  title: string;
  category: string;
  location: string;
  date: string;
  description: string;
  contactName: string;
  contactEmail: string;
  status: 'open' | 'claimed' | 'matched';
  matchedItemId?: string;
}

const INITIAL_ITEMS: LostItem[] = [
  {
    id: 'lf_1',
    type: 'found',
    title: 'Silver Dell Inspiron Charger 65W',
    category: 'Electronics',
    location: 'Central Library 2nd Floor Reading Room Desk 14',
    date: '2026-03-24',
    description: 'Found plugged into wall socket near windows. Has a small blue sticker on the brick.',
    contactName: 'Security Desk (Library)',
    contactEmail: 'library-security@university.edu',
    status: 'open',
  },
  {
    id: 'lf_2',
    type: 'lost',
    title: 'Matte Blue Hydro Flask Water Bottle',
    category: 'Personal Item',
    location: 'Turing Hall 101 Lecture Theatre',
    date: '2026-03-23',
    description: '32oz bottle with stickers of GitHub and Linux Penguin.',
    contactName: 'Alex Rivera',
    contactEmail: 'alex.rivera@university.edu',
    status: 'open',
  },
  {
    id: 'lf_3',
    type: 'found',
    title: 'Blue Metal Water Bottle with Tech Stickers',
    category: 'Personal Item',
    location: 'Turing Hall Podium Lost Box',
    date: '2026-03-24',
    description: 'Handed over by teaching assistant after CS301 morning class.',
    contactName: 'CS Department Office',
    contactEmail: 'cs-office@university.edu',
    status: 'matched',
    matchedItemId: 'lf_2',
  },
  {
    id: 'lf_4',
    type: 'lost',
    title: 'Student ID Card & Dorm Keycard',
    category: 'Cards & Keys',
    location: 'Hostel Block C Cafeteria',
    date: '2026-03-24',
    description: 'Black lanyard with student badge for ID: ST-2026-8812.',
    contactName: 'Alex Rivera',
    contactEmail: 'alex.rivera@university.edu',
    status: 'open',
  },
];

export const LostAndFoundPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [items, setItems] = useState<LostItem[]>(INITIAL_ITEMS);
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newType, setNewType] = useState<'lost' | 'found'>('lost');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Electronics');
  const [newLocation, setNewLocation] = useState('Central Library');
  const [newDescription, setNewDescription] = useState('');

  const filteredItems = items.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: LostItem = {
      id: `lf_${Date.now()}`,
      type: newType,
      title: newTitle,
      category: newCategory,
      location: newLocation,
      date: new Date().toISOString().split('T')[0],
      description: newDescription,
      contactName: currentUser.name,
      contactEmail: currentUser.email,
      status: 'open',
    };

    setItems([newItem, ...items]);
    setIsModalOpen(false);
    showToast('Listing published', `Posted to campus Lost & Found board`, 'success');

    // Reset form
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6 animate-in fade-in" id="lost-and-found-page">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-theme-muted mb-1">
            <Link to="/student/dashboard" className="hover:text-theme-primary">Dashboard</Link>
            <span>/</span>
            <span className="text-theme-primary font-semibold">Lost & Found</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-theme-primary">
              Smart Lost & Found Bulletin
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              AI Auto-Matcher
            </span>
          </div>
          <p className="text-xs text-theme-secondary mt-1">
            Report lost belongings or register items found across campus. SmartFix AI matches descriptions automatically.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Post Lost / Found Item
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl border border-theme-subtle bg-surface shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'lost', label: 'Lost Items' },
            { id: 'found', label: 'Found Items' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filterType === tab.id
                  ? 'bg-brand-primary text-white'
                  : 'bg-surface-elevated text-theme-secondary hover:text-theme-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search items, locations..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-theme-subtle bg-surface hover:border-theme-strong shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    item.type === 'lost'
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {item.type === 'lost' ? 'Lost Item' : 'Found Item'}
                </span>

                {item.status === 'matched' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Matched
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-theme-primary line-clamp-1">{item.title}</h3>
                <p className="text-xs text-theme-secondary mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="text-xs text-theme-muted space-y-1 pt-2 border-t border-theme-subtle">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-theme-muted" />
                  <span className="truncate">{item.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-theme-muted" />
                  <span>{item.date}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-theme-subtle flex items-center justify-between text-xs">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-theme-primary truncate">{item.contactName}</p>
                <p className="text-[10px] text-theme-muted truncate">{item.contactEmail}</p>
              </div>

              <button
                onClick={() => showToast('Claim Initiated', `Contact notification dispatched to ${item.contactEmail}`, 'success')}
                className="px-3 py-1 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-theme-subtle text-xs font-semibold text-theme-primary transition-colors shrink-0"
              >
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-theme-subtle bg-surface p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-theme-primary">Post to Lost & Found</h3>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-theme-secondary mb-1">Listing Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('lost')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      newType === 'lost'
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-surface-elevated text-theme-secondary border-theme-subtle'
                    }`}
                  >
                    I Lost Something
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('found')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      newType === 'found'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-surface-elevated text-theme-secondary border-theme-subtle'
                    }`}
                  >
                    I Found Something
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme-secondary mb-1">Item Name / Summary</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Black AirPods Pro Case"
                  className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-theme-secondary mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-brand-primary"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Personal Item">Personal Item</option>
                    <option value="Cards & Keys">Cards & Keys</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books & Notes">Books & Notes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-theme-secondary mb-1">Campus Location</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    placeholder="e.g. Library 2nd floor"
                    className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme-secondary mb-1">Description / Details</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Describe color, stickers, specific markings..."
                  className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-theme-subtle">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-theme-secondary hover:bg-surface-hover"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-hover shadow-sm"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
