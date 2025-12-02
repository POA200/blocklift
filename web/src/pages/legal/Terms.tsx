import SimpleHeader from "../../components/simple-header";
import SimpleFooter from "../../components/simple-footer";
import Seo from "../../components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, ArrowLeft } from "lucide-react";
import { navigate } from "@/lib/router";

export default function Terms() {
  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/");
    }
  };

  return (
    <div>
      <Seo
        title="Terms & Conditions - BlockLift"
        description="BlockLift terms and conditions governing the use of our website and blockchain-based services."
        noindex={false}
      />
      <SimpleHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>

        <Card className="border-2">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex items-center justify-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl md:text-4xl font-bold">
                BlockLift Terms and Conditions
              </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              This document governs your use of the BlockLift website and
              services.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Effective Date: December 2, 2025</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              {/* Section 1: Acceptance of Terms */}
              <AccordionItem value="acceptance">
                <AccordionTrigger className="text-lg font-semibold">
                  1. Acceptance of Terms
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    By accessing or using the BlockLift website and services,
                    you agree to be bound by these Terms and Conditions. If you
                    disagree with any part of the terms, you must not use our
                    service.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg border">
                    <p className="font-semibold text-foreground mb-2">
                      Eligibility
                    </p>
                    <p>
                      You must be at least 18 years old or the age of legal
                      majority in your jurisdiction to use our services and make
                      donations.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section 2: Definitions */}
              <AccordionItem value="definitions">
                <AccordionTrigger className="text-lg font-semibold">
                  2. Definitions
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-muted-foreground">
                  <ul className="space-y-3 ml-6 list-disc">
                    <li>
                      <strong className="text-foreground">
                        "Platform" / "Services":
                      </strong>{" "}
                      Refers to the BlockLift website, the Impact-Chain
                      Dashboard, and related services.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        "User" / "You":
                      </strong>{" "}
                      Refers to any person accessing the Platform, including
                      donors, volunteers, and partners.
                    </li>
                    <li>
                      <strong className="text-foreground">"Donation":</strong>{" "}
                      Any contribution made through the Platform (Fiat or
                      Crypto).
                    </li>
                    <li>
                      <strong className="text-foreground">
                        "Clarity Contract":
                      </strong>{" "}
                      The smart contract deployed on the Stacks Layer 2 that
                      records transaction data.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        "Proof of Impact NFT":
                      </strong>{" "}
                      The non-fungible token generated upon successful
                      verification of a donation/distribution event.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Section 3: Donation and Payment Terms */}
              <AccordionItem value="donation-payment">
                <AccordionTrigger className="text-lg font-semibold">
                  3. Donation and Payment Terms
                </AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  {/* Nature of Donations */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-base">
                        A. Nature of Donations
                      </h3>
                      <Badge variant="destructive">Non-refundable</Badge>
                    </div>
                    <p>
                      All donations made to BlockLift are non-refundable. By
                      donating, you acknowledge that you are contributing funds
                      to a social impact initiative and relinquish claim to the
                      contributed funds.
                    </p>
                  </div>

                  {/* Payment Processing */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground text-base">
                      B. Payment Processing
                    </h3>
                    <ul className="space-y-2 ml-6 list-disc">
                      <li>
                        <strong className="text-foreground">
                          Fiat Payments (Paystack/PayPal):
                        </strong>{" "}
                        We use third-party processors. We are not responsible
                        for processing delays or errors by these third parties.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          Crypto Payments (Stacks/Boom Wallet):
                        </strong>{" "}
                        Transactions are processed directly on the Stacks
                        blockchain. You are solely responsible for the
                        correctness of the amount, wallet address, and network
                        fees (gas).
                      </li>
                    </ul>
                  </div>

                  {/* Verification */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-base">
                        C. Verification and On-Chain Record
                      </h3>
                      <Badge className="bg-primary">Blockchain</Badge>
                    </div>
                    <ul className="space-y-2 ml-6 list-disc">
                      <li>
                        <strong className="text-foreground">
                          Verification Process:
                        </strong>{" "}
                        All donations are verified by our trusted NGO and Local
                        Ambassador network and finalized by a transaction to the
                        Clarity Contract.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          Immutability:
                        </strong>{" "}
                        You acknowledge that once a transaction is successfully
                        recorded on the Stacks blockchain, it is permanent and
                        cannot be reversed, modified, or deleted by BlockLift or
                        any other party.
                      </li>
                    </ul>
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4 rounded-lg">
                      <p className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
                        ⚠️ Immutability Notice
                      </p>
                      <p className="text-amber-800 dark:text-amber-300">
                        Blockchain transactions are permanent and irreversible.
                        Please verify all transaction details before confirming.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section 4: User Conduct */}
              <AccordionItem value="user-conduct">
                <AccordionTrigger className="text-lg font-semibold">
                  4. User Conduct and Responsibilities
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-muted-foreground">
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>
                      <strong className="text-foreground">Lawful Use:</strong>{" "}
                      You agree to use the Platform only for lawful purposes.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Accurate Information:
                      </strong>{" "}
                      You agree to provide accurate and complete information
                      (especially email for donation receipts).
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Wallet Security:
                      </strong>{" "}
                      You are solely responsible for securing your private keys,
                      passwords, and wallet credentials (e.g., Boom Wallet).
                      BlockLift has no access to your private keys and cannot
                      recover funds lost due to wallet compromise.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Prohibited Use:
                      </strong>{" "}
                      You must not engage in any activity that is fraudulent,
                      illegal, or attempts to disrupt the Platform or the
                      security of the Stacks network.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Section 5: Intellectual Property */}
              <AccordionItem value="intellectual-property">
                <AccordionTrigger className="text-lg font-semibold">
                  5. Intellectual Property (IP)
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-muted-foreground">
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>
                      <strong className="text-foreground">
                        Platform Content:
                      </strong>{" "}
                      All content on the website (text, logos, design, code,
                      etc.) is the property of BlockLift or its licensors and is
                      protected by copyright.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Proof of Impact NFT:
                      </strong>{" "}
                      The NFT represents verifiable proof of a donation event.
                      While you own the NFT, BlockLift retains the IP rights to
                      the associated imagery, logo, and smart contract code.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Section 6: Limitation of Liability */}
              <AccordionItem value="liability">
                <AccordionTrigger className="text-lg font-semibold">
                  6. Limitation of Liability
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-base">
                        "AS IS" Basis
                      </h3>
                      <Badge variant="outline">No Warranty</Badge>
                    </div>
                    <p>
                      The platform, including the Impact-Chain Dashboard, is
                      provided on an "as is" and "as available" basis. BlockLift
                      makes no warranties regarding the availability,
                      reliability, or accuracy of the data displayed (which
                      relies on the Stacks network).
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-base">
                        Blockchain Risk
                      </h3>
                      <Badge variant="destructive">High Risk</Badge>
                    </div>
                    <p>
                      You understand that using blockchain technology involves
                      risks, including regulatory changes, smart contract bugs,
                      and network volatility. BlockLift is not liable for any
                      losses arising from these inherent risks.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground text-base">
                      Maximum Liability
                    </h3>
                    <p>
                      BlockLift's maximum liability to you for any claim arising
                      from these terms shall be limited to the amount of the
                      donation in question.
                    </p>
                  </div>

                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-4 rounded-lg">
                    <p className="font-semibold text-red-900 dark:text-red-200 mb-2">
                      ⚠️ Risk Acknowledgment
                    </p>
                    <p className="text-red-800 dark:text-red-300">
                      By using BlockLift services, you acknowledge and accept
                      the inherent risks associated with blockchain technology
                      and cryptocurrency transactions.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section 7: Changes to Terms */}
              <AccordionItem value="changes">
                <AccordionTrigger className="text-lg font-semibold">
                  7. Changes to Terms
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-muted-foreground">
                  <p>
                    We reserve the right to modify these Terms and Conditions at
                    any time. We will notify users of significant changes by
                    updating the date at the top of this document. Continued use
                    of the Platform after changes constitutes acceptance of the
                    new terms.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* Section 8: Governing Law */}
              <AccordionItem value="governing-law">
                <AccordionTrigger className="text-lg font-semibold">
                  8. Governing Law
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-muted-foreground">
                  <p>
                    These Terms shall be governed and construed in accordance
                    with the laws of the Federal Republic of Nigeria, without
                    regard to its conflict of law provisions.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Contact Section */}
            <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
              <p>
                For questions or concerns about these Terms and Conditions,
                please contact us via our{" "}
                <a
                  href="/contact"
                  className="text-primary hover:underline font-medium"
                >
                  Contact Page
                </a>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <SimpleFooter />
    </div>
  );
}
