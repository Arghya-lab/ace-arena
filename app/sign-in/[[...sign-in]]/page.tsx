"use client";

import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function SigninPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex w-full justify-center pb-24 pt-28"
    >
      <SignIn />
    </motion.div>
  );
}
