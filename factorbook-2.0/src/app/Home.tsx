"use client";
import * as React from "react";
import Image from "next/image";
import Searchbar from "@/components/Searchbar";
import Select from "@/components/Select";
import Header from "@/components/Header";

const HomePage: React.FC = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--material-theme-ref-neutral-neutral17, #2A2A2D)",
          width: "100vw",
          height: "750px",
          margin: "0 auto",
          padding: "71px 144px",
          color: "white",
          fontFamily: "'Helvetica Neue', sans-serif",
        }}
      >
        <div style={{ flex: 1 }}>
          <header
            style={{
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              width: "509px",
              alignItems: "flex-start",
            }}
          >
            <h1
              style={{
                fontSize: "16px",
                fontWeight: "normal",
                marginBottom: "4px",
                color: "#FFF",
                fontFeatureSettings: "'clig' off, 'liga' off",
                lineHeight: "24px",
                letterSpacing: "0.15px",
              }}
            >
              Welcome to
            </h1>
            <div style={{ position: "relative", lineHeight: "42.465px" }}>
              <h2
                style={{
                  fontSize: "57px",
                  fontWeight: 500,
                  letterSpacing: "-2.28px",
                  marginBottom: "0px",
                  position: "relative",
                }}
              >
                factor
                <span
                  style={{
                    display: "block",
                    paddingLeft: "5rem",
                    position: "relative",
                  }}
                >
                  book
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="311"
                    height="60"
                    viewBox="0 0 400 61"
                    fill="none"
                    style={{
                      position: "absolute",
                      left: "-40px",
                      top: "45px",
                      bottom: "-20px",
                    }}
                  >
                    <path
                      d="M5 55.5C86.1348 -2.34681 214.849 -4.48929 306 21.2205"
                      stroke="rgba(218, 226, 136, 0.96)"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h2>
            </div>
            <p
              style={{
                color: "#FFF",
                fontFeatureSettings: "'clig' off, 'liga' off",
                fontSize: "18px",
                fontWeight: 400,
                lineHeight: "24px",
                letterSpacing: "0.15px",
                marginTop: "44px",
                maxWidth: "600px",
              }}
            >
              Factorbook is a resource for human and mouse transcription
              factors, focusing on their binding specificities and regulatory
              roles in gene expression across cell types. Factorbook integrates
              public data, especially ENCODE, to provide a wide-ranging motif
              catalog.
            </p>
          </header>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "9px 12px 8px 16px",
              gap: "3px",
              alignSelf: "stretch",
              marginTop: "32px",
              width: "100%", // Ensure the container takes full width
              maxWidth: "6700px", // Limit the maximum width to keep it manageable
            }}
          >
            <Searchbar
              placeholder="What are you searching for today?"
              helperText=""
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: "550px",
            height: "507.537px",
            padding: "7px 24px 6.537px 23px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src="/Factorbook.png"
            alt="Illustration"
            width={600}
            height={600}
          />
        </div>
      </div>

      <Header />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#FFFFFF",
          width: "100vw",
          height: "750px",
          margin: "0 auto",
          padding: "71px 144px",
          color: "black",
          fontFamily: "'Helvetica Neue', sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "554.382px",
            height: "372.055px",
            flexShrink: 0,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <Image
            src="/Face.png"
            alt="Illustration"
            width={554.382}
            height={372.055}
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "16px",
            width: "50%",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "16px",
              alignItems: "center",
              alignSelf: "stretch",
              fill: "rgba(135, 150, 199, 0.30)",
            }}
          >
            <Select />
            <button
              style={{
                marginLeft: "10px",
                padding: "8px 16px",
                background: "#6A0DAD",
                color: "#FFF",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Go
            </button>
          </div>
          <div
            style={{
              display: "flex",
              padding: "8px 16px",
              flexDirection: "column",
              alignItems: "flex-start",
              alignSelf: "stretch",
              marginTop: "16px",
            }}
          >
            <p style={{ color: "#000", margin: 0, fontWeight: 500 }}>
              Explore Transcription Factors
            </p>
            <p style={{ color: "#000", margin: "16px 0 0 0" }}>
              Transcription factors (TFs) are pivotal proteins regulating
              cellular functions by binding to specific DNA sequences. With
              around 1800 unique TFs in the human genome, they control gene
              transcription, crucial for processes like development and cell
              cycle.
            </p>
          </div>
        </div>
        <style jsx>{`
          @media (max-width: 768px) {
            div {
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            div > div:first-child {
              width: 100%;
              height: auto;
            }
            div > div:last-child {
              width: 100%;
              padding: 16px;
            }
          }
          @media (max-width: 480px) {
            div {
              padding: 16px;
            }
            div > div:last-child {
              padding: 8px;
            }
            button {
              margin-left: 5px;
              padding: 6px 12px;
            }
            p {
              font-size: 14px;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default HomePage;
