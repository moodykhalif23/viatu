import { ShopLinks } from '../shop-links';
import { Collection } from '@/lib/shopify/types';

interface HomeSidebarProps {
  collections: Collection[];
}

export function HomeSidebar({ collections }: HomeSidebarProps) {
  return (
    <aside className="max-md:hidden col-span-4 h-screen sticky top-0 p-sides pt-top-spacing flex flex-col justify-between">
      <div>
        <p className="italic tracking-tighter text-base">Step into something better.</p>
        <div className="mt-5 text-base leading-tight">
          <p>Shoes that move with you, not against you.</p>
          <p>Premium soles, crafted for every stride.</p>
          <p>Style meets comfort — every step counts.</p>
        </div>
      </div>
      <ShopLinks collections={collections} />
    </aside>
  );
}
