import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import FormInput from "../components/form/FormInput";
import { signup } from "../api/authApi";
import { getApiErrorMessage } from "../utils/errorUtils";
import { getPasswordStrength, isValidEmail } from "../utils/validation";
import { useAuth } from "../hooks/useAuth";

const initialForm = {
  username: "",
  email: "",
  password: "",
  confirmPassword: ""
};

const SignupPage = () => {
  const [formData, setFormData] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setAuthFromToken } = useAuth();

  const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const errors = {};

    if (!formData.username.trim()) errors.username = "Username is required.";
    if (!formData.email.trim()) errors.email = "Email is required.";
    else if (!isValidEmail(formData.email)) errors.email = "Enter a valid email address.";

    if (!formData.password) errors.password = "Password is required.";
    else if (formData.password.length < 8) errors.password = "Password must be at least 8 characters.";

    if (!formData.confirmPassword) errors.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match.";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.warn("[Signup] Validation blocked submission:", errors);
    }
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    console.log("[Signup] Submit triggered");
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };
      console.log("[Signup] Sending payload:", payload);
      const response = await signup(payload);

      if (response?.jwt_token) {
        setAuthFromToken(response.jwt_token);
        navigate("/", { replace: true });
        return;
      }

      navigate("/login", {
        replace: true,
        state: { message: "Account created successfully. Please log in." }
      });
    } catch (error) {
      console.error("[Signup] Signup request failed:", error);
      const message = getApiErrorMessage(error, "Unable to create account right now.");
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex items-center justify-center p-md">
      <main className="w-full max-w-md">
        <div className="text-center mb-lg">
          <h1 className="font-h1 text-h1 text-primary mb-xs tracking-tight">LifeOS</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Create your workspace</p>
        </div>

        <div className="bg-surface-container border border-outline-variant rounded-xl p-md md:p-xl flex flex-col gap-md">
          <form className="flex flex-col gap-sm" onSubmit={handleSubmit} noValidate>
            <FormInput
              id="username"
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
              error={fieldErrors.username}
              autoComplete="username"
            />

            <FormInput
              id="email"
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              error={fieldErrors.email}
              autoComplete="email"
            />

            <div>
              <FormInput
                id="password"
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                error={fieldErrors.password}
                autoComplete="new-password"
              />

              <div className="mt-xs">
                <div className="h-[4px] w-full bg-surface-variant rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`h-full w-1/3 rounded-full ${
                        passwordStrength.level >= level ? "bg-primary-container" : "bg-transparent"
                      } ${passwordStrength.level === 2 && level === 3 ? "opacity-50" : ""}`}
                    />
                  ))}
                </div>
                <p className="font-label-xs text-label-xs text-on-surface-variant mt-1 text-right">
                  {passwordStrength.label}
                </p>
              </div>
            </div>

            <FormInput
              id="confirm-password"
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="********"
              error={fieldErrors.confirmPassword}
              autoComplete="new-password"
            />

            {apiError ? (
              <p className="font-label-sm text-label-sm text-error bg-error-container/20 border border-error-container rounded-lg p-sm">
                {apiError}
              </p>
            ) : null}

            <div className="mt-xs">
              <button
                className="w-full bg-primary-container text-surface font-label-sm text-label-sm py-3 rounded-lg hover:bg-primary transition-colors flex justify-center items-center gap-xs disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Account"}
              </button>
              <p className="font-label-xs text-label-xs text-on-surface-variant text-center mt-xs">
                Profile setup comes next
              </p>
            </div>
          </form>

          <div className="w-full h-px bg-outline-variant my-xs" />

          <div className="text-center">
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Already have an account?{" "}
              <Link className="text-primary-container hover:text-primary transition-colors" to="/login">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
