'use client';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const params = useParams();
  const idParam = params.id;
  
  // Check if the ID is numeric (product ID) or a string (category slug)
  const isNumeric = /^\d+$/.test(idParam);
  const productId = isNumeric ? parseInt(idParam) : null;

  // If it's not a numeric ID, it's likely a category slug - redirect to shop page
  if (!isNumeric) {
    return (
      <section className="min-h-screen pt-32 pb-20 px-4 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Category Page</h2>
            <p className="text-gray-600 mb-8">
              Please use the main shop page to browse categories.
            </p>
            <a
              href="/shop"
              className="inline-block bg-amber-600 text-white py-3 px-8 rounded-lg font-semibold shadow-md hover:bg-amber-700 hover:shadow-lg transition-all"
            >
              Go to Shop
            </a>
          </div>
        </div>
      </section>
    );
  }

  // Mock product data
  const products = [
    {
      id: 1,
      name: 'Sukhmani Gambhir Party Wear Saree With Moti Work Border',
      images: [
        '/images/carousel/pic_1.jpg',
        '/images/carousel/pic_2.jpg',
        '/images/carousel/pic_3.jpg',
      ],
      rating: 4.6,
      reviews: 18,
      originalPrice: 2799.0,
      discountedPrice: 1499.0,
      description:
        'Experience elegance with this exquisite party wear saree featuring intricate moti work border. Perfect for weddings and festive occasions, crafted with premium silk and adorned with delicate embellishments.',
      material: 'Silk',
      size: ['S', 'M', 'L', 'XL'],
      availability: 'In Stock',
    },
    {
      id: 2,
      name: 'Bollywood Star Suhana Khan Cream Colour Party Wear Saree',
      images: [
        '/images/carousel/pic_2.jpg',
        '/images/carousel/pic_1.jpg',
        '/images/carousel/pic_4.jpg',
      ],
      rating: 4.0,
      reviews: 7,
      originalPrice: 2049.0,
      discountedPrice: 999.0,
      description:
        'Inspired by Bollywood star Suhana Khan, this cream-colored saree blends modern style with traditional charm. Ideal for parties and casual outings.',
      material: 'Georgette',
      size: ['S', 'M', 'L'],
      availability: 'In Stock',
    },
  ];

  const product = products.find((p) => p.id === productId);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) {
    return (
      <section className="min-h-screen pt-32 pb-20 px-4 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-8">
              The product you're looking for doesn't exist or may have been removed.
            </p>
            <a
              href="/shop"
              className="inline-block bg-amber-600 text-white py-3 px-8 rounded-lg font-semibold shadow-md hover:bg-amber-700 hover:shadow-lg transition-all"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </section>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}
          size={16}
        />
      );
    }
    return stars;
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12">
        {/* Product Image Gallery */}
        <div className="space-y-6 sticky top-20">
          <motion.div
            key={selectedImageIndex}
            className="relative w-full h-[550px] rounded-2xl overflow-hidden shadow-lg bg-gray-100"
            initial="hidden"
            animate="visible"
            variants={imageVariants}
          >
            <Image
              src={product.images[selectedImageIndex]}
              alt={`${product.name} - Image ${selectedImageIndex + 1}`}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </motion.div>
          <div className="flex space-x-3 overflow-x-auto pb-3 scrollbar-hide">
            {product.images.map((image, index) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                key={index}
                className={`relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                  selectedImageIndex === index ? 'border-amber-500' : 'border-gray-200'
                } transition-all duration-300 flex-shrink-0`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={image}
                  alt={`${product.name} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <motion.div
          className="bg-white/95 p-8 rounded-2xl shadow-md space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <h1 className="text-3xl font-bold text-gray-900 leading-snug">
            {product.name}
          </h1>

          <div className="flex items-center space-x-3">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-sm text-gray-600 font-medium">
              ({product.reviews} reviews)
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-2xl font-semibold text-amber-700">
              ₹{product.discountedPrice.toFixed(2)}
            </p>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toFixed(2)}
              </p>
              <span className="text-sm bg-amber-100 text-amber-700 font-medium px-3 py-1 rounded-full">
                {((1 - product.discountedPrice / product.originalPrice) * 100).toFixed(0)}% OFF
              </span>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed text-base">
            {product.description}
          </p>

          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Material</h3>
              <p className="text-gray-600 text-sm">{product.material}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Available Sizes</h3>
              <div className="flex space-x-2 flex-wrap">
                {product.size.map((size, index) => (
                  <span
                    key={index}
                    className="text-sm text-gray-700 bg-gray-100 px-4 py-2 rounded-full hover:bg-amber-100 cursor-pointer transition-colors"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Availability</h3>
              <p className="text-gray-600 text-sm">{product.availability}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <label className="text-lg font-semibold text-gray-800">Quantity</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                -
              </button>
              <span className="text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <button className="w-full md:w-auto bg-amber-600 text-white py-4 px-8 rounded-lg font-semibold shadow-md hover:bg-amber-700 hover:shadow-lg transition-all">
            Add to Cart
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductDetail;
