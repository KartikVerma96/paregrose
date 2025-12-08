'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ShopPageClient from '../ShopPageClient';

const ShopRouteHandler = () => {
  const params = useParams();
  const router = useRouter();
  const idParam = params.id;
  
  // Check if the ID is numeric (product ID) or a string (category slug)
  const isNumeric = /^\d+$/.test(idParam);
  const productId = isNumeric ? parseInt(idParam) : null;

  // If it's a numeric ID, redirect to product detail page
  if (isNumeric) {
    useEffect(() => {
      router.replace(`/product/${productId}`);
    }, [productId, router]);
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to product page...</p>
        </div>
      </div>
    );
  }

  // If it's not numeric, it's a category slug - show shop page with category filter
  return <ShopPageClient categorySlug={idParam} />;
};

export default ShopRouteHandler;
