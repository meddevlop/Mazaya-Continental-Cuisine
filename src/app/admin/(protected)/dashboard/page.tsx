import WelcomeSection from "@/components/admin/dashboard/WelcomeSection"
import StatCardsGrid from "@/components/admin/dashboard/StatCardsGrid"
import ChartsSection from "@/components/admin/dashboard/ChartsSection"
import RecentActivity from "@/components/admin/dashboard/RecentActivity"
import QuickActions from "@/components/admin/dashboard/QuickActions"

export default function DashboardPage() {
  return (
    <>
      <WelcomeSection />
      <StatCardsGrid />
      <ChartsSection />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivity />
        <QuickActions />
      </div>
    </>
  )
}
