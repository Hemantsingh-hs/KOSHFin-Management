import React, { useState } from 'react';
import {
  Plus,
  DoorOpen,
  Users,
  Search,
  Check,
  X,
  UserPlus,
  Building,
  Bed,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  MessageSquare,
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  Calendar,
  CreditCard,
  Banknote,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Rooms() {
  const { rooms, properties, tenants, transactions, addTenant, addRoom, setIsAddModalOpen, setAddModalType } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);

  // Room Details Modal State
  const [selectedRoomDetail, setSelectedRoomDetail] = useState(null);
  const [detailTab, setDetailTab] = useState('tenants'); // 'tenants' | 'transactions'

  // Helper: get all tenants assigned to a given room
  const getRoomTenants = (room) => {
    if (!room) return [];
    const roomIdStr = String(room.id).trim();
    return (tenants || []).filter((t) => {
      const tRoom = String(t.room || '').trim();
      const isRoomMatch = tRoom === roomIdStr;
      const isOccupantMatch =
        room.occupants &&
        room.occupants.some((occ) => occ && occ.trim().toLowerCase() === (t.name || '').trim().toLowerCase());
      return isRoomMatch || isOccupantMatch;
    });
  };

  // Helper: get all transactions associated with a given room
  const getRoomTransactions = (room, roomTenants) => {
    if (!room) return [];
    const roomIdStr = String(room.id).trim();
    const tenantNames = (roomTenants || []).map((t) => (t.name || '').toLowerCase());
    if (room.occupants) {
      room.occupants.forEach((occ) => {
        if (occ && !tenantNames.includes(occ.toLowerCase())) {
          tenantNames.push(occ.toLowerCase());
        }
      });
    }

    return (transactions || []).filter((tx) => {
      const notes = (tx.notes || '').toLowerCase();
      const title = (tx.title || '').toLowerCase();

      const hasRoomInNotes =
        notes.includes(`room ${roomIdStr}`) ||
        notes.includes(`room ${roomIdStr} `) ||
        notes.includes(`room-${roomIdStr}`) ||
        notes.includes(`room:${roomIdStr}`) ||
        notes.includes(`room: ${roomIdStr}`) ||
        notes.includes(`room #${roomIdStr}`) ||
        notes.includes(`room${roomIdStr}`) ||
        notes === roomIdStr;

      const hasTenantInTitle = tenantNames.some((tName) => tName && title.includes(tName));

      return hasRoomInNotes || hasTenantInTitle;
    });
  };

  // In-Room Tenant Assignment Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [targetRoom, setTargetRoom] = useState(null);
  const [tenantForm, setTenantForm] = useState({
    name: '',
    phone: '',
    email: '',
    property: '',
    room: '',
    moveInDate: new Date().toISOString().slice(0, 10),
    monthlyRent: '',
    deposit: '',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open modal pre-targeted to a specific room
  const handleOpenAssignModal = (room = null) => {
    const chosenRoom = room || rooms[0] || null;
    setTargetRoom(chosenRoom);

    const rentVal = chosenRoom?.rent || 7500;
    setTenantForm({
      name: '',
      phone: '',
      email: '',
      property: chosenRoom?.propertyName || properties[0]?.name || '',
      room: chosenRoom?.id ? String(chosenRoom.id) : '',
      moveInDate: new Date().toISOString().slice(0, 10),
      monthlyRent: String(rentVal),
      deposit: String(rentVal * 2),
    });

    setIsAssignModalOpen(true);
  };

  // Submit new tenant assignment from inside Room section
  const handleAssignTenantSubmit = async (e) => {
    e.preventDefault();
    if (!tenantForm.name || !tenantForm.phone || !tenantForm.room) {
      alert('Please provide tenant name, phone, and room number.');
      return;
    }

    try {
      await addTenant({
        name: tenantForm.name.trim(),
        phone: tenantForm.phone.trim(),
        email: tenantForm.email.trim() || `${tenantForm.name.toLowerCase().replace(/\s+/g, '')}@tenant.com`,
        property: tenantForm.property || 'PG Property',
        room: String(tenantForm.room),
        monthlyRent: Number(tenantForm.monthlyRent) || 7500,
        deposit: Number(tenantForm.deposit) || 15000,
        moveInDate: tenantForm.moveInDate,
        status: 'Paid',
        depositStatus: 'Paid',
      });

      showToast(`Tenant "${tenantForm.name}" successfully assigned to Room ${tenantForm.room}!`);
      setIsAssignModalOpen(false);
    } catch (err) {
      console.error('Failed to assign tenant:', err);
      showToast('Error assigning tenant to room.');
    }
  };

  // Filter rooms
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      String(room.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.propertyName && room.propertyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (room.occupants && room.occupants.some((occ) => occ.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesProp = selectedProperty === 'All' || room.propertyName === selectedProperty;
    const matchesStatus = selectedStatus === 'All' || room.status === selectedStatus;

    return matchesSearch && matchesProp && matchesStatus;
  });

  // KPI Calculations
  const totalCapacity = rooms.reduce((sum, r) => sum + (Number(r.capacity) || 2), 0);
  const totalOccupied = rooms.reduce((sum, r) => sum + (r.occupants ? r.occupants.length : 0), 0);
  const totalVacant = Math.max(0, totalCapacity - totalOccupied);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  return (
    <div className="space-y-4 pb-10 text-[#091E42]">
      {/* Page Header (Jira Standard Sizing) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-[#0052CC]" />
            <span>Rooms & Bed Inventory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage room units, bed allocations, and assign tenants directly to rooms.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Primary Action: Add / Assign Tenant to Room */}
          <button
            onClick={() => handleOpenAssignModal()}
            className="px-3 py-1.5 bg-[#0052CC] hover:bg-[#0047B3] text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Assign Tenant</span>
          </button>

          {/* Secondary Action: Add Room */}
          <button
            onClick={() => {
              setAddModalType('room');
              setIsAddModalOpen(true);
            }}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Room</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-900 text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-500 hover:text-emerald-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Metric Summary Strip (Jira Expense Tracker Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Rooms</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{rooms.length}</p>
          <span className="text-[11px] text-slate-400">Configured units</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Bed Capacity</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{totalCapacity} Beds</p>
          <span className="text-[11px] text-slate-400">Portfolio total</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Occupied Beds</p>
          <p className="text-xl font-bold text-emerald-600 mt-0.5">{totalOccupied} Beds</p>
          <span className="text-[11px] font-medium text-emerald-700">{occupancyRate}% occupancy</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Available Beds</p>
          <p className="text-xl font-bold text-[#0052CC] mt-0.5">{totalVacant} Beds</p>
          <span className="text-[11px] text-slate-400">Ready for assignment</span>
        </div>
      </div>

      {/* Filter and Search Bar (Compact Standard Jira Style) */}
      <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by room, tenant or property..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50/70 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#0052CC] focus:bg-white"
            />
          </div>

          {/* Property Select */}
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0052CC]"
          >
            <option value="All">All Properties</option>
            {properties.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>

          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0052CC]"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available (Beds Free)</option>
            <option value="Occupied">Fully Occupied</option>
            <option value="Vacant">Vacant</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
          {filteredRooms.length} of {rooms.length} rooms
        </span>
      </div>

      {/* Rooms Grid (Compact, Standard Jira Sizing) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredRooms.map((room) => {
          const cap = Number(room.capacity) || 2;
          const occCount = room.occupants ? room.occupants.length : 0;
          const isFull = occCount >= cap;
          const freeBeds = Math.max(0, cap - occCount);

          // Jira Status Lozenges
          const statusBadge =
            isFull || room.status === 'Occupied'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : occCount > 0 || room.status === 'Available'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-slate-100 text-slate-700 border-slate-200';

          const statusLabel =
            isFull || room.status === 'Occupied'
              ? 'Occupied'
              : occCount > 0
              ? `Available (${freeBeds} bed free)`
              : 'Vacant';

          const pct = Math.min(100, Math.round((occCount / cap) * 100));

          return (
            <div
              key={room.id}
              onClick={() => {
                setSelectedRoomDetail(room);
                setDetailTab('tenants');
              }}
              className="group bg-white rounded-lg border border-slate-200 shadow-xs hover:border-[#0052CC] hover:shadow-md transition-all p-4 flex flex-col justify-between space-y-3 cursor-pointer relative"
            >
              <div>
                {/* Room Card Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-md bg-slate-100 group-hover:bg-blue-50 group-hover:text-[#0052CC] text-slate-800 font-bold text-xs flex items-center justify-center border border-slate-200 group-hover:border-blue-200 transition">
                      {room.id}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0052CC] leading-tight transition flex items-center gap-1.5">
                        <span>Room {room.id}</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {room.floor || '1st Floor'} · {room.type || 'Standard'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${statusBadge}`}>
                      {statusLabel}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRoomDetail(room);
                        setDetailTab('tenants');
                      }}
                      title="View Room & Tenant Details"
                      className="p-1 rounded text-slate-400 group-hover:text-[#0052CC] hover:bg-blue-50 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Property Name */}
                <p className="text-[11px] text-slate-500 font-medium mt-2.5 truncate">
                  🏢 {room.propertyName || 'Default Property'}
                </p>

                {/* Occupancy Progress Bar (Jira sprint style) */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
                    <span>Beds: {occCount} / {cap} Occupied</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isFull ? 'bg-emerald-500' : occCount > 0 ? 'bg-[#0052CC]' : 'bg-slate-300'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Assigned Tenants Section */}
                <div className="mt-3 pt-2.5 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Tenants Assigned
                    </span>
                    {!isFull && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAssignModal(room);
                        }}
                        className="text-[11px] font-semibold text-[#0052CC] hover:text-[#0047B3] flex items-center gap-0.5 hover:underline cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Tenant</span>
                      </button>
                    )}
                  </div>

                  {room.occupants && room.occupants.length > 0 ? (
                    <div className="space-y-1">
                      {room.occupants.map((occName, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded border border-slate-200 text-xs text-slate-800"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-[#0052CC] text-white text-[9px] font-bold flex items-center justify-center">
                              {occName[0] || 'T'}
                            </span>
                            <span className="font-medium truncate max-w-[150px]">{occName}</span>
                          </div>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
                            Active
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-2 text-center bg-slate-50/50 rounded border border-dashed border-slate-200">
                      <p className="text-[11px] text-slate-400">No tenants assigned yet</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAssignModal(room);
                        }}
                        className="mt-1 text-xs font-semibold text-[#0052CC] hover:underline cursor-pointer"
                      >
                        + Assign First Tenant
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Quick Action Footer */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-slate-900">
                    ₹{Number(room.rent || 7500).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400"> / bed</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-[#0052CC] group-hover:underline flex items-center gap-0.5">
                    <span>View Details</span>
                    <span>→</span>
                  </span>

                  {!isFull ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAssignModal(room);
                      }}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#0052CC] text-xs font-semibold rounded border border-blue-200 transition cursor-pointer flex items-center gap-1"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>Assign</span>
                    </button>
                  ) : (
                    <span className="px-2 py-1 text-[11px] font-medium text-slate-400 bg-slate-50 rounded border border-slate-200">
                      Fully Booked
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredRooms.length === 0 && (
          <div className="col-span-full bg-white rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <DoorOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No room units found</h3>
            <p className="text-xs text-slate-400 mt-0.5 max-w-sm mx-auto">
              Create your room units or adjust your filter options to view available rooms.
            </p>
            <button
              onClick={() => {
                setAddModalType('room');
                setIsAddModalOpen(true);
              }}
              className="mt-3 px-3.5 py-1.5 bg-[#0052CC] hover:bg-[#0047B3] text-white text-xs font-semibold rounded-md shadow-xs cursor-pointer inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Room</span>
            </button>
          </div>
        )}
      </div>

      {/* Jira Standard "Assign Tenant to Room" Dialog Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-blue-100 text-[#0052CC] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Assign Tenant to Room {tenantForm.room || targetRoom?.id || ''}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Enter tenant details to allocate bed and generate rent schedule.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAssignTenantSubmit} className="p-5 space-y-3.5 text-xs">
              {/* Room & Property Allocation Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Room No. *
                  </label>
                  <select
                    value={tenantForm.room}
                    onChange={(e) => {
                      const selected = rooms.find((r) => String(r.id) === e.target.value);
                      setTenantForm({
                        ...tenantForm,
                        room: e.target.value,
                        property: selected?.propertyName || tenantForm.property,
                        monthlyRent: String(selected?.rent || tenantForm.monthlyRent),
                      });
                    }}
                    required
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white text-slate-800 text-xs focus:outline-none focus:border-[#0052CC]"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        Room {r.id} ({r.propertyName})
                      </option>
                    ))}
                    {rooms.length === 0 && <option value="101">Room 101 (Default)</option>}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Property Name
                  </label>
                  <input
                    type="text"
                    value={tenantForm.property}
                    onChange={(e) => setTenantForm({ ...tenantForm, property: e.target.value })}
                    required
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-slate-50 text-slate-800 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Tenant Full Name */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                  Tenant Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={tenantForm.name}
                  onChange={(e) => setTenantForm({ ...tenantForm, name: e.target.value })}
                  required
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-slate-800 text-xs focus:outline-none focus:border-[#0052CC]"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Phone (WhatsApp) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210"
                    value={tenantForm.phone}
                    onChange={(e) => setTenantForm({ ...tenantForm, phone: e.target.value })}
                    required
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-slate-800 text-xs focus:outline-none focus:border-[#0052CC]"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Used for automated rent reminders</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="tenant@email.com"
                    value={tenantForm.email}
                    onChange={(e) => setTenantForm({ ...tenantForm, email: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-slate-800 text-xs focus:outline-none focus:border-[#0052CC]"
                  />
                </div>
              </div>

              {/* Rent & Deposit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Monthly Rent (₹) *
                  </label>
                  <input
                    type="number"
                    value={tenantForm.monthlyRent}
                    onChange={(e) => setTenantForm({ ...tenantForm, monthlyRent: e.target.value })}
                    required
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-slate-800 text-xs focus:outline-none focus:border-[#0052CC]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    value={tenantForm.deposit}
                    onChange={(e) => setTenantForm({ ...tenantForm, deposit: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-slate-800 text-xs focus:outline-none focus:border-[#0052CC]"
                  />
                </div>
              </div>

              {/* Move-in Date */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                  Move-In Date
                </label>
                <input
                  type="date"
                  value={tenantForm.moveInDate}
                  onChange={(e) => setTenantForm({ ...tenantForm, moveInDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-slate-800 text-xs focus:outline-none focus:border-[#0052CC]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0052CC] hover:bg-[#0047B3] text-white font-semibold text-xs rounded-md shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Assign & Save Tenant</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Room Details Modal: Tenants & Transactions */}
      {selectedRoomDetail && (
        (() => {
          const roomTenants = getRoomTenants(selectedRoomDetail);
          const roomTxs = getRoomTransactions(selectedRoomDetail, roomTenants);
          const cap = Number(selectedRoomDetail.capacity) || 2;
          const occCount = selectedRoomDetail.occupants ? selectedRoomDetail.occupants.length : roomTenants.length;
          const isFull = occCount >= cap;
          const freeBeds = Math.max(0, cap - occCount);
          const totalRentCollected = roomTxs
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + Number(t.amount || 0), 0);

          return (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
              <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 shrink-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#0052CC] text-white font-extrabold text-base sm:text-lg flex items-center justify-center shadow-xs shrink-0">
                        {selectedRoomDetail.id}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-base sm:text-lg font-bold text-slate-900">
                            Room {selectedRoomDetail.id} Details
                          </h2>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                              isFull
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : occCount > 0
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {isFull ? 'Occupied' : occCount > 0 ? `Available (${freeBeds} bed free)` : 'Vacant'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>🏢 {selectedRoomDetail.propertyName || 'Property'}</span>
                          <span>·</span>
                          <span>{selectedRoomDetail.floor || '1st Floor'}</span>
                          <span>·</span>
                          <span>{selectedRoomDetail.type || 'Double Sharing'}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedRoomDetail(null)}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Highlights Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-200/70 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Monthly Rent</span>
                      <span className="font-bold text-slate-900 text-sm">
                        ₹{Number(selectedRoomDetail.rent || 7500).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400"> / bed</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Beds & Capacity</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {occCount} / {cap} Occupied
                      </span>
                      <span className="text-[10px] text-slate-400 block">{freeBeds} bed(s) available</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Rent Collected</span>
                      <span className="font-bold text-emerald-600 text-sm">
                        ₹{totalRentCollected.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{roomTxs.length} transaction(s)</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Room Amenities</span>
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {selectedRoomDetail.ac && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                            ❄️ AC
                          </span>
                        )}
                        {selectedRoomDetail.attachedBath && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            🚿 Bath
                          </span>
                        )}
                        {!selectedRoomDetail.ac && !selectedRoomDetail.attachedBath && (
                          <span className="text-[10px] text-slate-400">Standard Room</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs Selector */}
                <div className="flex items-center border-b border-slate-200 px-4 sm:px-5 bg-white shrink-0">
                  <button
                    onClick={() => setDetailTab('tenants')}
                    className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                      detailTab === 'tenants'
                        ? 'border-[#0052CC] text-[#0052CC]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Tenants Assigned</span>
                    <span
                      className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                        detailTab === 'tenants'
                          ? 'bg-blue-100 text-[#0052CC]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {roomTenants.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setDetailTab('transactions')}
                    className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                      detailTab === 'transactions'
                        ? 'border-[#0052CC] text-[#0052CC]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Room Transactions</span>
                    <span
                      className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                        detailTab === 'transactions'
                          ? 'bg-blue-100 text-[#0052CC]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {roomTxs.length}
                    </span>
                  </button>
                </div>

                {/* Modal Scrollable Body */}
                <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
                  {detailTab === 'tenants' ? (
                    <div className="space-y-3">
                      {roomTenants.length > 0 ? (
                        roomTenants.map((t, idx) => (
                          <div
                            key={t.id || t._id || idx}
                            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#0052CC] text-white font-bold text-sm flex items-center justify-center shrink-0">
                                  {t.name ? t.name[0].toUpperCase() : 'T'}
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                                    <span>{t.name}</span>
                                    <span
                                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                                        t.status === 'Paid'
                                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                          : 'bg-amber-50 text-amber-700 border-amber-200'
                                      }`}
                                    >
                                      {t.status || 'Active'}
                                    </span>
                                  </h4>
                                  <p className="text-[11px] text-slate-500 mt-0.5">
                                    Occupant · Room {selectedRoomDetail.id} ({selectedRoomDetail.propertyName})
                                  </p>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-xs font-extrabold text-slate-900 block">
                                  ₹{Number(t.monthlyRent || selectedRoomDetail.rent || 0).toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] text-slate-400">Monthly Rent</span>
                              </div>
                            </div>

                            {/* Contact, WhatsApp, Lease Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60">
                              {/* Phone with WhatsApp and Call */}
                              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80">
                                <div className="flex items-center gap-1.5 text-slate-700">
                                  <Phone className="w-3.5 h-3.5 text-[#0052CC]" />
                                  <span className="font-bold text-xs">{t.phone || 'No phone'}</span>
                                </div>
                                {t.phone && (
                                  <div className="flex items-center gap-1">
                                    <a
                                      href={`https://wa.me/${t.phone.replace(/[^0-9]/g, '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="Chat on WhatsApp"
                                      className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-semibold border border-emerald-200 transition inline-flex items-center gap-0.5"
                                    >
                                      <MessageSquare className="w-2.5 h-2.5" />
                                      <span>WhatsApp</span>
                                    </a>
                                    <a
                                      href={`tel:${t.phone}`}
                                      title="Call Tenant"
                                      className="px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-[#0052CC] text-[10px] font-semibold border border-blue-200 transition inline-flex items-center gap-0.5"
                                    >
                                      <Phone className="w-2.5 h-2.5" />
                                      <span>Call</span>
                                    </a>
                                  </div>
                                )}
                              </div>

                              {/* Email */}
                              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-slate-200/80 text-slate-600 truncate">
                                <Mail className="w-3.5 h-3.5 text-[#0052CC] shrink-0" />
                                <span className="truncate">{t.email || 'No email provided'}</span>
                              </div>

                              {/* Move-in Date */}
                              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-slate-200/80 text-slate-600">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>Move-in: <strong className="text-slate-800">{t.moveInDate || 'Active'}</strong></span>
                              </div>

                              {/* Deposit */}
                              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80 text-slate-600">
                                <span>Deposit: <strong className="text-slate-800">₹{Number(t.deposit || 0).toLocaleString('en-IN')}</strong></span>
                                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  {t.depositStatus || 'Paid'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                          <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <h4 className="text-xs font-bold text-slate-700">No tenants assigned yet</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            This room currently has no registered occupants.
                          </p>
                          <button
                            onClick={() => {
                              const r = selectedRoomDetail;
                              setSelectedRoomDetail(null);
                              handleOpenAssignModal(r);
                            }}
                            className="mt-3 px-3 py-1.5 text-xs font-semibold bg-[#0052CC] text-white rounded-md hover:bg-[#0047B3] transition inline-flex items-center gap-1 cursor-pointer"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>+ Assign Tenant to Room {selectedRoomDetail.id}</span>
                          </button>
                        </div>
                      )}

                      {/* If room still has free beds, show assign banner */}
                      {!isFull && roomTenants.length > 0 && (
                        <div className="p-3 rounded-xl border border-dashed border-blue-200 bg-blue-50/50 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Bed className="w-4 h-4 text-[#0052CC]" />
                            <span className="text-xs font-semibold text-slate-700">
                              {freeBeds} bed(s) still vacant in Room {selectedRoomDetail.id}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              const r = selectedRoomDetail;
                              setSelectedRoomDetail(null);
                              handleOpenAssignModal(r);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold bg-[#0052CC] text-white rounded hover:bg-[#0047B3] transition cursor-pointer"
                          >
                            + Assign Another Tenant
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Transactions Tab */
                    <div className="space-y-2.5">
                      {roomTxs.length > 0 ? (
                        roomTxs.map((tx) => (
                          <div
                            key={tx.id || tx._id}
                            className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50/70 transition"
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                                  tx.type === 'income'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {tx.type === 'income' ? (
                                  <ArrowDownLeft className="w-4 h-4" />
                                ) : (
                                  <ArrowUpRight className="w-4 h-4" />
                                )}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900">{tx.title}</h4>
                                <p className="text-[11px] text-slate-500">
                                  {tx.date || 'Today'} · Method: <span className="font-semibold text-slate-700">{tx.method || 'UPI'}</span>
                                  {tx.notes ? ` · ${tx.notes}` : ''}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <span
                                className={`text-xs font-extrabold ${
                                  tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                                }`}
                              >
                                {tx.type === 'income' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                              </span>
                              <span className="block text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 mt-0.5">
                                {tx.status || 'Completed'}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                          <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <h4 className="text-xs font-bold text-slate-700">No transactions recorded for Room {selectedRoomDetail.id}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Rent collections or maintenance logs for this room will automatically show here.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                  <span className="text-[11px] text-slate-500">
                    Room {selectedRoomDetail.id} · {selectedRoomDetail.propertyName}
                  </span>
                  <div className="flex items-center gap-2">
                    {!isFull && (
                      <button
                        onClick={() => {
                          const r = selectedRoomDetail;
                          setSelectedRoomDetail(null);
                          handleOpenAssignModal(r);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold bg-[#0052CC] hover:bg-[#0047B3] text-white rounded-lg transition cursor-pointer flex items-center gap-1"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Assign Tenant</span>
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedRoomDetail(null)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
}
