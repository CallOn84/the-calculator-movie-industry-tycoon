"use client";

import Script from "next/script";

export default function DonateButton() {
  const handlePaypalLoad = () => {
    if (typeof window !== "undefined" && window.PayPal) {
      window.PayPal.Donation.Button({
        env: "production",
        hosted_button_id: "VSA6WY3VHC43L",
        image: {
          src: "https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif",
          alt: "Donate with PayPal button",
          title: "PayPal - The safer, easier way to pay online!",
        },
      }).render("#donate-button");
    }
  };

  return (
    <>
      <div id="donate-button-container" className="mt-8">
        <div id="donate-button"></div>
      </div>
      <Script
        id="paypal-donate-sdk"
        src="https://www.paypalobjects.com/donate/sdk/donate-sdk.js"
        strategy="afterInteractive"
        onLoad={handlePaypalLoad}
      />
    </>
  );
}
