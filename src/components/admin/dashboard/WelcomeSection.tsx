"use client"

import { motion } from "framer-motion"
import PageHeader from "../ui/PageHeader"
import { formatDate } from "@/lib/adminUtils"

export default function WelcomeSection() {
  const today = formatDate(new Date())

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader
        title="Welcome back, Admin"
        description={today}
      />
    </motion.div>
  )
}
