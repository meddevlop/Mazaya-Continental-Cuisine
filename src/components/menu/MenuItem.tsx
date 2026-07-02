import { MenuItem as MenuItemType } from "@/types"
import { formatPrice } from "@/lib/utils"

interface MenuItemProps {
  item: MenuItemType
}

export default function MenuItem({ item }: MenuItemProps) {
  return (
    <div className="group border-b border-[#E8E0D8]/60 pb-6 mb-6 last:border-0 last:mb-0 last:pb-0 hover:border-[#C8A45C]/20 transition-colors duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-[#111111] font-serif font-bold text-xl group-hover:text-[#C8A45C] transition-colors duration-300">
              {item.name}
            </h3>
            {item.nameAr && (
              <span className="text-[#C8A45C] text-sm font-arabic">{item.nameAr}</span>
            )}
            {item.isBestSeller && (
              <span className="bg-gradient-to-r from-[#C8A45C] to-[#D4B87A] text-[#111111] text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-0.5">
                Best Seller
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-[#6B5E56] text-sm mt-2 leading-relaxed max-w-xl">{item.description}</p>
          )}
          {item.sizes && (
            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3">
              {item.sizes.map((size) => (
                <span key={size.label} className="text-sm text-[#6B5E56]">
                  {size.label}: <span className="text-[#C8A45C] font-semibold">{formatPrice(size.price)}</span>
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="text-[#C8A45C] font-bold text-xl whitespace-nowrap font-serif flex-shrink-0">
          {formatPrice(item.price)}
        </span>
      </div>
    </div>
  )
}
