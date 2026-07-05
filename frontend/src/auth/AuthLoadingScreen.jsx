const AuthLoadingScreen = ({ message = "Loading your workspace..." }) => (
  <div className="min-h-screen bg-background text-on-background flex items-center justify-center p-md">
    <p className="text-body-md text-on-surface-variant">{message}</p>
  </div>
);

export default AuthLoadingScreen;
