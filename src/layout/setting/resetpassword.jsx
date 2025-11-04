import React from "react";
import { motion } from "framer-motion";
import { sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../../service/Auth";
import { MdVerified as VerifiedIcon } from "react-icons/md";
import { MdEmail as EmailIcon } from "react-icons/md";
import { Input } from "../../ui/input";
import Button from "../../ui/button";
import Card from "../../ui/card";

export default function Resetpassword({ toggle }) {
  const handelvarify = async () => {
    if (!auth.currentUser.emailVerified) {
      try {
        await sendEmailVerification(auth.currentUser);
        toast.success(
          "Verification link sent to your email address. Please check your inbox.",
        );
      } catch (error) {
        toast.error("Failed to send verification email");
      }
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      toast.success(
        "Password reset link sent to your email address. Please check your inbox.",
      );
    } catch (error) {
      toast.error("Failed to send password reset email");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="w-full flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text-primary mb-2">
        Password and Protection
      </h1>

      {/* Email Verification */}
      <Card variant="elevated" padding="lg" className="w-full">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <EmailIcon className="text-xl text-accent-500" />
            <h2 className="text-lg font-semibold text-text-primary">
              Email Address
            </h2>
          </div>

          <Input
            type="email"
            name="email"
            label="Email"
            value={auth?.currentUser.email}
            className={`${
              auth.currentUser.emailVerified
                ? "border-status-success"
                : "border-border-default"
            }`}
            disabled
          />

          {auth.currentUser.emailVerified ? (
            <div className="flex items-center gap-2 text-status-success">
              <VerifiedIcon className="text-xl" />
              <span className="text-sm font-medium">Email verified</span>
            </div>
          ) : (
            <Button
              onClick={handelvarify}
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto"
            >
              Verify Email
            </Button>
          )}
        </div>
      </Card>

      {/* Password Reset */}
      <Card variant="elevated" padding="lg" className="w-full">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Change Password
          </h2>
          <p className="text-sm text-text-secondary">
            Send a password reset link to your email address to change your
            Socialite password.
          </p>
          <Button
            onClick={handlePasswordReset}
            variant="primary"
            className="w-full sm:w-auto"
          >
            Send Reset Link via Email
          </Button>
        </div>
      </Card>

      {/* Account Information */}
      <Card variant="elevated" padding="lg" className="w-full">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Account Information
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-[15px] text-text-secondary font-medium">
              Last Sign-In
            </span>
            <span className="text-[15px] text-text-primary">
              {formatDate(auth.currentUser.metadata.lastSignInTime)}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-[15px] text-text-secondary font-medium">
              Account Created
            </span>
            <span className="text-[15px] text-text-primary">
              {formatDate(auth.currentUser.metadata.creationTime)}
            </span>
          </div>
        </div>
      </Card>

      {/* Back Button */}
      <Button onClick={toggle} variant="secondary" className="w-full sm:w-auto">
        Back
      </Button>
    </section>
  );
}
