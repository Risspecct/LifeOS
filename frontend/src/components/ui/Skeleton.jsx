import React from "react";

export const Skeleton = ({ className = "", ...props }) => {
  return (
    <div
      className={`animate-pulse bg-surface-variant/50 rounded-md ${className}`}
      {...props}
    />
  );
};

export const SkeletonText = ({ lines = 1, className = "", lastLineShort = true }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 w-full ${
            lastLineShort && i === lines - 1 && lines > 1 ? "max-w-[70%]" : ""
          } ${className}`}
        />
      ))}
    </div>
  );
};

export const SkeletonAvatar = ({ className = "" }) => {
  return <Skeleton className={`h-10 w-10 rounded-full ${className}`} />;
};

export const SkeletonCard = ({ className = "", children }) => {
  return (
    <div className={`bg-surface-container border border-outline-variant rounded-xl p-md lg:p-lg ${className}`}>
      {children}
    </div>
  );
};
