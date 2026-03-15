import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchContactById, clearSelectedContact, deleteInteraction } from '../store/contactsSlice';
import { ArrowRight, Mail, Phone, Building2, MessageSquare, User, Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import InteractionModal from './InteractionModal'; 

const ContactDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedContact, loading, error } = useAppSelector((state) => state.contacts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<any>(null);

  useEffect(() => {
    if (id) dispatch(fetchContactById(Number(id)));
    return () => { dispatch(clearSelectedContact()); };
  }, [id, dispatch]);

  const handleDeleteInteraction = async (interactionId: number) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק תיעוד זה?')) {
      await dispatch(deleteInteraction(interactionId));
      if (id) dispatch(fetchContactById(Number(id))); // רענון לאחר מחיקה
    }
  };

  const openAddModal = () => { setEditingInteraction(null); setIsModalOpen(true); };
  const openEditModal = (inter: any) => { setEditingInteraction(inter); setIsModalOpen(true); };

  if (loading && !selectedContact) return (
    <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin size-12 text-blue-600" /></div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-right font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        <button onClick={() => navigate('/contacts')} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors font-bold group">
          <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
          <span>חזרה לרשימת אנשי הקשר</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border p-8 space-y-6 h-fit sticky top-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 text-blue-600 p-6 rounded-3xl mb-4"><User className="size-14" /></div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedContact?.name}</h1>
              <p className="text-blue-600 font-medium flex items-center gap-1 mt-1"><Building2 className="size-4" /> {selectedContact?.company}</p>
            </div>
            <div className="space-y-4 border-t pt-6 text-sm">
               <div className="flex items-center gap-3"><Mail className="size-4 text-gray-400" /> {selectedContact?.email}</div>
               <div className="flex items-center gap-3"><Phone className="size-4 text-gray-400" /> {selectedContact?.phone || 'לא הוזן'}</div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2"><MessageSquare className="size-5 text-blue-600" /> היסטוריית אינטראקציות</h2>
              <button onClick={openAddModal} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg transition-all active:scale-95"><Plus className="size-4 inline ml-1" /> תיעוד חדש</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase">
                  <tr>
                    <th className="px-6 py-4">סוג</th>
                    <th className="px-6 py-4">תאריך</th>
                    <th className="px-6 py-4">הערה</th>
                    <th className="px-6 py-4 text-center">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedContact?.interactions?.map((inter) => (
                    <tr key={inter.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">{inter.type}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {inter.timestamp ? new Date(inter.timestamp.replace(' ', 'T')).toLocaleString('he-IL', {day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'}) : '---'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs break-words">{inter.note || <span className="text-gray-300 italic">ללא הערה</span>}</td>
                      <td className="px-6 py-4 flex justify-center gap-3">
                        <button onClick={() => openEditModal(inter)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="size-4" /></button>
                        <button onClick={() => handleDeleteInteraction(inter.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="size-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <InteractionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} contactId={Number(id)} initialData={editingInteraction} />
    </div>
  );
};
export default ContactDetails;