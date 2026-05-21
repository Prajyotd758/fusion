// Mock order data — replace with real API calls

export const MOCK_ORDERS = [
  {
    id: "ORD-1001",
    name: "Rahul Sharma",
    contact: "9876543210",
    email: "rahul@email.com",
    product: "Your Product Name",
    qty: 1,
    amount: 1999,
    payment: "COD",
    address: "Flat 4B, Andheri West, Mumbai, MH 400058",
    date: "2025-05-12",
    status: "completed",
  },
  {
    id: "ORD-1002",
    name: "Priya Mehta",
    contact: "9123456780",
    email: "priya@email.com",
    product: "Your Product Name",
    qty: 2,
    amount: 3998,
    payment: "Prepaid",
    address: "12 MG Road, Bangalore, KA 560001",
    date: "2025-05-13",
    status: "in_process",
  },
  {
    id: "ORD-1003",
    name: "Amit Verma",
    contact: "9988776655",
    email: "amit@email.com",
    product: "Your Product Name",
    qty: 1,
    amount: 1999,
    payment: "COD",
    address: "7 Connaught Place, New Delhi, DL 110001",
    date: "2025-05-14",
    status: "return",
  },
  {
    id: "ORD-1004",
    name: "Sunita Rao",
    contact: "9876001234",
    email: "sunita@email.com",
    product: "Your Product Name",
    qty: 3,
    amount: 5997,
    payment: "Prepaid",
    address: "88 Anna Nagar, Chennai, TN 600040",
    date: "2025-05-14",
    status: "replacement",
  },
  {
    id: "ORD-1005",
    name: "Karan Singh",
    contact: "9090909090",
    email: "karan@email.com",
    product: "Your Product Name",
    qty: 1,
    amount: 1999,
    payment: "COD",
    address: "3 Civil Lines, Jaipur, RJ 302006",
    date: "2025-05-15",
    status: "cancelled",
  },
  {
    id: "ORD-1006",
    name: "Neha Gupta",
    contact: "9654321098",
    email: "neha@email.com",
    product: "Your Product Name",
    qty: 2,
    amount: 3998,
    payment: "Prepaid",
    address: "B-12 Sector 18, Noida, UP 201301",
    date: "2025-05-15",
    status: "in_process",
  },
  {
    id: "ORD-1007",
    name: "Vikram Nair",
    contact: "9812345670",
    email: "vikram@email.com",
    product: "Your Product Name",
    qty: 1,
    amount: 1999,
    payment: "COD",
    address: "Plot 5, Banjara Hills, Hyderabad, TS 500034",
    date: "2025-05-16",
    status: "completed",
  },
  {
    id: "ORD-1008",
    name: "Divya Joshi",
    contact: "9741236540",
    email: "divya@email.com",
    payment: "COD",
    address: "22 Park Street, Kolkata, WB 700016",
    date: "2025-05-16",
    product: "Your Product Name",
    qty: 1,
    amount: 1999,
    status: "return",
  },
];

export const STATUS_OPTIONS = [
  { value: "in_process", label: "In Process", color: "amber" },
  { value: "delivered", label: "Delivered", color: "green" },
  { value: "return_initiated", label: "Return Initiated", color: "blue" },
  {
    value: "replacement_initiated",
    label: "Replacement Initiated",
    color: "purple",
  },
  { value: "return_complete", label: "Return Complete", color: "green" },
  {
    value: "replacement_complete",
    label: "Replacement Complete",
    color: "green",
  },
  { value: "cancelled", label: "Cancelled", color: "red" },
];

export function getStatusMeta(value) {
  return STATUS_OPTIONS.find((s) => s.value === value) || STATUS_OPTIONS[0];
}

// Simulate API fetch by order ID + contact
export function fetchOrderByIdAndContact(orderId, contact) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = MOCK_ORDERS.find(
        (o) =>
          o.id.toLowerCase() === orderId.toLowerCase() && o.contact === contact
      );
      if (order) resolve(order);
      else reject(new Error("No order found with this ID and contact number."));
    }, 1200);
  });
}

// Simulate fetching all orders (admin)
export function fetchAllOrders() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_ORDERS]), 900);
  });
}
