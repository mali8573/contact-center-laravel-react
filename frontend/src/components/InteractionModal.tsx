import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { createInteraction, updateInteraction, fetchContactById } from '../store/contactsSlice';
import { X, Save, MessageSquare, Clock, Tag, Loader2 } from 'lucide-react';

interface InteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactId: number;
  initialData?: any;
}

const InteractionModal: React.FC<InteractionModalProps> = ({ isOpen, onClose, contactId, initialData }) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'Email',
    note: '',
    timestamp: '' 
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // פתרון ל-Invalid Date: נרמול פורמט התאריך מהשרת
        const dateSource = initialData.timestamp || initialData.created_at;
        let safeTimestamp = "";
        
        if (dateSource) {
          const rawDate = new Date(dateSource.replace(' ', 'T'));
          if (!isNaN(rawDate.getTime())) {
            safeTimestamp = new Date(rawDate.getTime() - rawDate.getTimezoneOffset() * 60000)
              .toISOString().slice(0, 16);
          }
        }

        setFormData({
          type: initialData.type || 'Email',
          note: initialData.note || '',
          timestamp: safeTimestamp || new Date().toISOString().slice(0, 16)
        });
      } else {
        const now = new Date();
        const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
          .toISOString().slice(0, 16);
        setFormData({ type: 'Email', note: '', timestamp: localISO });
      }
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.note.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // המרה לפורמט ש-Laravel PHP מבין (YYYY-MM-DD HH:mm:ss)
      const formattedTimestamp = formData.timestamp.replace('T', ' ') + ':00';

      const payload = {
        type: formData.type,
        note: formData.note.trim(),
        timestamp: formattedTimestamp,
        contact_id: contactId
      };
      
      if (initialData) {
        await dispatch(updateInteraction({ id: initialData.id, data: payload })).unwrap();
      } else {
        await dispatch(createInteraction(payload)).unwrap();
      }
      
      // רענון מיידי של האבא (ContactDetails)
      await dispatch(fetchContactById(contactId));
      onClose();
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-right">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="size-5 text-blue-600" />
            {initialData ? 'עריכת תיעוד' : 'תיעוד חדש'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="size-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">סוג התקשרות</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Email">אימייל</option>
              <option value="Phone Call">שיחת טלפון</option>
              <option value="Meeting">פגישה</option>
              <option value="Other">אחר</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">תאריך ושעה</label>
            <input 
              type="datetime-local"
              value={formData.timestamp}
              onChange={(e) => setFormData({...formData, timestamp: e.target.value})}
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">תוכן התיעוד</label>
            <textarea 
              rows={4}
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="כתבי כאן את תוכן השיחה..."
              required
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin size-5" /> : <Save className="size-5" />}
              שמור
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">ביטול</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InteractionModal;