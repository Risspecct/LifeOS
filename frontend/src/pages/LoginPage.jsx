import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../api/authApi";
import { getApiErrorMessage } from "../utils/errorUtils";
import { isValidEmail } from "../utils/validation";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, setAuthFromToken } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const successMessage = location.state?.message;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.email.trim()) nextErrors.email = "Email is required.";
    else if (!isValidEmail(formData.email.trim())) nextErrors.email = "Enter a valid email address.";

    if (!formData.password) nextErrors.password = "Password is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    try {
      const response = await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      if (!response?.jwt_token) {
        setApiError("Login succeeded but token was not returned.");
        return;
      }

      setAuthFromToken(response.jwt_token);
      navigate("/", { replace: true });
    } catch (error) {
      setApiError(getApiErrorMessage(error, "Unable to login right now."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex items-center justify-center p-sm md:p-md relative overflow-hidden antialiased">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] bg-primary/5 rounded-full blur-[100px] opacity-70" />
      </div>

      <main className="w-full max-w-[420px] bg-surface-container border border-outline-variant rounded-xl p-lg z-10 shadow-2xl shadow-black/40 relative">
        <header className="text-center mb-xl">
          <h1 className="font-h1 text-h1 text-on-surface tracking-tight mb-2">CampusOS</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Stay focused. Stay ahead.</p>
        </header>

        {successMessage ? (
          <p className="mb-sm font-label-sm text-label-sm text-primary-container border border-primary-container/30 bg-primary-container/10 rounded-DEFAULT px-sm py-xs">
            {successMessage}
          </p>
        ) : null}

        <form className="flex flex-col gap-sm" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-base">
            <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@university.edu"
                autoComplete="email"
                className={`w-full bg-surface border rounded-DEFAULT px-sm py-[10px] font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all duration-200 ${
                  errors.email ? "border-error" : "border-outline-variant"
                }`}
              />
            </div>
            {errors.email ? <p className="text-label-xs text-error">{errors.email}</p> : null}
          </div>

          <div className="flex flex-col gap-base mt-2">
            <div className="flex justify-between items-center">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="password">
                Password
              </label>
              <button
                type="button"
                className="font-label-xs text-label-xs text-primary-container hover:text-primary transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                autoComplete="current-password"
                className={`w-full bg-surface border rounded-DEFAULT pl-sm pr-12 py-[10px] font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all duration-200 ${
                  errors.password ? "border-error" : "border-outline-variant"
                }`}
              />
              <button
                aria-label="Toggle password visibility"
                className="absolute right-sm top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center p-1 rounded-full hover:bg-surface-bright"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
            {errors.password ? <p className="text-label-xs text-error">{errors.password}</p> : null}
          </div>

          {apiError ? (
            <p className="font-label-sm text-label-sm text-error bg-error-container/20 border border-error-container rounded-DEFAULT px-sm py-xs mt-xs">
              {apiError}
            </p>
          ) : null}

          <button
            className="w-full bg-primary-container text-on-primary-container font-label-sm text-label-sm py-[12px] rounded-DEFAULT hover:bg-primary transition-colors duration-200 mt-sm flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              arrow_forward
            </span>
          </button>
        </form>

        <div className="mt-lg text-center pt-sm border-t border-outline-variant/30">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Don't have an account?
            <Link className="text-primary-container font-label-sm hover:text-primary transition-colors ml-1" to="/signup">
              Create account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
