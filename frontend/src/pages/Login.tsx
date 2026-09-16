import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginApi } from "@/lib/api";
import { setToken, isAuthenticated } from "@/utils/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/tasks");
    }
    const params = new URLSearchParams(location.search);
    if (params.get("expired")) {
      setError("Session expired. Please login again.");
    }
    if (params.get("registered")) {
      setSuccessMsg("Registration successful! Please sign in with your credentials.");
    }
  }, [navigate, location]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const data = await loginApi({ email: email.trim(), password });
      setToken(data.token);
      navigate("/tasks");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid email or password";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md border-white/10 bg-surface/80 p-2 shadow-2xl backdrop-blur-xl">
        <CardHeader className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Practical 7 Authentication</p>
          <CardTitle className="text-2xl font-bold text-text-primary">Sign In to Task Manager</CardTitle>
          <CardDescription className="text-text-secondary">
            Enter your email and password to manage your tasks.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Email Address</label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

