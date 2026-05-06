const FormInput = ({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  autoComplete
}) => {
  return (
    <div>
      <label className="font-label-sm text-label-sm text-on-surface block mb-xs" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full bg-surface border rounded-lg px-sm py-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all ${
          error ? "border-error" : "border-outline-variant"
        }`}
      />
      {error ? (
        <p id={`${id}-error`} className="font-label-xs text-label-xs text-error mt-1">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default FormInput;
