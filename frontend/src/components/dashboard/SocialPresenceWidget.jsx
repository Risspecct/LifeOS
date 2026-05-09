const SocialPresenceWidget = () => {
  const events = [
    { actor: "Leo", action: "completed", target: "Task 4", tone: "text-primary" },
    { actor: "Sarah", action: "is now", target: "Active", tone: "text-tertiary" }
  ];

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-md">
      <h4 className="font-label-sm font-bold text-on-surface-variant mb-md uppercase tracking-wider">Social Presence</h4>
      <div className="space-y-sm">
        {events.map((event) => (
          <div key={`${event.actor}-${event.target}`} className="flex items-center gap-sm">
            <div className="h-6 w-6 rounded-full overflow-hidden border border-outline bg-surface-container-high" />
            <p className="text-[12px]">
              <span className="font-bold">{event.actor}</span> {event.action}{" "}
              <span className={event.tone}>{event.target}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialPresenceWidget;
