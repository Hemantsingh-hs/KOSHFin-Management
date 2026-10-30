// Initial Empty Schema Definitions for KoshFin
// All live application data is fetched from and persisted to MongoDB

export const initialUser = {
  name: "Property Owner",
  displayName: "Owner",
  email: "owner@koshfin.com",
  phone: "",
  role: "Property Owner & Finance Manager",
  initials: "PO",
  location: "Bangalore, India",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
};

export const initialSummary = {
  availableBalance: 0,
  balanceChange: 0,
  balanceMonth: "Current Month",
  monthlyIncome: 0,
  monthlyExpenses: 0,
  monthlySavings: 0,
  occupancyRate: 0,
  totalProperties: 0,
  totalRooms: 0,
  occupiedRooms: 0,
  vacantRooms: 0,
  monthlyRentTotal: 0,
  pendingRentTotal: 0,
};

// Purely empty collections — all populated directly from MongoDB
export const initialProperties = [];
export const initialRooms = [];
export const initialTenants = [];
export const initialTransactions = [];
export const initialReminders = [];
export const initialNotifications = [];

export const initialMessMenu = {
  days: [
    { day: "Monday", breakfast: "Idli Sambar + Vada + Filter Coffee", lunch: "Rice, Dal Tadka, Bhindi Masala, Curd", dinner: "Paneer Butter Masala, Roti, Jeera Rice, Gulab Jamun" },
    { day: "Tuesday", breakfast: "Poha + Sev + Masala Chai + Boiled Egg", lunch: "Rajma Chawal, Aloo Gobi, Papad", dinner: "Egg Curry / Malai Kofta, Chapati, Rice, Kheer" },
    { day: "Wednesday", breakfast: "Masala Dosa + Coconut Chutney + Coffee", lunch: "South Indian Thali, Rasam, Poriyal, Curd Rice", dinner: "Chicken Biryani / Veg Pulao, Raita, Salan" },
    { day: "Thursday", breakfast: "Aloo Paratha + Curd + Pickle + Chai", lunch: "Chole Bhature, Onion Salad, Buttermilk", dinner: "Dal Makhani, Mix Veg, Phulka, Rice" },
    { day: "Friday", breakfast: "Uttapam + Tomato Chutney + Tea", lunch: "Lemon Rice, Sambar, Potato Fry, Curd", dinner: "Kadai Paneer / Fish Fry, Naan, Pulao, Halwa" },
    { day: "Saturday", breakfast: "Puri Bhaji + Halwa + Coffee", lunch: "Veg Fried Rice + Manchurian Gravy", dinner: "Special Khichdi, Kadhi, Papad, Aloo Chokha" },
    { day: "Sunday", breakfast: "Special Chole Kulche / Upma + Chai", lunch: "Special Feast (Chicken Sukka / Paneer Tikka Thali)", dinner: "Light Dinner: Veg Biryani, Mirchi Salan, Ice Cream" }
  ],
  todayAttendance: {
    breakfast: 0,
    lunch: 0,
    snacks: 0,
    dinner: 0
  }
};
