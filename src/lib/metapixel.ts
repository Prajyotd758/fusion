declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

export const initiateCheckout = () => {
  console.log("this is the value : ", typeof window.fbq !== "undefined");

  if (typeof window.fbq !== "undefined") {
    window.fbq("track", "InitiateCheckout");
  }
};

export const purchase = (value: number) => {
  console.log("this is the value : ", typeof window.fbq !== "undefined");
  if (typeof window.fbq !== "undefined") {
    window.fbq("track", "Purchase", {
      value,
      currency: "INR",
    });
  }
};
