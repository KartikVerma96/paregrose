"use client";
  import { useRouter, useSearchParams } from "next/navigation";
  import { useEffect, Suspense } from "react";

  const AuthErrorContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    useEffect(() => {
      if (error === "EmailAlreadyRegistered") {
        alert("This email is already registered, try logging in.");
        router.push("/login");
      }
    }, [error, router]);

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-md shadow-md text-center">
          <h1 className="text-xl font-bold text-neutral-900">Authentication Error</h1>
          <p className="text-xs text-neutral-600 mt-2">
            {error === "EmailAlreadyRegistered"
              ? "This email is already registered, try logging in."
              : "An error occurred during authentication."}
          </p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 bg-yellow-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-yellow-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  };

  const AuthError = () => {
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <h1 className="text-xl font-bold text-neutral-900">Loading...</h1>
          </div>
        </div>
      }>
        <AuthErrorContent />
      </Suspense>
    );
  };

  export default AuthError;