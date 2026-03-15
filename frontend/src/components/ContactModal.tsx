// components/ContactModal.tsx
import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { createContact, updateContact, type Contact } from '../store/contactsSlice';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialData?: Contact | null;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, title, initialData }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  
  // הוספת phone ל-State כדי להתאים לטיפוס Contact
  const [formData, setFormData] = useState({ 
    name: '', 
    company: '', 
    email: '', 
    phone: '' 
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        company: initialData.company || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
      });
    } else {
      setFormData({ name: '', company: '', email: '', phone: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData?.id) {
        await dispatch(updateContact({ id: initialData.id, data: formData })).unwrap();
      } else {
        await dispatch(createContact(formData)).unwrap();
      }
      onClose();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-right" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b flex items-center justify-between bg-gray-50/50">
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X className="size-5 text-gray-500" />
          </button>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא</label>
            <input 
              required
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">חברה</label>
            <input 
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              value={formData.company} 
              onChange={e => setFormData({...formData, company: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
            <input 
              required
              type="email"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
            <input 
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
            />
          </div>

          <div className="flex gap-3 mt-8">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin size-4" />}
              {initialData ? "שמור שינויים" : "צור איש קשר"}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-all"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;