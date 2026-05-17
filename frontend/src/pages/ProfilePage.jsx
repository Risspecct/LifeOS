import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardTopBar from "../components/dashboard/DashboardTopBar";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileViewSection from "../components/profile/ProfileViewSection";
import ProfileEditForm from "../components/profile/ProfileEditForm";
import AddBranchModal from "../components/profile/AddBranchModal";
import { updateProfile, updateProfileBranch } from "../api/profileApi";
import { createBranch, getBranches } from "../api/branchApi";
import { useAuth } from "../hooks/useAuth";
import { useSidebar } from "../hooks/useSidebar";
import { getApiErrorMessage } from "../utils/errorUtils";

const buildEditForm = (profile, branches) => {
  const matchedBranch = branches.find((item) => item.code === profile?.branchCode);
  return {
    name: profile?.name ?? "",
    age: profile?.age ?? "",
    college: profile?.college ?? "",
    year: profile?.year ?? "",
    branchId: matchedBranch?.id ? String(matchedBranch.id) : "",
    bio: profile?.bio ?? ""
  };
};

const ProfilePage = () => {
  const isCollapsed = useSidebar();
  const [searchParams, setSearchParams] = useSearchParams();
  const { clearAuth, profile, refreshProfileStatus, markProfileCompleted } = useAuth();

  const [profileData, setProfileData] = useState(profile);
  const [isLoadingProfile, setIsLoadingProfile] = useState(!profile);
  const [profileError, setProfileError] = useState("");

  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [branchCreateError, setBranchCreateError] = useState("");
  const [isCreatingBranch, setIsCreatingBranch] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    college: "",
    year: "",
    branchId: "",
    bio: ""
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = searchParams.get("mode") === "edit";

  useEffect(() => {
    if (profile) {
      setProfileData(profile);
      setIsLoadingProfile(false);
      return;
    }

    const loadProfile = async () => {
      setIsLoadingProfile(true);
      setProfileError("");
      try {
        const response = await refreshProfileStatus();
        setProfileData(response?.profile ?? null);
      } catch (error) {
        setProfileError(getApiErrorMessage(error, "Unable to load profile."));
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [profile, refreshProfileStatus]);

  const loadBranches = async () => {
    setBranchesLoading(true);
    try {
      const data = await getBranches();
      const normalized = Array.isArray(data) ? data : [];
      setBranches(normalized);
      return normalized;
    } catch (error) {
      setApiError(getApiErrorMessage(error, "Could not load branches."));
      return [];
    } finally {
      setBranchesLoading(false);
    }
  };

  useEffect(() => {
    if (!isEditing || branches.length > 0) return;
    loadBranches();
  }, [isEditing, branches.length]);

  useEffect(() => {
    if (!profileData) return;
    setFormData(buildEditForm(profileData, branches));
  }, [profileData, branches]);

  const openEditMode = () => {
    setSearchParams({ mode: "edit" }, { replace: false });
    setApiError("");
  };

  const openViewMode = () => {
    setSearchParams({}, { replace: false });
    setErrors({});
    setApiError("");
    if (profileData) {
      setFormData(buildEditForm(profileData, branches));
    }
  };

  const openAddBranchModal = () => {
    setBranchCreateError("");
    setIsAddBranchModalOpen(true);
  };

  const closeAddBranchModal = () => {
    if (isCreatingBranch) return;
    setIsAddBranchModalOpen(false);
    setBranchCreateError("");
  };

  const handleCreateBranch = async (payload) => {
    const normalizedName = payload.name.trim().toLowerCase();
    const normalizedCode = payload.code.trim().toLowerCase();

    const duplicate = branches.find(
      (branch) =>
        String(branch?.name ?? "").trim().toLowerCase() === normalizedName ||
        String(branch?.code ?? "").trim().toLowerCase() === normalizedCode
    );

    if (duplicate) {
      setBranchCreateError("A branch with this name or code already exists.");
      return;
    }

    setIsCreatingBranch(true);
    setBranchCreateError("");
    try {
      const createdBranch = await createBranch(payload);
      const refreshedBranches = await loadBranches();
      const selectedBranchId = createdBranch?.id
        ? String(createdBranch.id)
        : String(
            refreshedBranches.find((branch) => branch.name === createdBranch?.name && branch.code === createdBranch?.code)?.id ?? ""
          );

      setFormData((prev) => ({ ...prev, branchId: selectedBranchId }));
      setErrors((prev) => ({ ...prev, branchId: "" }));
      setIsAddBranchModalOpen(false);
    } catch (error) {
      setBranchCreateError(getApiErrorMessage(error, "Unable to create branch."));
    } finally {
      setIsCreatingBranch(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = "Name is required.";
    const age = Number(formData.age);
    if (!formData.age) nextErrors.age = "Age is required.";
    else if (!Number.isInteger(age) || age < 10 || age > 120) nextErrors.age = "Enter a valid age.";
    if (!formData.college.trim()) nextErrors.college = "College is required.";
    const year = Number(formData.year);
    if (!formData.year) nextErrors.year = "Year is required.";
    else if (!Number.isInteger(year) || year < 1 || year > 4) nextErrors.year = "Enter a valid year.";
    if (!formData.branchId) nextErrors.branchId = "Please select your branch.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm() || !profileData) return;

    setIsSaving(true);
    setApiError("");

    try {
      const updatePayload = {
        name: formData.name.trim(),
        age: Number(formData.age),
        college: formData.college.trim(),
        year: Number(formData.year),
        bio: formData.bio.trim()
      };

      const updatedProfile = await updateProfile(updatePayload);
      let finalProfile = updatedProfile;

      const currentBranch = branches.find((branch) => branch.code === profileData?.branchCode);
      const selectedBranchId = Number(formData.branchId);
      if (selectedBranchId && selectedBranchId !== currentBranch?.id) {
        finalProfile = await updateProfileBranch(selectedBranchId);
      }

      setProfileData(finalProfile);
      markProfileCompleted(finalProfile);
      openViewMode();
    } catch (error) {
      setApiError(getApiErrorMessage(error, "Unable to update profile."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-background text-on-surface">
      <DashboardSidebar onLogout={clearAuth} activeView="profile" />
      <DashboardTopBar />

      <main className={`ml-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} p-md lg:p-xl min-h-screen transition-all duration-300 ease-in-out`}>
        <div className="max-w-container-max mx-auto space-y-lg">
          <ProfileHeader isEditing={isEditing} onEdit={openEditMode} onCancel={openViewMode} isSaving={isSaving} />

          {isLoadingProfile ? (
            <section className="bg-surface-container border border-outline-variant rounded-xl p-lg text-on-surface-variant">
              Loading profile...
            </section>
          ) : null}

          {!isLoadingProfile && profileError ? (
            <section className="bg-error-container/20 border border-error-container rounded-xl p-md text-error">
              {profileError}
            </section>
          ) : null}

          {!isLoadingProfile && !profileError && !profileData ? (
            <section className="bg-surface-container border border-outline-variant rounded-xl p-lg text-on-surface-variant">
              Profile data is unavailable.
            </section>
          ) : null}

          {!isLoadingProfile && !profileError && profileData ? (
            isEditing ? (
              <ProfileEditForm
                formData={formData}
                errors={errors}
                apiError={apiError}
                onChange={handleChange}
                branchField={{
                  branches,
                  branchesLoading,
                  onOpenAddBranch: openAddBranchModal
                }}
                isSaving={isSaving}
                onSubmit={handleSubmit}
              />
            ) : (
              <ProfileViewSection profile={profileData} />
            )
          ) : null}
        </div>
      </main>

      <AddBranchModal
        isOpen={isAddBranchModalOpen}
        isSubmitting={isCreatingBranch}
        error={branchCreateError}
        onClose={closeAddBranchModal}
        onCreate={handleCreateBranch}
      />
    </div>
  );
};

export default ProfilePage;
