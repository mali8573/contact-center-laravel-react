import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store'; // שימוש ב-type פותר שגיאות קומפילציה
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import ContactsTable from './components/ContactsTable';
import ContactDetails from './components/ContactDetails';

function App() {
  // השימוש ב-RootState כאן מונע את שגיאת ה-any שראינו ב-Problems
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <Routes>
        {/* נתיב ההתחברות */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
        />

        {/* נתיבים מוגנים - עוטפים את הטבלה ב-Layout המרכזי */}
        <Route 
          path="/" 
          element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="/dashboard" />} />
          
          {/* החלפנו את ה-Placeholder בטבלה האמיתית */}
          <Route path="dashboard" element={<ContactsTable />} />
          
          {/* כאן נוכל להוסיף בהמשך נתיבים נוספים */}
        </Route>
<Route path="/contacts/:id" element={<ContactDetails />} />
        {/* ברירת מחדל */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;