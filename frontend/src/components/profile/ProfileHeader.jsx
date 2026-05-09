const ProfileHeader = ({ isEditing, onEdit, onCancel, isSaving }) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-md">
      <div>
        <h1 className="font-h2 text-h2 text-on-surface">Profile</h1>
        <p className="text-on-surface-variant font-body-md">
          Keep your academic identity sharp and your network context up to date.
        </p>
      </div>

      <div className="flex items-center gap-sm">
        {isEditing ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-lg px-md py-xs border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
        ) : null}
        {!isEditing ? (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg px-md py-xs bg-primary text-on-primary font-label-sm hover:opacity-90 transition-opacity"
          >
            Edit Profile
          </button>
        ) : null}
      </div>
    </header>
  );
};

export default ProfileHeader;
