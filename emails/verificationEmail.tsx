import * as React from "react";

import {
  Html,
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface EmailTemplateProps {
  userName: string;
  otp: string;
}

export default function VerificationEmail({
  userName,
  otp,
}: EmailTemplateProps) {
  return (
    <Html>
      <Head />

      <Preview>Your verification code is {otp}</Preview>

      <Body style={main}>
        <Container style={container}>
          {/* Logo / Brand */}
          <Section style={header}>
            <Heading style={heading}>Verify Your Account 🚀</Heading>

            <Text style={subHeading}>Hello {userName},</Text>
          </Section>

          {/* Main Content */}
          <Section>
            <Text style={text}>
              Thank you for signing up. Please use the verification code below
              to complete your account verification.
            </Text>

            {/* OTP Box */}
            <Section style={otpContainer}>
              <Text style={otpText}>{otp}</Text>
            </Section>

            <Text style={smallText}>
              This OTP is valid for 10 minutes. Please do not share this code
              with anyone.
            </Text>

            {/* Button */}
            <Section style={buttonContainer}>
              <Button href="https://yourwebsite.com" style={button}>
                Verify Account
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section>
            <Text style={footer}>
              If you did not create this account, you can safely ignore this
              email.
            </Text>

            <Text style={footerCopyright}>
              © 2026 Your Company. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* Styles */

const main = {
  backgroundColor: "#f4f4f7",
  fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px",
  borderRadius: "16px",
  maxWidth: "600px",
};

const header = {
  textAlign: "center" as const,
};

const heading = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#111827",
  marginBottom: "10px",
};

const subHeading = {
  fontSize: "16px",
  color: "#6b7280",
};

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#374151",
  marginTop: "30px",
};

const otpContainer = {
  backgroundColor: "#eef2ff",
  borderRadius: "12px",
  padding: "20px",
  textAlign: "center" as const,
  margin: "30px 0",
};

const otpText = {
  fontSize: "36px",
  fontWeight: "700",
  letterSpacing: "8px",
  color: "#4f46e5",
  margin: "0",
};

const smallText = {
  fontSize: "14px",
  color: "#6b7280",
  textAlign: "center" as const,
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "35px",
};

const button = {
  backgroundColor: "#4f46e5",
  color: "#ffffff",
  padding: "14px 32px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "16px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "40px 0 20px",
};

const footer = {
  fontSize: "13px",
  color: "#6b7280",
  textAlign: "center" as const,
  lineHeight: "22px",
};

const footerCopyright = {
  fontSize: "12px",
  color: "#9ca3af",
  textAlign: "center" as const,
  marginTop: "10px",
};
