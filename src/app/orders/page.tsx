"use client";
import { useState } from "react";
//
import OrderLookup from "./Components/OrderLookUp";
import OrderDetail, { Order } from "./Components/OrderDetails";

export const metadata = { robots: { index: false, follow: false } };

export default function SupportPage() {
  const [order, setOrder] = useState<null | Order>(null);

  return order ? (
    <OrderDetail
      order={order}
      setOrder={setOrder}
      onReset={() => setOrder(null)}
    />
  ) : (
    <OrderLookup onFound={setOrder} />
  );
}
