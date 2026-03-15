import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // הוספת ניווט
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchContacts, deleteContact } from '../store/contactsSlice';
import { 
  Search, Edit2, Trash2, UserPlus, Eye,
  RotateCcw, Loader2, ChevronLeft, ChevronRight 
} from 'lucide-react';
import type { RootState } from '../store';
import ContactModal from './ContactModal';
import { type Contact } from '../store/contactsSlice';

const ContactsTable = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); // הוק לניווט
  
  const { items, pagination, loading } = useAppSelector((state: RootState) => state.contacts);
  const { user } = useAppSelector((state: RootState) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const isAdmin = Boolean((user as any)?.role === 'admin' || (user as any)?.is_admin);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchContacts({ page: 1, search: searchTerm }));
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch]);

  const handlePageChange = (newPage: number) => {
    dispatch(fetchContacts({ page: newPage, search: searchTerm }));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק איש קשר זה?')) {
      dispatch(deleteContact(id));
    }
  };

  const openEditModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-right" dir="rtl">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800">ניהול אנשי קשר</h2>
            <button title="שחזור מהארכיון" className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
              <RotateCcw className="size-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
              <input
                type="text"
                placeholder="חיפוש לפי שם, חברה או אימייל..."
                className="pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 w-72 text-sm outline-none shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {isAdmin && (
              <button 
                onClick={() => { setSelectedContact(null); setIsModalOpen(true); }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md"
              >
                <UserPlus className="size-4" />
                הוספת איש קשר
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center">
              <Loader2 className="size-10 text-blue-600 animate-spin" />
            </div>
          )}

          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">שם איש קשר</th>
                <th className="px-6 py-4">חברה</th>
                <th className="px-6 py-4">אימייל</th>
                <th className="px-6 py-4 text-center">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length > 0 ? (
                items.map((contact) => (
                  <tr key={contact.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      {/* לחיצה על השם מובילה לדף פרטים */}
                      <button 
                        onClick={() => navigate(`/contacts/${contact.id}`)}
                        className="text-gray-900 font-bold hover:text-blue-600 hover:underline transition-colors"
                      >
                        {contact.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{contact.company}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{contact.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* כפתור צפייה מהירה */}
                        <button 
                          onClick={() => navigate(`/contacts/${contact.id}`)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all"
                          title="צפה בפרטים"
                        >
                          <Eye className="size-4" />
                        </button>

                        {isAdmin && (
                          <>
                            <button 
                              onClick={() => openEditModal(contact)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                            >
                              <Edit2 className="size-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(contact.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : !loading && (
                <tr>
                  <td colSpan={4} className="text-center py-20 text-gray-400">לא נמצאו תוצאות</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <span className="text-sm text-gray-500">סה"כ: <span className="font-semibold">{pagination.total}</span></span>
          <div className="flex items-center gap-2" dir="ltr">
            <button disabled={pagination.currentPage === 1} onClick={() => handlePageChange(pagination.currentPage - 1)} className="p-2 border border-gray-200 rounded bg-white disabled:opacity-50 hover:bg-gray-50">
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-sm font-medium px-4">{pagination.currentPage} / {pagination.lastPage}</span>
            <button disabled={pagination.currentPage === pagination.lastPage} onClick={() => handlePageChange(pagination.currentPage + 1)} className="p-2 border border-gray-200 rounded bg-white disabled:opacity-50 hover:bg-gray-50">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedContact ? "עריכת איש קשר" : "הוספת איש קשר"} initialData={selectedContact} />
    </div>
  );
};

export default ContactsTable;