import { getSettings } from "@/services/settings.service"
import { business } from "@/data/business"
import AboutContent from "./AboutContent"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AboutPage() {
  const { data } = await getSettings()

  const name = data?.restaurant_name || business.name
  const nameAr = data?.restaurant_name_ar || business.nameAr
  const storyImage = data?.story_image || ""

  return <AboutContent name={name} nameAr={nameAr} storyImage={storyImage} />
}
