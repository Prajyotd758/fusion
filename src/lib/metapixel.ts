declare global {
    interface Window {
      fbq: (...args: any[]) => void;
    }
  }
  
  export const initiateCheckout = () => {
    if (typeof window.fbq !== "undefined") {
      window.fbq("track", "InitiateCheckout");
    }
  };
  
  export const purchase = (value: number) => {
    if (typeof window.fbq !== "undefined") {
      window.fbq("track", "Purchase", {
        value,
        currency: "INR",
      });
    }
  };