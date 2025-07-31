import Auth from "../components/Auth";

export default function Signup() {
  return (
    <div className="auth-page">
      <h1>Create Account</h1>
      <Auth isLogin={false} />
    </div>
  );
}
