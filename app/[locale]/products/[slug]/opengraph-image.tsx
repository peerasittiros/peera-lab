import { productOpenGraphImage, size, contentType } from '@/components/seo/ProductOpenGraphImage';
import { itemParams } from '@/components/pages/collection';

export { size, contentType };

export const alt = 'Product preview — Peera Lab';

export function generateStaticParams() {
  return itemParams('products');
}

export default function OpenGraphImage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  return productOpenGraphImage({ params, kind: 'products' });
}
