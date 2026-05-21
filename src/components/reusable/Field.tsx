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

type FieldProps = {
  label: string;
  name: keyof FormData;
  type?: string;
  length?: number;
  placeholder?: string;
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Errors;
  setErrors: React.Dispatch<React.SetStateAction<Errors>>;
};

export default function Field({
  label,
  name,
  type = "text",
  length = 150,
  placeholder,
  form,
  setForm,
  errors,
  setErrors,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-(--text-primary)">
        {label}
      </label>

      <input
        type={type}
        maxLength={length}
        placeholder={placeholder}
        value={form[name] || ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setForm((f) => ({
            ...f,
            [name]: e.target.value,
          }));

          setErrors((err) => ({
            ...err,
            [name]: "",
            contact: "",
          }));
        }}
        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-white
          ${
            errors[name]
              ? "border-red-400 ring-2 ring-red-100"
              : "border-(--border) focus:border-(--text-primary) focus:ring-2 focus:ring-black/5"
          }`}
      />

      {errors[name] && (
        <span className="text-xs text-red-500">{errors[name]}</span>
      )}
    </div>
  );
}
