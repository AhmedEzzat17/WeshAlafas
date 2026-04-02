import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

/* ====== SVG Icons ====== */
const ChevronIcon = ({ isOpen }) => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    viewBox="0 0 24 24"
    style={{
      transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
      flexShrink: 0,
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);

const QuestionBubbleIcon = () => (
  <svg
    width="28"
    height="28"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default function FAQ() {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";
  const [openIndex, setOpenIndex] = useState(0);

  const faqData = [
    {
      questionEn: "How long does the delivery take?",
      questionAr: "كم يستغرق التوصيل؟",
      answerEn:
        "Standard delivery takes 2-5 business days depending on your location. Express delivery is available for same-day or next-day delivery in selected areas.",
      answerAr:
        "التوصيل العادي يستغرق من 2-5 أيام عمل حسب موقعك. التوصيل السريع متاح للتوصيل في نفس اليوم أو اليوم التالي في مناطق مختارة.",
    },
    {
      questionEn: "What is the payment method?",
      questionAr: "ما هي طرق الدفع؟",
      answerEn:
        "We accept credit cards, debit cards, cash on delivery, and digital wallets. All online payments are secured with SSL encryption.",
      answerAr:
        "نقبل بطاقات الائتمان، بطاقات الخصم، الدفع عند الاستلام، والمحافظ الرقمية. جميع المدفوعات عبر الإنترنت مؤمنة بتشفير SSL.",
    },
    {
      questionEn: "Are the farmers certified?",
      questionAr: "هل المزارعون معتمدون؟",
      answerEn:
        "Yes, all our partner farmers are certified organic producers. We regularly inspect their farms to ensure the highest quality standards are maintained.",
      answerAr:
        "نعم، جميع المزارعين الشركاء لدينا منتجون عضويون معتمدون. نقوم بزيارات تفتيشية منتظمة لمزارعهم لضمان الحفاظ على أعلى معايير الجودة.",
    },
    {
      questionEn: "Can I return a product?",
      questionAr: "هل يمكنني إرجاع منتج؟",
      answerEn:
        "Absolutely! If you're not satisfied with your purchase, you can return it within 48 hours of delivery for a full refund. Fresh produce must be reported within 24 hours.",
      answerAr:
        "بالطبع! إذا لم تكن راضياً عن مشترياتك، يمكنك إرجاعها خلال 48 ساعة من التوصيل لاسترداد كامل المبلغ. المنتجات الطازجة يجب الإبلاغ عنها خلال 24 ساعة.",
    },
    {
      questionEn: "How do I track my order?",
      questionAr: "كيف أتتبع طلبي؟",
      answerEn:
        "Once your order is confirmed, you'll receive a tracking link via SMS and email. You can also track your order in real-time from your account dashboard.",
      answerAr:
        "بمجرد تأكيد طلبك، ستتلقى رابط تتبع عبر رسالة نصية والبريد الإلكتروني. يمكنك أيضاً تتبع طلبك في الوقت الفعلي من لوحة تحكم حسابك.",
    },
    {
      questionEn: "Do you offer bulk or wholesale pricing?",
      questionAr: "هل تقدمون أسعار الجملة؟",
      answerEn:
        "Yes, we offer competitive wholesale pricing for businesses and restaurants. Contact our sales team for custom quotes and dedicated delivery schedules.",
      answerAr:
        "نعم، نقدم أسعار جملة تنافسية للشركات والمطاعم. تواصل مع فريق المبيعات لدينا للحصول على عروض أسعار مخصصة وجداول توصيل خاصة.",
    },
  ];

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        background: "linear-gradient(180deg, #f8faf8 0%, #edf7ed 100%)",
        padding: "40px 30px 70px",
      }}
    >
      <style>{`
        @keyframes faqSlideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 300px; }
        }
        @keyframes faqFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .faq-answer-enter {
          animation: faqSlideDown 0.35s ease-out forwards;
          overflow: hidden;
        }
        .faq-item {
          transition: all 0.3s ease;
        }
        .faq-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(46,125,50,0.1);
        }
        .faq-item.active {
          border-color: #2E7D32 !important;
          box-shadow: 0 8px 28px rgba(46,125,50,0.12);
        }
        .faq-btn {
          transition: all 0.2s ease;
        }
        .faq-btn:hover .faq-chevron {
          color: #2E7D32;
        }
      `}</style>

      <div
        className="max-w-[1920px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16"
      >
        {/* Header */}
        <div
          style={{
            textAlign: isRTL ? "right" : "left",
            marginBottom: 48,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #2E7D32, #43A047)",
              color: "#fff",
              marginBottom: 20,
              boxShadow: "0 6px 20px rgba(46,125,50,0.3)",
            }}
          >
            <QuestionBubbleIcon />
          </div>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 32px)",
              fontWeight: 800,
              color: "#1a1a1a",
              marginBottom: 10,
              lineHeight: 1.3,
            }}
          >
            {isRTL ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "#6B7280",
              maxWidth: 480,
              lineHeight: 1.7,
            }}
          >
            {isRTL
              ? "إجابات على أكثر الأسئلة شيوعاً حول منتجاتنا وخدماتنا"
              : "Answers to the most common questions about our products and services"}
          </p>
        </div>

        {/* FAQ Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? "active" : ""}`}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: isOpen ? "1.5px solid #2E7D32" : "1.5px solid #E5E7EB",
                  overflow: "hidden",
                  animation: `faqFadeIn 0.4s ease-out ${index * 0.08}s both`,
                }}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggle(index)}
                  className="faq-btn"
                  style={{
                    width: "100%",
                    padding: "18px 22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      flex: 1,
                    }}
                  >
                    {/* Number badge */}
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: isOpen
                          ? "linear-gradient(135deg, #2E7D32, #43A047)"
                          : "#F3F4F6",
                        color: isOpen ? "#fff" : "#6B7280",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                        flexShrink: 0,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: isOpen ? 700 : 600,
                        color: isOpen ? "#1a1a1a" : "#374151",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isRTL ? faq.questionAr : faq.questionEn}
                    </span>
                  </div>
                  {/* Chevron */}
                  <div
                    className="faq-chevron"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: isOpen ? "#E8F5E9" : "#F9FAFB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isOpen ? "#2E7D32" : "#9CA3AF",
                      transition: "all 0.3s ease",
                      flexShrink: 0,
                    }}
                  >
                    <ChevronIcon isOpen={isOpen} />
                  </div>
                </button>

                {/* Answer */}
                {isOpen && (
                  <div className="faq-answer-enter">
                    <div
                      style={{
                        padding: "0 22px 20px",
                        paddingLeft: isRTL ? 22 : 68,
                        paddingRight: isRTL ? 68 : 22,
                      }}
                    >
                      <div
                        style={{
                          height: 1,
                          background: "linear-gradient(90deg, transparent, #E5E7EB, transparent)",
                          marginBottom: 16,
                        }}
                      />
                      <p
                        style={{
                          fontSize: 14,
                          color: "#6B7280",
                          lineHeight: 1.8,
                          margin: 0,
                        }}
                      >
                        {isRTL ? faq.answerAr : faq.answerEn}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            textAlign: isRTL ? "center" : "center",
            marginTop: 36,
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: "#6B7280",
              marginBottom: 6,
            }}
          >
            {isRTL
              ? "لم تجد إجابة لسؤالك؟"
              : "Still have questions?"}
          </p>
          <Link
            to="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              fontWeight: 700,
              color: "#2E7D32",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#14532D";
              e.currentTarget.style.gap = "12px";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#2E7D32";
              e.currentTarget.style.gap = "8px";
            }}
          >
            {isRTL ? "تواصل معنا" : "Contact Us"}
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
              style={{
                transform: isRTL ? "scaleX(-1)" : "none",
                transition: "transform 0.3s ease",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
