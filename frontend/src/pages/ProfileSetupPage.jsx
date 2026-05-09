import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { createProfile } from "../api/profileApi";
import { getBranches } from "../api/branchApi";
import { getApiErrorMessage } from "../utils/errorUtils";
import { useAuth } from "../hooks/useAuth";

const initialForm = {
  name: "",
  age: "",
  college: "",
  branchId: "",
  year: "",
  bio: ""
};

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasProfile, markProfileCompleted } = useAuth();

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [branches, setBranches] = useState([]);
  const [branchSearch, setBranchSearch] = useState("");
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadBranches = async () => {
      setBranchesLoading(true);
      try {
        const data = await getBranches();
        setBranches(Array.isArray(data) ? data : []);
      } catch (error) {
        setApiError(getApiErrorMessage(error, "Could not load branches."));
      } finally {
        setBranchesLoading(false);
      }
    };

    loadBranches();
  }, []);

  const filteredBranches = useMemo(() => {
    const query = branchSearch.trim().toLowerCase();
    if (!query) return branches;

    return branches.filter((branch) => {
      const name = String(branch?.name ?? "").toLowerCase();
      const code = String(branch?.code ?? "").toLowerCase();
      return name.includes(query) || code.includes(query);
    });
  }, [branches, branchSearch]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (hasProfile) {
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

    if (!formData.name.trim()) nextErrors.name = "Full name is required.";

    const ageValue = Number(formData.age);
    if (!formData.age) nextErrors.age = "Age is required.";
    else if (!Number.isInteger(ageValue) || ageValue < 10 || ageValue > 120)
      nextErrors.age = "Enter a valid age.";

    if (!formData.college.trim()) nextErrors.college = "College is required.";

    if (!formData.branchId) nextErrors.branchId = "Please select your branch.";

    const yearValue = Number(formData.year);
    if (!formData.year) nextErrors.year = "Current year is required.";
    else if (!Number.isInteger(yearValue) || yearValue < 1 || yearValue > 4)
      nextErrors.year = "Enter a valid year.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      const payload = {
        name: formData.name.trim(),
        age: Number(formData.age),
        college: formData.college.trim(),
        branchId: Number(formData.branchId),
        year: Number(formData.year),
        bio: formData.bio.trim()
      };

      const response = await createProfile(payload);
      markProfileCompleted(response);
      navigate("/", { replace: true });
    } catch (error) {
      setApiError(getApiErrorMessage(error, "Unable to complete profile setup."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-md bg-[#0f1115] text-on-background">
      <main className="w-full max-w-4xl bg-[#1a1d23] border border-[#2d3139] rounded-xl p-lg flex flex-col gap-lg">
        <header className="text-center flex flex-col items-center gap-md">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-outline-variant bg-surface-container-high flex items-center justify-center">
              <img
                alt="Avatar Placeholder"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv3TATprgJ5flrBasOyPrb2yj5UnRhskbzRMY5Aa1woyqEmXBlQmiNrUBx59CEOkZINQVDGCJwZDK015JuW9PplCpyQGHehIZWMy_6D2naWt8LyaoQBCuHOaiYxdL5TX_poemKdut-2pBDGaSLLK5Fk0rlJpGQ2yTNA04liG4JYuV_qZb1UWebE3xFn7PRUl-49ejZkPFd8Xk3b9t2C3LsQximWyqwZpPCKd-__8QycFgXtbUO-5QrQrQ_x3v93m1ls5bHH1AmRQ"
              />
            </div>
            <button
              aria-label="Upload Avatar"
              className="absolute bottom-0 right-0 p-2 bg-surface-container-highest border border-outline-variant rounded-full text-on-surface hover:bg-surface-bright transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            </button>
          </div>
          <div>
            <h1 className="font-h2 text-h2 text-on-surface">Set up your profile</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Let&apos;s get to know you better. This info will be visible to your network.
            </p>
          </div>
        </header>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-xl" onSubmit={handleSubmit} noValidate>
          <section className="flex flex-col gap-md">
            <h2 className="font-h3 text-h3 text-on-surface border-b border-outline-variant pb-xs">Basic Info</h2>

            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="name">
                Full Name
              </label>
              <input
                className={`rounded-lg px-sm py-xs font-body-md text-body-md w-full transition-all bg-[#1a1d23] text-on-surface placeholder:text-slate-400/50 border ${
                  errors.name ? "border-error" : "border-[#2d3139]"
                }`}
                id="name"
                name="name"
                placeholder="e.g. Jane Doe"
                type="text"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name ? <p className="text-label-xs text-error">{errors.name}</p> : null}
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="age">
                Age
              </label>
              <input
                className={`rounded-lg px-sm py-xs font-body-md text-body-md w-full transition-all bg-[#1a1d23] text-on-surface placeholder:text-slate-400/50 border ${
                  errors.age ? "border-error" : "border-[#2d3139]"
                }`}
                id="age"
                name="age"
                placeholder="e.g. 20"
                type="number"
                value={formData.age}
                onChange={handleChange}
              />
              {errors.age ? <p className="text-label-xs text-error">{errors.age}</p> : null}
            </div>

            <div className="flex flex-col gap-xs flex-grow">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="bio">
                Bio
              </label>
              <textarea
                className="rounded-lg px-sm py-xs font-body-md text-body-md w-full resize-none transition-all h-full bg-[#1a1d23] border border-[#2d3139] text-on-surface placeholder:text-slate-400/50"
                id="bio"
                name="bio"
                placeholder="Tell us about your interests and goals..."
                rows="4"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
          </section>

          <section className="flex flex-col gap-md">
            <h2 className="font-h3 text-h3 text-on-surface border-b border-outline-variant pb-xs">Academic Info</h2>

            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="college">
                College / University
              </label>
              <input
                className={`rounded-lg px-sm py-xs font-body-md text-body-md w-full transition-all bg-[#1a1d23] text-on-surface placeholder:text-slate-400/50 border ${
                  errors.college ? "border-error" : "border-[#2d3139]"
                }`}
                id="college"
                name="college"
                placeholder="e.g. State University"
                type="text"
                value={formData.college}
                onChange={handleChange}
              />
              {errors.college ? <p className="text-label-xs text-error">{errors.college}</p> : null}
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="branch-search">
                Branch / Major
              </label>
              <input
                id="branch-search"
                type="text"
                value={branchSearch}
                onChange={(event) => setBranchSearch(event.target.value)}
                placeholder="Search branch..."
                className="rounded-lg px-sm py-xs font-body-md text-body-md w-full transition-all bg-[#1a1d23] border border-[#2d3139] text-on-surface placeholder:text-slate-400/50"
              />
              <div className="relative">
                <select
                  className={`rounded-lg px-sm py-xs font-body-md text-body-md w-full appearance-none transition-all cursor-pointer bg-[#1a1d23] text-on-surface border ${
                    errors.branchId ? "border-error" : "border-[#2d3139]"
                  }`}
                  id="branch"
                  name="branchId"
                  value={formData.branchId}
                  onChange={handleChange}
                  disabled={branchesLoading}
                >
                  <option value="">{branchesLoading ? "Loading branches..." : "Select your branch..."}</option>
                  {filteredBranches.map((branch) => (
                    <option key={branch.id} value={branch.id} className="text-on-surface bg-surface-container">
                      {branch.name}
                      {branch.code ? ` (${branch.code})` : ""}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
              {errors.branchId ? <p className="text-label-xs text-error">{errors.branchId}</p> : null}
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="year">
                Current Year
              </label>
              <div className="relative">
                <select
                  className={`rounded-lg px-sm py-xs font-body-md text-body-md w-full appearance-none transition-all cursor-pointer bg-[#1a1d23] text-on-surface border ${
                    errors.year ? "border-error" : "border-[#2d3139]"
                  }`}
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                >
                  <option value="">Select year...</option>
                  <option value="1">Freshman</option>
                  <option value="2">Sophomore</option>
                  <option value="3">Junior</option>
                  <option value="4">Senior</option>
                </select>
                <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
              {errors.year ? <p className="text-label-xs text-error">{errors.year}</p> : null}
            </div>
          </section>

          {apiError ? (
            <div className="col-span-1 md:col-span-2">
              <p className="font-label-sm text-label-sm text-error bg-error-container/20 border border-error-container rounded-lg px-sm py-xs">
                {apiError}
              </p>
            </div>
          ) : null}

          <div className="col-span-1 md:col-span-2 flex flex-col-reverse sm:flex-row justify-end items-center gap-md pt-lg border-t border-outline-variant mt-sm">
            <button
              className="rounded-lg px-md py-xs font-label-sm text-label-sm w-full sm:w-auto hover:bg-surface-container-highest transition-colors border border-[#2d3139] text-primary-container bg-transparent"
              type="button"
            >
              Save &amp; Continue
            </button>
            <button
              className="rounded-lg px-xl py-xs font-label-sm text-label-sm font-semibold w-full sm:w-auto hover:opacity-90 transition-opacity flex items-center justify-center gap-xs bg-primary-container text-[#0f1115] disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Completing..." : "Complete Profile"}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ProfileSetupPage;
