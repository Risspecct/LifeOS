const EmptyConnectionsState = ({ title, description }) => {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container p-lg text-center">
      <div className="mx-auto w-10 h-10 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center">
        <span className="material-symbols-outlined text-[18px]">groups</span>
      </div>
      <p className="text-title-sm text-on-surface">{title}</p>
      <p className="text-body-sm text-on-surface-variant mt-xs">{description}</p>
    </div>
  );
};

export default EmptyConnectionsState;
