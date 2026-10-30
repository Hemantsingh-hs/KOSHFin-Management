import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import {
  initialUser,
  initialSummary,
  initialProperties,
  initialTransactions,
  initialRooms,
  initialTenants,
  initialReminders,
  initialMessMenu,
  initialNotifications,
} from '../utils/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Application Data States (Initialized from MongoDB, with fallback structure)
  const [user, setUser] = useState(initialUser);
  const [summary, setSummary] = useState(initialSummary);
  const [properties, setProperties] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [messMenu, setMessMenu] = useState(initialMessMenu);
  const [notifications, setNotifications] = useState([]);

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState('transaction');

  // Load all data from MongoDB Backend API
  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);

      const [
        propsRes,
        roomsRes,
        tenantsRes,
        txRes,
        remindersRes,
        summaryRes,
        notifRes,
        messRes,
        userRes,
      ] = await Promise.allSettled([
        api.properties.getAll(),
        api.rooms.getAll(),
        api.tenants.getAll(),
        api.transactions.getAll(),
        api.reminders.getAll(),
        api.summary.get(),
        api.notifications.getAll(),
        api.mess.get(),
        api.auth.getMe(),
      ]);

      let connected = false;

      // Properties
      if (propsRes.status === 'fulfilled' && propsRes.value?.success) {
        setProperties(propsRes.value.data || []);
        connected = true;
      } else {
        setProperties(initialProperties);
      }

      // Rooms
      if (roomsRes.status === 'fulfilled' && roomsRes.value?.success) {
        setRooms(roomsRes.value.data || []);
        connected = true;
      } else {
        setRooms(initialRooms);
      }

      // Tenants
      if (tenantsRes.status === 'fulfilled' && tenantsRes.value?.success) {
        setTenants(tenantsRes.value.data || []);
        connected = true;
      } else {
        setTenants(initialTenants);
      }

      // Transactions
      if (txRes.status === 'fulfilled' && txRes.value?.success) {
        setTransactions(txRes.value.data || []);
        connected = true;
      } else {
        setTransactions(initialTransactions);
      }

      // Reminders
      if (remindersRes.status === 'fulfilled' && remindersRes.value?.success) {
        setReminders(remindersRes.value.data || []);
        connected = true;
      } else {
        setReminders(initialReminders);
      }

      // Summary
      if (summaryRes.status === 'fulfilled' && summaryRes.value?.success) {
        setSummary(summaryRes.value.data || initialSummary);
        connected = true;
      }

      // Notifications
      if (notifRes.status === 'fulfilled' && notifRes.value?.success) {
        setNotifications(notifRes.value.data || []);
        connected = true;
      } else {
        setNotifications(initialNotifications);
      }

      // Mess
      if (messRes.status === 'fulfilled' && messRes.value?.success) {
        setMessMenu(messRes.value.data || initialMessMenu);
        connected = true;
      }

      // User Profile
      if (userRes.status === 'fulfilled' && userRes.value?.success) {
        setUser(userRes.value.user || initialUser);
        connected = true;
      }

      setIsBackendConnected(connected);
    } catch (err) {
      console.warn('⚠️ MongoDB connection notice:', err.message);
      setIsBackendConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Refresh summary helper
  const refreshSummary = async () => {
    try {
      const res = await api.summary.get();
      if (res?.success && res.data) {
        setSummary(res.data);
      }
    } catch (err) {
      console.warn('Summary refresh notice:', err.message);
    }
  };

  // Add Transaction -> Saves to MongoDB
  const addTransaction = async (newTx) => {
    try {
      const res = await api.transactions.create(newTx);
      if (res?.success && res.data) {
        setTransactions((prev) => [res.data, ...prev]);
        refreshSummary();
        return res.data;
      }
    } catch (err) {
      console.error('Failed to create transaction in DB:', err.message);
      // Optimistic fallback
      const fallback = { ...newTx, id: Date.now(), date: newTx.date || 'Today', status: 'Completed' };
      setTransactions((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  // Delete Transaction -> Removes from MongoDB
  const deleteTransaction = async (id) => {
    try {
      await api.transactions.delete(id);
    } catch (err) {
      console.error('Failed to delete transaction in DB:', err.message);
    } finally {
      setTransactions((prev) => prev.filter((item) => item.id !== id && item._id !== id));
      refreshSummary();
    }
  };

  // Add Property -> Saves to MongoDB
  const addProperty = async (newProp) => {
    try {
      const res = await api.properties.create(newProp);
      if (res?.success && res.data) {
        setProperties((prev) => [res.data, ...prev]);
        refreshSummary();
        return res.data;
      }
    } catch (err) {
      console.error('Failed to create property in DB:', err.message);
      const fallback = { ...newProp, id: Date.now() };
      setProperties((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  // Update Property -> Updates in MongoDB
  const updateProperty = async (id, updatedFields) => {
    try {
      const res = await api.properties.update(id, updatedFields);
      if (res?.success && res.data) {
        setProperties((prev) =>
          prev.map((p) => (p.id === id || p._id === id ? res.data : p))
        );
        refreshSummary();
        return res.data;
      }
    } catch (err) {
      console.error('Failed to update property in DB:', err.message);
    }
  };

  // Delete Property -> Removes from MongoDB
  const deleteProperty = async (id) => {
    try {
      await api.properties.delete(id);
    } catch (err) {
      console.error('Failed to delete property in DB:', err.message);
    } finally {
      setProperties((prev) => prev.filter((item) => item.id !== id && item._id !== id));
      refreshSummary();
    }
  };

  // Add Room -> Saves to MongoDB
  const addRoom = async (newRoom) => {
    try {
      const res = await api.rooms.create(newRoom);
      if (res?.success && res.data) {
        setRooms((prev) => [...prev, res.data]);
        refreshSummary();
        return res.data;
      }
    } catch (err) {
      console.error('Failed to create room in DB:', err.message);
      const fallback = { ...newRoom, id: Number(newRoom.id || Date.now() % 1000) };
      setRooms((prev) => [...prev, fallback]);
      return fallback;
    }
  };

  // Delete Room -> Removes from MongoDB
  const deleteRoom = async (id) => {
    try {
      await api.rooms.delete(id);
    } catch (err) {
      console.error('Failed to delete room in DB:', err.message);
    } finally {
      setRooms((prev) => prev.filter((item) => item.id !== id && item._id !== id));
      refreshSummary();
    }
  };

  // Add Tenant -> Saves to MongoDB
  const addTenant = async (newTenant) => {
    try {
      const res = await api.tenants.create(newTenant);
      if (res?.success && res.data) {
        setTenants((prev) => [res.data, ...prev]);
        // Also refresh rooms from DB so occupancy updates live
        const updatedRooms = await api.rooms.getAll();
        if (updatedRooms?.success) setRooms(updatedRooms.data);
        refreshSummary();
        return res.data;
      }
    } catch (err) {
      console.error('Failed to create tenant in DB:', err.message);
      const fallback = { ...newTenant, id: Date.now() };
      setTenants((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  // Update Tenant -> Updates in MongoDB
  const updateTenant = async (id, updatedData) => {
    try {
      const res = await api.tenants.update(id, updatedData);
      if (res?.success && res.data) {
        setTenants((prev) =>
          prev.map((t) => (t.id === id || t._id === id ? res.data : t))
        );
        const updatedRooms = await api.rooms.getAll();
        if (updatedRooms?.success) setRooms(updatedRooms.data);
        return res.data;
      }
    } catch (err) {
      console.error('Failed to update tenant in DB:', err.message);
    }
  };

  // Delete Tenant -> Removes from MongoDB
  const deleteTenant = async (id) => {
    try {
      await api.tenants.delete(id);
    } catch (err) {
      console.error('Failed to delete tenant in DB:', err.message);
    } finally {
      setTenants((prev) => prev.filter((item) => item.id !== id && item._id !== id));
      const updatedRooms = await api.rooms.getAll();
      if (updatedRooms?.success) setRooms(updatedRooms.data);
      refreshSummary();
    }
  };

  // Add Reminder -> Saves to MongoDB
  const addReminder = async (newReminder) => {
    try {
      const res = await api.reminders.create(newReminder);
      if (res?.success && res.data) {
        setReminders((prev) => [res.data, ...prev]);
        return res.data;
      }
    } catch (err) {
      console.error('Failed to create reminder in DB:', err.message);
      const fallback = { ...newReminder, id: Date.now(), status: 'Pending', autoSend: true };
      setReminders((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  // Schedule Reminder with Date & Time -> Updates MongoDB
  const scheduleReminder = async (reminderId, { scheduledDate, scheduledTime, autoSend, phone }) => {
    try {
      const res = await api.reminders.updateSchedule(reminderId, {
        scheduledDate,
        scheduledTime,
        autoSend,
        phone,
      });

      if (res?.success && res.data) {
        setReminders((prev) =>
          prev.map((r) => (r.id === reminderId || r._id === reminderId ? { ...r, ...res.data } : r))
        );
        return res.data;
      }
    } catch (err) {
      console.error('Failed to update reminder schedule in DB:', err.message);
      setReminders((prev) =>
        prev.map((r) =>
          r.id === reminderId || r._id === reminderId
            ? {
                ...r,
                ...(scheduledDate && { scheduledDate }),
                ...(scheduledTime && { scheduledTime }),
                ...(phone && { phone }),
                autoSend: autoSend !== undefined ? autoSend : r.autoSend,
                whatsappSent: false,
                whatsappStatus: 'Scheduled',
              }
            : r
        )
      );
    }
  };

  // Send WhatsApp to single reminder -> Dispatches and updates MongoDB
  const sendWhatsAppToReminder = async (reminderId) => {
    try {
      const res = await api.reminders.sendWhatsApp(reminderId);
      if (res?.success && res.reminder) {
        setReminders((prev) =>
          prev.map((r) => (r.id === reminderId || r._id === reminderId ? { ...r, ...res.reminder } : r))
        );
      }
      // Re-fetch notifications so the new WhatsApp dispatch notification appears
      const notifs = await api.notifications.getAll();
      if (notifs?.success) setNotifications(notifs.data);
    } catch (err) {
      console.error('Failed to dispatch WhatsApp in DB:', err.message);
    }
  };

  // Send Bulk WhatsApp -> Dispatches to all in MongoDB
  const sendBulkWhatsAppReminders = async () => {
    try {
      const res = await api.reminders.sendBulkWhatsApp();
      if (res?.success) {
        const updated = await api.reminders.getAll();
        if (updated?.success) setReminders(updated.data);
        const notifs = await api.notifications.getAll();
        if (notifs?.success) setNotifications(notifs.data);
      }
    } catch (err) {
      console.error('Failed to dispatch bulk WhatsApp in DB:', err.message);
    }
  };

  // Mark Rent Paid -> Updates reminder, creates transaction in MongoDB
  const markRentPaid = async (reminderId, method = 'UPI', details = {}) => {
    try {
      const res = await api.reminders.markPaid(reminderId, method, details);
      if (res?.success) {
        // Refresh reminders, transactions, summary, tenants, and notifications from DB
        const [updatedReminders, updatedTx, summaryRes, tenantsRes, notifRes] = await Promise.all([
          api.reminders.getAll(),
          api.transactions.getAll(),
          api.summary.get(),
          api.tenants.getAll(),
          api.notifications.getAll(),
        ]);
        if (updatedReminders?.success) setReminders(updatedReminders.data);
        if (updatedTx?.success) setTransactions(updatedTx.data);
        if (summaryRes?.success) setSummary(summaryRes.data);
        if (tenantsRes?.success) setTenants(tenantsRes.data);
        if (notifRes?.success) setNotifications(notifRes.data);
        return res;
      }
    } catch (err) {
      console.error('Failed to mark rent as paid in DB:', err.message);
      setReminders((prev) =>
        prev.map((r) =>
          r.id === reminderId || r._id === reminderId ? { ...r, status: 'Paid', dueDate: 'Paid Today' } : r
        )
      );
      throw err;
    }
  };

  // Direct tenant payment confirmation (finds associated reminder or logs direct transaction)
  const confirmTenantPayment = async (tenant, { amount, method = 'UPI', notes = '', date = 'Today' } = {}) => {
    try {
      // Check if tenant has a pending reminder
      const existingReminder = reminders.find(
        (r) =>
          (r.tenantId === tenant.id ||
            (r.tenantName && tenant.name && r.tenantName.trim().toLowerCase() === tenant.name.trim().toLowerCase())) &&
          r.status !== 'Paid'
      );

      if (existingReminder) {
        return await markRentPaid(existingReminder.id || existingReminder._id, method, {
          amount: amount || existingReminder.amount || tenant.monthlyRent,
          notes: notes || `${tenant.property || 'PG'} · Room ${tenant.room || ''}`,
          date,
        });
      }

      // If no pending reminder exists, log transaction directly and update tenant status to Paid
      const newTx = {
        title: `Rent - ${tenant.name}`,
        type: 'income',
        category: 'Rent',
        method,
        amount: Number(amount) || Number(tenant.monthlyRent) || 0,
        date,
        notes: notes || `${tenant.property || 'PG'} · Room ${tenant.room || ''}`,
        status: 'Completed',
      };
      await addTransaction(newTx);

      // Update tenant status
      await updateTenant(tenant.id || tenant._id, { status: 'Paid' });
      await refreshSummary();
      return { success: true };
    } catch (err) {
      console.error('Failed to confirm tenant payment:', err.message);
      throw err;
    }
  };

  // Delete Reminder -> Removes from MongoDB
  const deleteReminder = async (id) => {
    try {
      await api.reminders.delete(id);
    } catch (err) {
      console.error('Failed to delete reminder in DB:', err.message);
    } finally {
      setReminders((prev) => prev.filter((r) => r.id !== id && r._id !== id));
    }
  };

  // Mark Notification Read -> Updates in MongoDB
  const markNotificationRead = async (id) => {
    try {
      await api.notifications.markRead(id);
    } catch (err) {
      console.error('Failed to mark notification read in DB:', err.message);
    } finally {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id || n._id === id ? { ...n, read: true } : n))
      );
    }
  };

  // Mark All Notifications Read -> Updates in MongoDB
  const markAllNotificationsRead = async () => {
    try {
      await api.notifications.markAllRead();
    } catch (err) {
      console.error('Failed to mark all notifications read in DB:', err.message);
    } finally {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  // Update User Profile -> Saves in MongoDB
  const updateUserProfile = async (profileData) => {
    try {
      const res = await api.auth.updateProfile(profileData);
      if (res?.success && res.user) {
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      console.error('Failed to update user profile in DB:', err.message);
    }
  };

  // Update Mess Menu -> Saves in MongoDB
  const updateMessMenu = async (days) => {
    try {
      const res = await api.mess.updateMenu(days);
      if (res?.success && res.data) {
        setMessMenu(res.data);
        return res.data;
      }
    } catch (err) {
      console.error('Failed to update mess menu in DB:', err.message);
    }
  };

  // Update Mess Attendance -> Saves in MongoDB
  const updateMessAttendance = async (attendance) => {
    try {
      const res = await api.mess.updateAttendance(attendance);
      if (res?.success && res.data) {
        setMessMenu(res.data);
        return res.data;
      }
    } catch (err) {
      console.error('Failed to update mess attendance in DB:', err.message);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        updateUserProfile,
        summary,
        setSummary,
        refreshSummary,
        properties,
        setProperties,
        addProperty,
        updateProperty,
        deleteProperty,
        rooms,
        setRooms,
        addRoom,
        deleteRoom,
        tenants,
        setTenants,
        addTenant,
        updateTenant,
        deleteTenant,
        transactions,
        setTransactions,
        addTransaction,
        deleteTransaction,
        reminders,
        setReminders,
        addReminder,
        scheduleReminder,
        sendWhatsAppToReminder,
        sendBulkWhatsAppReminders,
        markRentPaid,
        confirmTenantPayment,
        deleteReminder,
        messMenu,
        setMessMenu,
        updateMessMenu,
        updateMessAttendance,
        notifications,
        setNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        selectedProperty,
        setSelectedProperty,
        isAddModalOpen,
        setIsAddModalOpen,
        addModalType,
        setAddModalType,
        isLoading,
        isBackendConnected,
        fetchAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
