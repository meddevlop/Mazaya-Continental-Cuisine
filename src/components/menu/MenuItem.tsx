import { MenuItem as MenuItemType } from "@/types"
import { formatPrice } from "@/lib/utils"

interface MenuItemProps {
  item: MenuItemType
}

export default function MenuItem({ item }: MenuItemProps) {
  return (
    <div className="border-b border-[#E8E0D8] pb-5 mb-5 last:border-0 last:mb-0 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[#2C2420] font-serif font-bold text-lg">{item.name}</h3>
            {item.nameAr && (
              <span className="text-[#C8A45C] text-xs font-arabic">{item.nameAr}</span>
            )}
            {item.isBestSeller && (
              <span className="bg-[#C8A45C] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                Best Seller
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-[#6B5E56] text-sm mt-1 leading-relaxed">{item.description}</p>
          )}
          {item.sizes && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {item.sizes.map((size) => (
                <span key={size.label} className="text-sm text-[#6B5E56]">
                  {size.label}: <span className="text-[#C8A45C] font-semibold">{formatPrice(size.price)}</span>
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="text-[#C8A45C] font-bold text-lg whitespace-nowrap font-serif">
          {formatPrice(item.price)}
        </span>
      </div>
    </div>
  )
}
