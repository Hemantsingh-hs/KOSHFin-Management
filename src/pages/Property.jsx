import React, { useState, useRef, useMemo } from 'react';
import {
  Building2,
  Plus,
  Camera,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Check,
  Trash2,
  X,
  SlidersHorizontal,
  Users,
  Layers,
  MoreVertical,
  Edit2,
  ChevronRight,
  AlertCircle,
  ArrowUpRight,
  DoorOpen,
  Search,
  Filter,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  MapPin,
  ExternalLink,
  UtensilsCrossed,
  BarChart3,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PROPERTY_PRESET_IMAGES, processImageFile } from '../utils/imageHelper';

export default function Property({ setPage = () => {} }) {
  const {
    properties,
    summary,
    setIsAddModalOpen,
    setAddModalType,
    updateProperty,
    deleteProperty,
    rooms = [],
    tenants = [],
    addRoom,
    setSelectedProperty,
  } = useApp();

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // Active Menu Dropdown (Property ID)
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modal States
  const [editingImageProp, setEditingImageProp] = useState(null);
  const [tempImage, setTempImage] = useState('');
  const [imageTab, setImageTab] = useState('presets'); // 'presets' | 'upload' | 'url'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Configure Structure Modal State
  const [structureProp, setStructureProp] = useState(null);
  const [newFloorRoom, setNewFloorRoom] = useState({
    floor: '1st Floor',
    roomNumber: '',
    type: 'Single Sharing',
    rent: '',
  });
  const [isAddingRoom, setIsAddingRoom] = useState(false);

  // Edit Details Modal State
  const [editDetailsProp, setEditDetailsProp] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    type: 'PG',
    address: '',
    price: '',
    floors: '',
    totalRooms: '',
  });

  // Delete Confirmation State
  const [deleteConfirmProp, setDeleteConfirmProp] = useState(null);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      const name = (prop.name || '').toLowerCase();
      const addr = (prop.shortAddress || prop.address || '').toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || name.includes(q) || addr.includes(q);
      const matchesType =
        selectedType === 'All' ||
        prop.type === selectedType ||
        (selectedType === 'Mess' &&
          (prop.type === 'Mess & Tiffin' || (prop.type && prop.type.toLowerCase().includes('mess'))));
      return matchesSearch && matchesType;
    });
  }, [properties, searchQuery, selectedType]);

  // Handle Photo Editor
  const handleOpenImageEditor = (prop) => {
    setEditingImageProp(prop);
    setTempImage(prop.image || PROPERTY_PRESET_IMAGES[0].url);
    setImageTab('presets');
    setActiveMenuId(null);
  };

  const handleSavePropertyImage = async () => {
    if (!editingImageProp) return;
    setIsSavingImage(true);
    try {
      await updateProperty(editingImageProp.id || editingImageProp._id, {
        image: tempImage || PROPERTY_PRESET_IMAGES[0].url,
      });
      setEditingImageProp(null);
    } catch (err) {
      console.error('Failed to update property image:', err);
    } finally {
      setIsSavingImage(false);
    }
  };

  // Handle Configure Structure Modal
  const handleOpenStructure = (prop) => {
    setStructureProp(prop);
    setActiveMenuId(null);
    const existingFloors = getDistinctFloors(prop);
    setNewFloorRoom({
      floor: existingFloors[0] || '1st Floor',
      roomNumber: '',
      type: 'Single Sharing',
      rent: prop.price || 7500,
    });
  };

  // Handle Quick Edit
  const handleOpenEditDetails = (prop) => {
    setEditDetailsProp(prop);
    setEditForm({
      name: prop.name || '',
      type: prop.type || 'PG',
      address: prop.address || prop.shortAddress || '',
      price: prop.price || prop.monthlyRent || '',
      floors: prop.floors || '',
      totalRooms: prop.totalRooms || '',
      monthlyUsers: prop.monthlyUsers || '',
      dailyUsers: prop.dailyUsers || '',
      monthlyRate: prop.monthlyRate || prop.price || '',
      dailyRate: prop.dailyRate || '',
    });
    setActiveMenuId(null);
  };

  const handleSaveEditDetails = async (e) => {
    e.preventDefault();
    if (!editDetailsProp) return;
    const isMess = editForm.type === 'Mess' || editForm.type === 'Mess & Tiffin';
    try {
      await updateProperty(editDetailsProp.id || editDetailsProp._id, {
        name: editForm.name,
        type: editForm.type,
        address: editForm.address,
        price: Number(editForm.price) || 0,
        floors: isMess ? undefined : (Number(editForm.floors) || undefined),
        totalRooms: isMess ? 0 : (Number(editForm.totalRooms) || undefined),
        monthlyUsers: isMess ? (Number(editForm.monthlyUsers) || 0) : undefined,
        dailyUsers: isMess ? (Number(editForm.dailyUsers) || 0) : undefined,
        monthlyRate: isMess ? (Number(editForm.monthlyRate) || Number(editForm.price) || 0) : undefined,
        dailyRate: isMess ? (Number(editForm.dailyRate) || 100) : undefined,
      });
      setEditDetailsProp(null);
    } catch (err) {
      console.error('Failed to update property details:', err);
    }
  };

  // Handle Delete Property
  const handleConfirmDelete = async () => {
    if (!deleteConfirmProp) return;
    try {
      await deleteProperty(deleteConfirmProp.id || deleteConfirmProp._id);
      setDeleteConfirmProp(null);
    } catch (err) {
      console.error('Failed to delete property:', err);
    }
  };

  // Helper to get rooms for a property
  const getPropertyRooms = (prop) => {
    if (!prop) return [];
    const propId = String(prop.id || prop._id || '');
    const propName = (prop.name || '').trim().toLowerCase();
    return rooms.filter((r) => {
      const rPropName = (r.propertyName || '').trim().toLowerCase();
      const rPropId = String(r.propertyId || '');
      return (propName && rPropName === propName) || (propId && rPropId === propId);
    });
  };

  // Helper to get distinct floors for a property
  const getDistinctFloors = (prop) => {
    const propRooms = getPropertyRooms(prop);
    const setOfFloors = new Set(propRooms.map((r) => r.floor).filter(Boolean));
    if (setOfFloors.size > 0) {
      return Array.from(setOfFloors);
    }
    const numFloors = Number(prop.floors);
    if (numFloors && numFloors > 0) {
      return Array.from({ length: numFloors }, (_, i) => `${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Floor`);
    }
    return [];
  };

  // Add room inside Structure Modal
  const handleAddRoomToFloor = async (e) => {
    e.preventDefault();
    if (!structureProp || !newFloorRoom.roomNumber.trim()) return;

    setIsAddingRoom(true);
    try {
      await addRoom({
        id: newFloorRoom.roomNumber.trim(),
        propertyName: structureProp.name,
        propertyId: structureProp.id || structureProp._id,
        floor: newFloorRoom.floor,
        type: newFloorRoom.type,
        rent: Number(newFloorRoom.rent) || Number(structureProp.price) || 7500,
        status: 'Vacant',
        occupants: [],
      });
      setNewFloorRoom((prev) => ({ ...prev, roomNumber: '' }));
    } catch (err) {
      console.error('Failed to add room to floor:', err);
    } finally {
      setIsAddingRoom(false);
    }
  };

  return (
    <div className="space-y-6 pb-14 text-slate-800">
      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Registered Properties</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#5243C2]/10 text-[#5243C2] border border-[#5243C2]/20">
              {properties.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your buildings, configure floor & room structure, track occupancy, and monitor collection.
          </p>
        </div>

        {/* Right Header Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2] shadow-xs placeholder:text-slate-400"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold gap-1">
            {['All', 'PG', 'Apartment', 'Hostel', 'Mess'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] ${
                  selectedType === t
                    ? 'bg-white text-[#5243C2] font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Add Property Button */}
          <button
            onClick={() => {
              setAddModalType('property');
              setIsAddModalOpen(true);
            }}
            className="px-3.5 py-2 bg-[#5243C2] hover:bg-[#4335A7] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Properties */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Properties</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-slate-900">{properties.length}</span>
            <Building2 className="w-4 h-4 text-[#5243C2]/70" />
          </div>
        </div>

        {/* Total Rooms */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Rooms</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-slate-900">{summary.totalRooms}</span>
            <DoorOpen className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Occupied */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Occupied</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-emerald-600">{summary.occupiedRooms}</span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              {summary.occupancyRate}%
            </span>
          </div>
        </div>

        {/* Vacant */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Vacant</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-rose-500">{summary.vacantRooms}</span>
            <span className="text-[10px] font-medium text-slate-400">Ready</span>
          </div>
        </div>

        {/* Monthly Rent */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Rent</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-[#5243C2]">
              ₹{Math.round(summary.monthlyRentTotal / 1000)}k
            </span>
            <TrendingUp className="w-4 h-4 text-[#5243C2]" />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pending</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-amber-500">
              ₹{Math.round(summary.pendingRentTotal / 1000)}k
            </span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Occupancy Rate Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5243C2]/10 text-[#5243C2] flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">Portfolio Occupancy Rate</span>
              <span className="text-xs font-extrabold text-[#5243C2]">{summary.occupancyRate}%</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
              <span>{summary.occupiedRooms} occupied units</span>
              <span>•</span>
              <span>{summary.vacantRooms} vacant units</span>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-64 h-2.5 bg-slate-100 rounded-full overflow-hidden shrink-0">
          <div
            className="h-full bg-gradient-to-r from-[#5243C2] to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, summary.occupancyRate))}%` }}
          />
        </div>
      </div>

      {/* Property Cards Grid - High Contrast, Clean White Card Design matching user reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((prop) => {
          const propIdStr = String(prop.id || prop._id || '');
          const shortId = propIdStr.length > 8 ? propIdStr.slice(-8) : propIdStr || 'a2fb213d';
          const isMess =
            prop.type === 'Mess' ||
            prop.type === 'Mess & Tiffin' ||
            (prop.type && prop.type.toLowerCase().includes('mess'));

          // Computed rooms and floors from live rooms collection
          const propRooms = getPropertyRooms(prop);
          const distinctFloors = getDistinctFloors(prop);
          const floorsCount = distinctFloors.length > 0 ? distinctFloors.length : Number(prop.floors) || 0;

          const totalRoomsCount =
            propRooms.length > 0 ? propRooms.length : Number(prop.totalRooms ?? 0);
          const occupiedCount =
            propRooms.filter(
              (r) =>
                (r.occupants && r.occupants.length > 0) ||
                r.status === 'Occupied'
            ).length || Number(prop.occupiedRooms ?? 0);
          const vacantCount = Math.max(0, totalRoomsCount - occupiedCount);
          const occupancyRate =
            totalRoomsCount > 0
              ? Math.round((occupiedCount / totalRoomsCount) * 100)
              : Number(prop.occupancyRate ?? 0);

          const monthlyRent =
            propRooms.length > 0
              ? propRooms.reduce((sum, r) => sum + Number(r.rent || r.price || 0), 0)
              : Number(prop.monthlyRent || prop.price || 0);
          const pendingRent = Number(prop.pendingRent ?? 0);

          // Card image
          const bgImage =
            prop.image ||
            PROPERTY_PRESET_IMAGES[0].url;

          return (
            <div
              key={prop.id || prop._id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Top Banner Image with Overlay (Direct Reference to Image 2) */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900 rounded-t-3xl">
                {/* Background Image Layer */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${bgImage})` }}
                />

                {/* Smooth Dark Gradient for Crystal Clear Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/25" />

                {/* Top Badges & Options Overlay */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-black/40 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-white/20 shadow-xs">
                      {prop.type || 'PG'}
                    </span>
                    {occupancyRate > 0 && (
                      <span className="rounded-full bg-emerald-500/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                        {occupancyRate}% Occupied
                      </span>
                    )}
                  </div>

                  {/* Actions: Photo & 3-Dot Menu */}
                  <div className="flex items-center gap-1 relative">
                    <button
                      onClick={() => handleOpenImageEditor(prop)}
                      className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white/90 hover:text-white border border-white/20 transition cursor-pointer shadow-xs"
                      title="Update property photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() =>
                        setActiveMenuId(activeMenuId === propIdStr ? null : propIdStr)
                      }
                      className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white/90 hover:text-white border border-white/20 transition cursor-pointer shadow-xs"
                      title="More actions"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>

                    {/* Context Menu Dropdown */}
                    {activeMenuId === propIdStr && (
                      <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 text-slate-800">
                        {isMess ? (
                          <>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                setPage('Mess Reports');
                              }}
                              className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                            >
                              <UtensilsCrossed className="w-3.5 h-3.5 text-[#5243C2]" />
                              <span>Mess Reports</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                setPage('Mess Management');
                              }}
                              className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Clock className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Daily Attendance</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleOpenStructure(prop)}
                            className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Layers className="w-3.5 h-3.5 text-[#5243C2]" />
                            <span>Configure Structure</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditDetails(prop)}
                          className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                          <span>Edit Details</span>
                        </button>
                        {!isMess && (
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              setPage('Tenants');
                            }}
                            className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5 text-blue-500" />
                            <span>View Tenants</span>
                          </button>
                        )}
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            setDeleteConfirmProp(prop);
                          }}
                          className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Property</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Overlay Info: Title & ID (Identical to Image 2 Reference) */}
                <div className="absolute bottom-3 left-4 right-4 z-10">
                  <h3 className="text-xl font-black text-white tracking-tight drop-shadow-md truncate">
                    {prop.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200/95 mt-0.5 truncate">
                    <span className="font-mono text-slate-300">ID: {shortId}</span>
                    {(prop.address || prop.shortAddress) && (
                      <>
                        <span className="text-slate-400">•</span>
                        <span className="truncate text-slate-200">
                          {prop.shortAddress || prop.address}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body (Clean White with Structured Stats - Exactly like Image 2) */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                {/* Clean Inner Stat Container (Monthly & Daily Users for Mess, Floors & Rooms for PG) */}
                {isMess ? (
                  <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4 flex items-center justify-around text-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                    {/* Monthly Users */}
                    <div className="flex-1">
                      <div className="text-2xl font-black text-slate-800 tracking-tight">
                        {prop.monthlyUsers ?? 0}
                      </div>
                      <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">
                        MONTHLY USERS
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="w-[1px] h-10 bg-slate-200" />

                    {/* Daily Users */}
                    <div className="flex-1">
                      <div className="text-2xl font-black text-slate-800 tracking-tight">
                        {prop.dailyUsers ?? 0}
                      </div>
                      <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">
                        DAILY USERS
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4 flex items-center justify-around text-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                    {/* Floors */}
                    <div className="flex-1">
                      <div className="text-2xl font-black text-slate-800 tracking-tight">
                        {floorsCount}
                      </div>
                      <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">
                        FLOORS
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="w-[1px] h-10 bg-slate-200" />

                    {/* Rooms */}
                    <div className="flex-1">
                      <div className="text-2xl font-black text-slate-800 tracking-tight">
                        {totalRoomsCount}
                      </div>
                      <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">
                        ROOMS
                      </div>
                    </div>
                  </div>
                )}

                {/* Financial & Status Summary Line */}
                {isMess ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="text-slate-500 font-medium">Monthly Plan Rate</span>
                      <span className="font-extrabold text-slate-900">
                        ₹{Number(prop.monthlyRate || prop.price || 0).toLocaleString('en-IN')}{' '}
                        <span className="text-[10px] font-medium text-slate-400">/ mo</span>
                      </span>
                    </div>

                    {/* Dues Status Bar */}
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-500 font-medium">Daily Rate:</span>
                        <span className="font-bold text-emerald-600">
                          ₹{prop.dailyRate || 100} / meal
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-bold">
                        {Number(prop.monthlyUsers || 0) + Number(prop.dailyUsers || 0)} registered diners
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="text-slate-500 font-medium">Monthly Rent</span>
                      <span className="font-extrabold text-slate-900">
                        ₹{monthlyRent.toLocaleString('en-IN')}{' '}
                        <span className="text-[10px] font-medium text-slate-400">/ mo</span>
                      </span>
                    </div>

                    {/* Dues Status Bar */}
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-500 font-medium">Collection:</span>
                        {pendingRent > 0 ? (
                          <span className="font-bold text-amber-600">
                            ₹{pendingRent.toLocaleString('en-IN')} pending
                          </span>
                        ) : (
                          <span className="font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>All Clear</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {occupiedCount} booked · {vacantCount} vacant
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons Section */}
                <div className="space-y-2 pt-1">
                  {isMess ? (
                    <>
                      {/* Hero Button: Mess Reports & Diners */}
                      <button
                        onClick={() => setPage('Mess Reports')}
                        className="w-full py-3.5 px-4 rounded-2xl bg-[#5243C2] hover:bg-[#4335A7] text-white font-bold text-sm shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <UtensilsCrossed className="w-4 h-4" />
                        <span>Mess Reports & Diners</span>
                      </button>

                      {/* Secondary Quick Action Row */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPage('Mess Management')}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition text-center cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Daily Attendance</span>
                        </button>

                        <button
                          onClick={() => setPage('Mess Reports')}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition text-center cursor-pointer flex items-center justify-center gap-1"
                        >
                          <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                          <span>Mess Reports</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Hero Button: Configure Structure (Direct Match to Image 2) */}
                      <button
                        onClick={() => handleOpenStructure(prop)}
                        className="w-full py-3.5 px-4 rounded-2xl bg-[#5243C2] hover:bg-[#4335A7] text-white font-bold text-sm shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Configure Structure</span>
                      </button>

                      {/* Secondary Quick Action Row */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (setSelectedProperty) setSelectedProperty(prop);
                            setPage('Rooms');
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition text-center cursor-pointer flex items-center justify-center gap-1"
                        >
                          <DoorOpen className="w-3.5 h-3.5 text-slate-500" />
                          <span>Manage Rooms</span>
                        </button>

                        <button
                          onClick={() => setPage('Tenants')}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition text-center cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          <span>View Tenants</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="col-span-full bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No properties found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No properties match "${searchQuery}". Try clearing search filters.`
                : 'Add your first property to start organizing floors, rooms, and tenants.'}
            </p>
            <button
              onClick={() => {
                setAddModalType('property');
                setIsAddModalOpen(true);
              }}
              className="mt-4 px-4 py-2 bg-[#5243C2] hover:bg-[#4335A7] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Property</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 1. Configure Structure Modal */}
      {/* ========================================================= */}
      {structureProp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#5243C2]/10 text-[#5243C2] flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Configure Building Structure</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {structureProp.name} • {structureProp.type || 'Property'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStructureProp(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-5 overflow-y-auto flex-1">
              {/* Structure Summary Pills */}
              <div className="grid grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Floors</span>
                  <p className="text-lg font-black text-slate-800">
                    {getDistinctFloors(structureProp).length || Number(structureProp.floors) || 1}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Configured Rooms</span>
                  <p className="text-lg font-black text-slate-800">
                    {getPropertyRooms(structureProp).length}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Capacity</span>
                  <p className="text-lg font-black text-[#5243C2]">
                    {structureProp.totalRooms || getPropertyRooms(structureProp).length}
                  </p>
                </div>
              </div>

              {/* Floor-by-Floor Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#5243C2]" />
                  <span>Floor Layout & Rooms</span>
                </h4>

                {getDistinctFloors(structureProp).length === 0 && (
                  <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    No floor allocations set yet. Add rooms below to assign them to floors.
                  </p>
                )}

                <div className="space-y-2">
                  {getDistinctFloors(structureProp).map((floorName) => {
                    const floorRooms = getPropertyRooms(structureProp).filter(
                      (r) => r.floor === floorName
                    );
                    return (
                      <div
                        key={floorName}
                        className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#5243C2]" />
                            {floorName}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {floorRooms.length} rooms
                          </span>
                        </div>

                        {floorRooms.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {floorRooms.map((r) => (
                              <span
                                key={r.id}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                  r.status === 'Occupied' || (r.occupants && r.occupants.length > 0)
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-slate-50 text-slate-700 border-slate-200'
                                }`}
                              >
                                Room {r.id} · ₹{r.rent || r.price}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 italic">No rooms on this floor yet</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Add Room to Floor Form */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#5243C2]" />
                  <span>Quick Add Room to Floor</span>
                </h4>

                <form onSubmit={handleAddRoomToFloor} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Floor Name / Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ground Floor, 1st Floor"
                        value={newFloorRoom.floor}
                        onChange={(e) =>
                          setNewFloorRoom({ ...newFloorRoom, floor: e.target.value })
                        }
                        required
                        className="w-full px-3 py-1.5 bg-white text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Room Number / Label
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 101, 201-A"
                        value={newFloorRoom.roomNumber}
                        onChange={(e) =>
                          setNewFloorRoom({ ...newFloorRoom, roomNumber: e.target.value })
                        }
                        required
                        className="w-full px-3 py-1.5 bg-white text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Sharing Type
                      </label>
                      <select
                        value={newFloorRoom.type}
                        onChange={(e) =>
                          setNewFloorRoom({ ...newFloorRoom, type: e.target.value })
                        }
                        className="w-full px-3 py-1.5 bg-white text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                      >
                        <option value="Single Sharing">Single Sharing</option>
                        <option value="Double Sharing">Double Sharing</option>
                        <option value="Triple Sharing">Triple Sharing</option>
                        <option value="Studio Apartment">Studio Apartment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Monthly Rent (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 7500"
                        value={newFloorRoom.rent}
                        onChange={(e) =>
                          setNewFloorRoom({ ...newFloorRoom, rent: e.target.value })
                        }
                        className="w-full px-3 py-1.5 bg-white text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isAddingRoom || !newFloorRoom.roomNumber.trim()}
                    className="w-full py-2 bg-[#5243C2] hover:bg-[#4335A7] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isAddingRoom ? (
                      <span>Adding Room...</span>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Room to Structure</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
              <button
                type="button"
                onClick={() => {
                  setStructureProp(null);
                  setPage('Rooms');
                }}
                className="text-xs font-bold text-[#5243C2] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open Full Room Matrix</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setStructureProp(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. Quick Edit Property Details Modal */}
      {/* ========================================================= */}
      {editDetailsProp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Edit2 className="w-4 h-4 text-[#5243C2]" />
                <span>Edit Property Details</span>
              </h3>
              <button
                onClick={() => setEditDetailsProp(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditDetails} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Property Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Type</label>
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2] bg-white font-medium"
                  >
                    <option value="PG">PG (Paying Guest)</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Room">Single Room</option>
                    <option value="Mess">Mess & Tiffin</option>
                  </select>
                </div>

                {editForm.type === 'Mess' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Dining Capacity</label>
                    <input
                      type="number"
                      value={editForm.totalRooms || ''}
                      onChange={(e) => setEditForm({ ...editForm, totalRooms: e.target.value })}
                      placeholder="e.g. 50"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Floors</label>
                    <input
                      type="number"
                      value={editForm.floors}
                      onChange={(e) => setEditForm({ ...editForm, floors: e.target.value })}
                      placeholder="e.g. 2"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Address / Location</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                />
              </div>

              {editForm.type === 'Mess' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Monthly Plan Fee (₹)</label>
                      <input
                        type="number"
                        value={editForm.monthlyRate || editForm.price || ''}
                        onChange={(e) => setEditForm({ ...editForm, monthlyRate: e.target.value, price: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Daily / Meal Rate (₹)</label>
                      <input
                        type="number"
                        value={editForm.dailyRate || ''}
                        onChange={(e) => setEditForm({ ...editForm, dailyRate: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Monthly Users</label>
                      <input
                        type="number"
                        value={editForm.monthlyUsers}
                        onChange={(e) => setEditForm({ ...editForm, monthlyUsers: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Daily Users</label>
                      <input
                        type="number"
                        value={editForm.dailyUsers}
                        onChange={(e) => setEditForm({ ...editForm, dailyUsers: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Total Capacity</label>
                    <input
                      type="number"
                      value={editForm.totalRooms}
                      onChange={(e) => setEditForm({ ...editForm, totalRooms: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Base Price / Rent</label>
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditDetailsProp(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5243C2] hover:bg-[#4335A7] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. Delete Confirmation Modal */}
      {/* ========================================================= */}
      {deleteConfirmProp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-5 border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Property?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove <span className="font-bold text-slate-800">{deleteConfirmProp.name}</span>? This property record will be permanently deleted.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmProp(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                Delete Property
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. Edit Property Background Photo Modal */}
      {/* ========================================================= */}
      {editingImageProp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#5243C2]" />
                  <span>Update Property Photo</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {editingImageProp.name} ({editingImageProp.type || 'Property'})
                </p>
              </div>
              <button
                onClick={() => setEditingImageProp(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Tab Selector */}
              <div className="grid grid-cols-3 bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setImageTab('presets')}
                  className={`py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    imageTab === 'presets'
                      ? 'bg-white text-[#5243C2] shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Presets</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    imageTab === 'upload'
                      ? 'bg-white text-[#5243C2] shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    imageTab === 'url'
                      ? 'bg-white text-[#5243C2] shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Image URL</span>
                </button>
              </div>

              {/* Tab 1: Presets */}
              {imageTab === 'presets' && (
                <div className="grid grid-cols-3 gap-2">
                  {PROPERTY_PRESET_IMAGES.map((preset) => {
                    const isSelected = tempImage === preset.url;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => setTempImage(preset.url)}
                        className={`relative h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition group ${
                          isSelected
                            ? 'border-[#5243C2] ring-2 ring-indigo-200 scale-[1.02]'
                            : 'border-transparent hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-end p-1.5">
                          <span className="text-[10px] font-bold text-white truncate drop-shadow-xs">
                            {preset.name}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-[#5243C2] text-white rounded-full p-0.5 shadow-sm">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Upload */}
              {imageTab === 'upload' && (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsProcessing(true);
                      processImageFile(file, (optimizedUrl) => {
                        setTempImage(optimizedUrl);
                        setIsProcessing(false);
                      });
                    }}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#5243C2] rounded-xl p-5 text-center cursor-pointer transition bg-slate-50/60 hover:bg-indigo-50/30 group"
                  >
                    <Upload className="w-6 h-6 mx-auto text-slate-400 group-hover:text-[#5243C2] transition mb-1.5" />
                    <p className="text-xs font-bold text-slate-700 group-hover:text-[#5243C2]">
                      {isProcessing ? 'Optimizing photo...' : 'Click to browse property photo'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">JPEG, PNG, WebP supported</p>
                  </div>
                </div>
              )}

              {/* Tab 3: URL */}
              {imageTab === 'url' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Image Web Link (URL)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or direct image URL"
                    value={tempImage}
                    onChange={(e) => setTempImage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#5243C2]"
                  />
                  <p className="text-[10px] text-slate-400">Direct links from Unsplash, Google Images, Cloudinary, etc.</p>
                </div>
              )}

              {/* Live Card Preview */}
              {tempImage && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Card Header Preview</label>
                  <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-sm h-32 flex flex-col justify-end p-3.5 group">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${tempImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/25" />

                    <div className="relative z-10 flex items-end justify-between">
                      <div>
                        <h4 className="text-sm font-extrabold text-white drop-shadow-xs">
                          {editingImageProp.name}
                        </h4>
                        <p className="text-[11px] text-slate-300 drop-shadow-xs">
                          ID: {String(editingImageProp.id || editingImageProp._id || '').slice(-8)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setTempImage('')}
                        className="text-white/80 hover:text-white bg-black/40 hover:bg-rose-600/80 p-1.5 rounded-lg backdrop-blur-xs transition cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-3.5 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50">
              <button
                type="button"
                onClick={() => setEditingImageProp(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-md transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePropertyImage}
                disabled={isSavingImage || !tempImage}
                className="px-4 py-1.5 bg-[#5243C2] hover:bg-[#4335A7] disabled:opacity-50 text-white text-xs font-semibold rounded-md shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                {isSavingImage ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Photo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
