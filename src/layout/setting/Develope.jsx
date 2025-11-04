import React from "react";
import { motion } from "framer-motion";
import { FaGithub as GitHubIcon } from "react-icons/fa";
import { FaLinkedin as LinkedInIcon } from "react-icons/fa";
import { MdEmail as EmailIcon } from "react-icons/md";
import { FaInstagram as Instagram } from "react-icons/fa";
import { FaWhatsapp as WhatsApp } from "react-icons/fa";
import Card from "../../ui/card";

const DeveloperContact = () => {
  const socialLinks = [
    {
      icon: GitHubIcon,
      href: "https://github.com/Ashutosh137/",
      label: "GitHub",
      color: "hover:text-accent-500",
    },
    {
      icon: LinkedInIcon,
      href: "https://www.linkedin.com/in/ashutosh-sharma-5b99b0226/",
      label: "LinkedIn",
      color: "hover:text-accent-500",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/ashutosh_sharma137/",
      label: "Instagram",
      color: "hover:text-social-like",
    },
    {
      icon: WhatsApp,
      href: "https://wa.me/7877997488?text=Hello%20Ashutosh",
      label: "WhatsApp",
      color: "hover:text-status-success",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text-primary mb-2">
        Developer Contact
      </h1>

      <Card variant="elevated" padding="lg" className="w-full">
        <div className="flex flex-col gap-6">
          <p className="text-[15px] text-text-secondary text-center">
            Reach out to the developer for inquiries, suggestions, or feedback
            about Socialite!
          </p>

          {/* Email */}
          <motion.a
            href="mailto:mr.luckysharma7@gmail.com"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-tertiary border border-border-default hover:bg-bg-elevated hover:border-accent-500 transition-all duration-200"
          >
            <EmailIcon className="text-xl text-accent-500" />
            <span className="text-[15px] text-text-primary">
              mr.luckysharma7@gmail.com
            </span>
          </motion.a>

          {/* Social Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[15px] font-semibold text-text-primary">
              Connect on Social Media
            </h3>
            <div className="flex items-center justify-center gap-4">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-full bg-bg-tertiary border border-border-default text-text-secondary ${link.color} transition-all duration-200`}
                    aria-label={link.label}
                  >
                    <Icon className="text-2xl" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DeveloperContact;
