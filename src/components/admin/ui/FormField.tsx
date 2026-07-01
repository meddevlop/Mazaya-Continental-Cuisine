"use client"

interface FormFieldProps {
  label: string
  value: string | number
  onChange: (value: string) => void
  type?: "text" | "number" | "email" | "tel" | "url" | "password"
  placeholder?: string
  required?: boolean
  error?: string
  dir?: "ltr" | "rtl" | "auto"
}

export function FormField({ label, value, onChange, type = "text", placeholder, required, error, dir }: FormFieldProps) {
  return (
    <div>
      <label className="block text-xs text-[#D4C9C0] mb-1.5">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        dir={dir}
        className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-sm placeholder:text-[#6B5E56] focus:outline-none focus:border-[#C8A45C]/40 focus:bg-white/[0.07] transition-all ${
          error ? "border-red-500/50 text-red-400" : "border-white/10 text-[#F5F0EB]"
        }`}
      />
      {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
    </div>
  )
}

interface TextareaFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  rows?: number
  dir?: "ltr" | "rtl" | "auto"
}

export function TextareaField({ label, value, onChange, placeholder, required, rows = 3, dir }: TextareaFieldProps) {
  return (
    <div>
      <label className="block text-xs text-[#D4C9C0] mb-1.5">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        dir={dir}
        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[#F5F0EB] text-sm placeholder:text-[#6B5E56] focus:outline-none focus:border-[#C8A45C]/40 focus:bg-white/[0.07] transition-all resize-none"
      />
    </div>
  )
}

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
}

export function SelectField({ label, value, onChange, options, placeholder, required }: SelectFieldProps) {
  return (
    <div>
      <label className="block text-xs text-[#D4C9C0] mb-1.5">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[#F5F0EB] text-sm focus:outline-none focus:border-[#C8A45C]/40 focus:bg-white/[0.07] transition-all"
      >
        {placeholder && <option value="" className="bg-[#0A0A0A]">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-[#0A0A0A]">{o.label}</option>
        ))}
      </select>
    </div>
  )
}

interface ToggleFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ToggleField({ label, checked, onChange }: ToggleFieldProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-[#C8A45C]" : "bg-white/10"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
      <span className="text-sm text-[#D4C9C0]">{label}</span>
    </label>
  )
}
