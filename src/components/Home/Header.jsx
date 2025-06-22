import React from "react";
import { motion } from "framer-motion";
import { titleVariants } from "@/utils/animations";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import GitHubLink from "@/components/GitHubLink/GitHubLink";

export default function Header() {
  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={titleVariants}
      className="flex justify-between items-center mb-8"
    >
      <motion.h1
        variants={titleVariants}
        className="text-3xl font-bold text-gray-800 dark:text-gray-100"
      >
        EPUB 繁简转换
      </motion.h1>
      <motion.div variants={titleVariants} className="flex space-x-4">
        <ThemeToggle />
        <GitHubLink />
      </motion.div>
    </motion.nav>
  );
}
