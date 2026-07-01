"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { purchase } from '../../lib/metapixel';

//
import Loader from "../../components/reusable/Loader";
import Field from "@/src/components/reusable/Field";
import ErrorModal from "@/src/components/reusable/ErrorModal";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

type FormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  payment: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

export type errorType = {
  visible: boolean;
  title: string;
  message: string;
};

// Valid Indian states
const validStates = [
  "andhra pradesh",
  "arunachal pradesh",
  "assam",
  "bihar",
  "chhattisgarh",
  "goa",
  "gujarat",
  "haryana",
  "himachal pradesh",
  "jharkhand",
  "karnataka",
  "kerala",
  "madhya pradesh",
  "maharashtra",
  "manipur",
  "meghalaya",
  "mizoram",
  "nagaland",
  "odisha",
  "punjab",
  "rajasthan",
  "sikkim",
  "tamil nadu",
  "telangana",
  "tripura",
  "uttar pradesh",
  "uttarakhand",
  "west bengal",
  "delhi",
];

export default function BuyPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment: "cod",
  });

  const [error, setError] = useState<errorType>({
    visible: false,
    title: "",
    message: "",
  });

  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [errors, setErrors] = useState<Errors>({});

  const validate = (): Errors => {
    const e: Errors = {};

    // Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const pincodeRegex = /^\d{6}$/;

    // Name
    if (!form.name.trim()) {
      e.name = "Name is required";
    }

    // Email
    if (form.email.trim() && !emailRegex.test(form.email)) {
      e.email = "Please enter a valid email";
    }

    // Phone
    if (!form.phone.trim()) {
      e.phone = "Phone is required";
    } else if (!phoneRegex.test(form.phone)) {
      e.phone =
        "Phone number must be exactly 10 digits and should not contain any letters";
    }

    // Address
    if (!form.address.trim()) {
      e.address = "Address is required";
    }

    // City
    if (!form.city.trim()) {
      e.city = "City is required";
    } else if (!/^[a-zA-Z\s]+$/.test(form.city)) {
      e.city = "Please enter a valid city";
    }

    // State
    if (!form.state.trim()) {
      e.state = "State is required";
    } else if (!validStates.includes(form.state.trim().toLowerCase())) {
      e.state = "Please enter a valid Indian state";
    }

    // Pincode
    if (!form.pincode.trim()) {
      e.pincode = "Pincode is required";
    } else if (!pincodeRegex.test(form.pincode)) {
      e.pincode = "Pincode must be exactly 6 digits";
    }

    return e;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errs = validate();

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setOtpSent(true);
  };

  const saveUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          status: "in_process",
          quantity: 1,
          amount: "999",
          product: "AirGrip",
          reviewAdded: false,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError({
          visible: true,
          title: "Something went wrong",
          message: "Please try again later",
        });
      }
    } catch (error) {
      setError({
        visible: true,
        title: "Something went wrong",
        message: "Try again after some time!",
      });
    } finally {
      setLoading(false);
    }
  };

  if (error.visible) {
    return (
      <ErrorModal
        open={error.visible}
        onClose={() =>
          setError((prev) => ({
            visible: false,
            title: "",
            message: "",
          }))
        }
        title={error.title}
        message={error.message}
      />
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--bg) px-4">
        <div className="text-center max-w-md animate-scale-in">
          <div className="w-16 h-16 bg-(--text-primary) rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-3xl text-(--text-primary) mb-2">Order Placed!</h1>
          <p className="text-(--text-secondary) mb-6">
            Thank you, {form.name}. Your order is confirmed.
          </p>

          <Link
            href="/"
            className="inline-block px-6 py-3 bg-(--text-primary) text-white text-sm font-medium rounded-xl hover:bg-(--accent-hover) transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="recaptcha-container"></div>
      {loading ? (
        <Loader />
      ) : otpSent ? (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-7 animate-scale-in border border-(--border) relative">
            {/* Top Icon */}
            <div className="w-14 h-14 rounded-2xl bg-(--badge-bg) flex items-center justify-center mx-auto mb-5 text-2xl">
              🛍️
            </div>

            {/* Heading */}
            <h2 className="text-2xl text-center text-(--text-primary) mb-1">
              Confirm your order
            </h2>
            <p className="text-sm text-center text-(--text-secondary) mb-6 leading-relaxed">
              Please review your details before placing the order
              <br />
              This details will be shared with delivery partner.
            </p>

            {/* Order Details Card */}
            <div className="bg-(--bg) rounded-2xl border border-(--border) divide-y divide-(--border) mb-6">
              {/* Name */}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-base">👤</span>
                <div>
                  <p className="text-xs text-(--text-secondary)">Name</p>
                  <p className="text-sm font-medium text-(--text-primary)">
                    {form.name}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-base">📞</span>
                <div>
                  <p className="text-xs text-(--text-secondary)">Contact</p>
                  <p className="text-sm font-medium text-(--text-primary)">
                    +91 {form.phone}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-base">📍</span>
                <div>
                  <p className="text-xs text-(--text-secondary)">
                    Delivery Address
                  </p>
                  <p className="text-sm font-medium text-(--text-primary)">
                    {form.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="flex-1 py-4 rounded-xl text-sm font-medium border border-(--border) text-(--text-secondary) hover:bg-(--bg) transition-all"
              >
                Edit details
              </button>
              <button
                type="button"
                onClick={saveUser}
                className="flex-1 py-4 bg-(--text-primary) text-white rounded-xl text-sm font-medium hover:bg-(--accent-hover) transition-all"
              >
                Confirm & Place order →
              </button>
            </div>

            {/* Close */}
            <button
              onClick={() => setOtpSent(false)}
              className="absolute top-4 right-4 text-(--text-muted) hover:text-(--text-primary)"
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-(--bg)">
          {/* Header */}
          <nav className="border-b border-(--border) bg-white/80 backdrop-blur-md sticky top-0 z-40">
            <div className="max-w-[94%] mx-auto px-6 h-16 flex items-center justify-between">
              <Link href="/" className="  text-xl text-(--text-primary)">
                <div className="flex items-center gap-2">
                  <Image src="/logo.png" alt="Logo" width={40} height={40} />
                  arceus
                </div>
              </Link>
              <span className="text-sm text-(--text-muted)">
                Secure Checkout
              </span>
            </div>
          </nav>

          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Form */}
              <div className="lg:col-span-3 animate-fade-up">
                <h1 className="  text-3xl text-(--text-primary) mb-2">
                  Complete your order
                </h1>
                <p className="text-(--text-secondary) text-sm mb-10">
                  Fill in your details to place the order.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field
                      label="Full Name"
                      name="name"
                      placeholder="John doe"
                      form={form}
                      setForm={setForm}
                      errors={errors}
                      setErrors={setErrors}
                    />
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="john@email.com"
                      form={form}
                      setForm={setForm}
                      errors={errors}
                      setErrors={setErrors}
                    />
                  </div>
                  <Field
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    length={10}
                    placeholder="9876543210"
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    setErrors={setErrors}
                  />
                  <Field
                    label="Delivery Address"
                    name="address"
                    placeholder="Flat / House no, Street, Area"
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    setErrors={setErrors}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Field
                      label="City"
                      name="city"
                      placeholder="Mumbai"
                      form={form}
                      setForm={setForm}
                      errors={errors}
                      setErrors={setErrors}
                    />
                    <Field
                      label="State"
                      name="state"
                      placeholder="Maharashtra"
                      form={form}
                      setForm={setForm}
                      errors={errors}
                      setErrors={setErrors}
                    />
                    <Field
                      label="Pincode"
                      name="pincode"
                      placeholder="400001"
                      length={6}
                      form={form}
                      setForm={setForm}
                      errors={errors}
                      setErrors={setErrors}
                    />
                  </div>

                  {/* Payment */}
                  <div>
                    <label className="text-sm font-medium text-(--text-primary) block mb-3">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "cod", label: "Cash on Delivery", icon: "💵" },
                        // { value: "prepaid", label: "Pay Online", icon: "💳" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          disabled={opt.value === "prepaid"}
                          type="button"
                          // onClick={() =>
                          //   setForm((f) => ({ ...f, payment: opt.value }))
                          // }
                          className={`p-4 rounded-xl border text-left transition-all
                        ${
                          form.payment === opt.value
                            ? "border-(--text-primary) bg-(--text-primary) text-white"
                            : "border-(--border) bg-(--border) hover:border-(--text-secondary)"
                        }`}
                        >
                          <span className="text-xl block mb-1">{opt.icon}</span>
                          <span className="text-sm font-medium">
                            {opt.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => purchase(999)}
                    type="submit"
                    className="w-full py-4 bg-(--text-primary) text-white font-medium rounded-xl hover:bg-(--accent-hover) transition-all text-sm mt-2"
                  >
                    Continue →
                  </button>
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-2 animate-fade-up delay-200">
                <div className="bg-white border border-(--border) rounded-2xl p-6 sticky top-24">
                  <h2 className="font-medium text-(--text-primary) mb-5">
                    Order Summary
                  </h2>
                  <div className="flex gap-4 pb-5 border-b border-(--border)">
                    <div className="w-16 h-16 bg-(--badge-bg) rounded-xl shrink-0 flex items-center justify-center text-2xl">
                      📦
                    </div>
                    <div>
                      <p className="font-medium text-sm text-(--text-primary)">
                        Your Product Name
                      </p>
                      <p className="text-xs text-(--text-muted) mt-0.5">
                        Qty: 1
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 py-5 border-b border-(--border)">
                    <div className="flex justify-between text-sm">
                      <span className="text-(--text-secondary)">Price</span>
                      <span className="text-(--text-primary)">₹999</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-(--text-secondary)">Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    {/* {form.payment === "cod" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-(--text-secondary)">COD Charges</span>
                    <span className="text-(--text-primary)">₹0</span>
                  </div>
                )} */}
                  </div>
                  <div className="flex justify-between pt-5">
                    <span className="font-medium text-(--text-primary)">
                      Total
                    </span>
                    <span className="font-semibold text-lg text-(--text-primary)">
                      ₹999
                    </span>
                  </div>
                  <div className="mt-5 p-3 bg-(--badge-bg) rounded-xl">
                    <p className="text-xs text-(--text-secondary) text-center">
                      🔒 Safe & Secure Checkout · Free Returns
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
