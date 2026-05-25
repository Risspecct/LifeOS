const EmptyConnectionsState = ({ title, description }) => {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container p-lg text-center">
      <p className="text-title-sm text-on-surface">{title}</p>
      <p className="text-body-sm text-on-surface-variant mt-xs">{description}</p>
    </div>
  );
};

export default EmptyConnectionsState;
