import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, ArrowLeft, CreditCard } from 'lucide-react';

export default function FloatingCart() {
  const { cartItems, cartCount, updateCartQuantity, removeFromCart, cartTotal } = useCart();
  const { locale, direction } = useLanguage();
  const isRTL = direction === 'rtl';
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [animateBadge, setAnimateBadge] = useState(false);

  // Trigger badge animation when cartCount changes
  useEffect(() => {
    if (cartCount > 0) {
      setAnimateBadge(true);
      const timer = setTimeout(() => setAnimateBadge(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleDrawer = () => setIsOpen(!isOpen);

  if (cartCount === 0 && !isOpen) return null; // Only show button if there's something in the cart

  return (
    <>
      <style>{`
        @keyframes cartPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.6);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(46, 125, 50, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(46, 125, 50, 0);
          }
        }
        @keyframes cartRipple {
          0% {
            transform: scale(0.9);
            opacity: 1;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        .animate-cart-pulse {
          animation: cartPulse 2s infinite;
        }
        .ripple-ring {
          position: absolute;
          border: 2px solid rgba(46, 125, 50, 0.5);
          border-radius: 50%;
          inset: 0;
          animation: cartRipple 2s linear infinite;
          pointer-events: none;
        }
        .ripple-ring:nth-child(2) {
          animation-delay: 1s;
        }
      `}</style>
      
      {/* Floating Button Container */}
      <div className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50 flex items-center justify-center`}>
        <button
          onClick={toggleDrawer}
          className="flex items-center justify-center cursor-pointer group animate-cart-pulse"
          style={{
            width: 56,
            height: 56,
            background: 'linear-gradient(135deg, #2E7D32, #43A047)',
            borderRadius: '50%',
            boxShadow: '0 4px 15px rgba(46,125,50,0.4)',
            transition: 'all 0.3s ease',
            transform: 'scale(1)',
            position: 'relative'
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          aria-label={locale === 'ar' ? 'إتمام الدفع' : 'Checkout'}
        >
          {/* Ripple Effects */}
          <div className="ripple-ring"></div>
          <div className="ripple-ring"></div>
          
          <ShoppingCart size={24} color="#ffffff" strokeWidth={2} style={{ position: 'relative', zIndex: 10 }} />
        {cartCount > 0 && (
          <span
            className="absolute flex items-center justify-center font-bold text-white bg-red-500 rounded-full"
            style={{
              top: -5,
              [isRTL ? 'right' : 'left']: -5,
              minWidth: 22,
              height: 22,
              fontSize: 12,
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              padding: '0 6px',
            }}
          >
            {cartCount}
          </span>
        )}
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleDrawer}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-[100dvh] w-[85vw] sm:w-[400px] max-w-full bg-white z-[70] shadow-[-10px_0_40px_rgba(0,0,0,0.1)] flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)]`}
        style={{ transform: isOpen ? 'translateX(0)' : `translateX(${isRTL ? '-100%' : '100%'})` }}
        dir={direction}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between bg-white z-10 sticky top-0" style={{ padding: '24px', borderBottom: '1px solid #f0f0f0' }}>
          <h2 className="font-extrabold text-gray-800 flex items-center m-0" style={{ fontSize: 'clamp(17px, 3.5vw, 22px)', gap: 10 }}>
            <div className="flex items-center justify-center" style={{ width: 36, height: 36, background: '#e8f5e9', borderRadius: 8, color: '#2E7D32' }}>
              <ShoppingCart size={18} strokeWidth={2} />
            </div>
            {locale === 'ar' ? 'سلة المشتريات' : 'Shopping Cart'}
            <span className="font-bold text-primary" style={{ background: '#e8f5e9', padding: '4px 10px', borderRadius: 20, fontSize: 13, marginLeft: 6 }}>
              {cartCount} {locale === 'ar' ? 'عنصر' : 'items'}
            </span>
          </h2>
          <button
            onClick={toggleDrawer}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto bg-white" style={{ padding: '24px' }}>
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="flex items-center justify-center" style={{ width: 80, height: 80, background: '#f5f5f5', borderRadius: '50%', marginBottom: 20, color: '#ccc' }}>
                <ShoppingCart size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-gray-800" style={{ fontSize: 18, marginBottom: 8 }}>{locale === 'ar' ? 'سلة مشترياتك فارغة' : 'Your cart is empty'}</h3>
              <p className="text-gray-500" style={{ fontSize: 14, marginBottom: 24 }}>{locale === 'ar' ? 'تصفح منتجاتنا وأضف ما يعجبك إلى السلة' : 'Browse our products and add your favorites'}</p>
              <button 
                onClick={toggleDrawer}
                className="font-bold transition-all cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #2E7D32, #43A047)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: 8,
                  fontSize: 14,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(46,125,50,0.15)'
                }}
              >
                {locale === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col" style={{ gap: 20 }}>
              {cartItems.map((item) => (
                <div key={item.id} className="flex relative transition-all" style={{ gap: 16, paddingBottom: 20, borderBottom: '1px solid #f0f0f0' }}>
                  {/* Product Image */}
                  <div className="flex-shrink-0" style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', border: '1px solid #f5f5f5' }}>
                    <img 
                      src={item.image} 
                      alt={locale === 'ar' ? item.nameAr : item.nameEn} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start" style={{ gap: 8, marginBottom: 4 }}>
                        <Link 
                          to={`/product/${item.id}`} 
                          onClick={toggleDrawer}
                          className="font-bold text-gray-800 transition-colors hover:text-primary"
                          style={{ fontSize: 14, lineHeight: '1.4', textDecoration: 'none', paddingRight: 24, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                        >
                          {locale === 'ar' ? item.nameAr : item.nameEn}
                        </Link>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="absolute cursor-pointer transition-colors hover:bg-red-50 rounded-full flex items-center justify-center"
                          style={{ 
                            top: 0, 
                            [isRTL ? 'left' : 'right']: 0, 
                            width: 28, 
                            height: 28, 
                            color: '#999',
                            border: 'none',
                            background: 'transparent'
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.color = '#ef4444')}
                          onMouseOut={(e) => (e.currentTarget.style.color = '#999')}
                          title={locale === 'ar' ? 'حذف من السلة' : 'Remove'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="font-bold text-primary" style={{ fontSize: 15, margin: 0 }}>
                        {item.price} <span style={{ fontSize: 12, fontWeight: 'normal', color: '#666' }}>{locale === 'ar' ? 'ج.م' : 'EGP'}</span>
                      </p>
                    </div>
                    
                    {/* Quantity Control */}
                    <div className="flex items-center mt-3">
                      <div className="flex items-center" style={{ border: '1px solid #e0e0e0', borderRadius: 6, height: 32, overflow: 'hidden' }}>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-100"
                          style={{ width: 32, height: '100%', background: '#fff', border: 'none', color: '#555' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="flex items-center justify-center font-bold text-gray-800" style={{ width: 32, height: '100%', background: '#fcfcfc', borderLeft: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', fontSize: 13 }}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-100"
                          style={{ width: 32, height: '100%', background: '#fff', border: 'none', color: '#555' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="bg-white sticky bottom-0 z-10" style={{ padding: '24px', borderTop: '1px solid #e0e0e0', boxShadow: '0 -4px 20px rgba(0,0,0,0.03)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
              <span className="font-semibold" style={{ color: '#666', fontSize: 14 }}>{locale === 'ar' ? 'الإجمالي (بدون التوصيل)' : 'Subtotal (excl. delivery)'}</span>
              <span className="font-extrabold text-gray-800" style={{ fontSize: 20 }}>
                {cartTotal} <span style={{ fontSize: 12, fontWeight: 'normal', color: '#666' }}>{locale === 'ar' ? 'ج.م' : 'EGP'}</span>
              </span>
            </div>
            
            <button
              onClick={() => {
                toggleDrawer();
                navigate('/checkout');
              }}
              className="w-full flex items-center justify-center font-bold text-white cursor-pointer transition-transform group"
              style={{
                height: 50,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #2E7D32, #43A047)',
                boxShadow: '0 4px 12px rgba(46,125,50,0.2)',
                gap: 8,
                border: 'none',
                fontSize: 15
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <CreditCard size={18} />
              {locale === 'ar' ? 'متابعة الدفع' : 'Proceed to Checkout'}
              {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </button>
            <button
              onClick={() => {
                toggleDrawer();
                navigate('/cart');
              }}
              className="w-full flex items-center justify-center font-bold cursor-pointer transition-colors"
              style={{
                height: 44,
                marginTop: 12,
                borderRadius: 10,
                background: '#f9fafb',
                color: '#555',
                border: '1px solid #eaeaea',
                fontSize: 14
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#2E7D32'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.color = '#555'; }}
            >
              {locale === 'ar' ? 'عرض تفاصيل السلة' : 'View Cart Details'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
