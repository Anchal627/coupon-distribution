import { data } from "autoprefixer";
import { AlertCircle, Gift, Ticket } from "lucide-react";
import React, { useState, useEffect } from "react";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [nextCoupon, setNextCoupon] = useState(null);

  useEffect(() => {
    fetchNextCoupon();
    checkTimeLeft();
  }, []);

  const fetchNextCoupon = async () => {
    try {
      const response = await fetch(
        "https://coupon-distribution-t7cz.onrender.com/api/coupons/next"
      );
      const data = await response.json();
      if (response.ok) {
        setNextCoupon(data);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage("Error fetching coupon");
    }
  };

  const checkTimeLeft = () => {
    const storedTime = localStorage.getItem("nextCouponTime");
    if (storedTime) {
      const remainingTime = Math.max(0, storedTime - Date.now());
      setTimeLeft(remainingTime);
      if (remainingTime > 0) {
        const interval = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1000) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1000;
          });
        }, 1000);
      }
    }
  };
  const claimCoupon = async () => {
    setLoading(true);
    try {
      const browserId =
        localStorage.getItem("browserId") || generateBrowserId();

      const response = await fetch(
        `https://coupon-distribution-t7cz.onrender.com/api/coupons/claim/${nextCoupon._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ browserId }),
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setCoupon(data.coupon);
        setMessage(data.message);
        localStorage.setItem("nextCouponTime", Date.now() + 3600000);
        setTimeLeft(3600000);
      } else {
        setMessage(data.error || "Error claiming coupon");
      }
    } catch (error) {
      setMessage("Error claiming coupon");
    }
    setLoading(false);
  };

  const generateBrowserId = () => {
    const id = Math.random().toString(36).substring(2, 15);
    localStorage.setItem("browserId", id);
    return id;
  };
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Coupon Distributor
          </h1>
          <p className="text-gray-600">Get your exclusive discount coupon</p>
        </div>

        {timeLeft > 0 ? (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
              <p className="text-orange-700">
                Next coupon available in: {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        ) : null}
        {nextCoupon ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center mb-6">
            <Gift className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              Next Available Coupon
            </h3>
            <p className="text-3xl font-mono font-bold text-blue-600 mb-2">
              {nextCoupon.code}
            </p>
            <p className="text-blue-600 text-sm">
              {nextCoupon.discount}% off your next purchase
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm mt-4">
            No coupons available.
          </p>
        )}
        {coupon ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mb-6">
            <Gift className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Your Coupon Code
            </h3>
            <p className="text-3xl font-mono font-bold text-green-600 mb-2">
              {coupon.code}
            </p>
            <p className="text-green-600 text-sm">
              {coupon.discount}% off your next purchase
            </p>
          </div>
        ) : null}

        <button
          onClick={claimCoupon}
          disabled={loading || timeLeft > 0}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
            loading || timeLeft > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 active:transform active:scale-95"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : timeLeft > 0 ? (
            "Wait for next coupon"
          ) : (
            "Claim Your Coupon"
          )}
        </button>
        {coupon ? (
          message
        ) : (
          <p className="text-center text-gray-500 text-sm mt-4">
            One coupon per hour per device
          </p>
        )}
      </div>
      {/* <Toaster position="top-center" /> */}
    </div>
  );
};

export default App;
