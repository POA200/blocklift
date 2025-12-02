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
import { Shield, Calendar, ArrowLeft } from "lucide-react";
import { navigate } from "@/lib/router";

export default function PrivacyPolicy() {
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
        title="Privacy Policy - BlockLift"
        description="BlockLift's privacy policy regarding data collection, blockchain transparency, and user privacy protection."
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
              <Shield className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl md:text-4xl font-bold">
                BlockLift Privacy Policy
              </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              This policy outlines how BlockLift ("we," "our," or "us") manages
              personal information and data related to its operations and the
              use of the Stacks blockchain.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Effective Date: December 2, 2025</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              {/* Section 1: Introduction */}
              <AccordionItem value="introduction">
                <AccordionTrigger className="text-lg font-semibold">
                  1. Introduction and Data Controller
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    BlockLift is committed to protecting your privacy. This
                    Privacy Policy explains our data collection, use, and
                    disclosure practices related to our website, services, and
                    the BlockLift Impact-Chain Dashboard.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg border">
                    <p className="font-semibold text-foreground mb-2">
                      Data Controller
                    </p>
                    <p>
                      BlockLift (Contact information available on the website)
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section 2: Information We Collect */}
              <AccordionItem value="information-collect">
                <AccordionTrigger className="text-lg font-semibold">
                  2. Information We Collect
                </AccordionTrigger>
                <AccordionContent className="space-y-6 text-muted-foreground">
                  <p>
                    We collect information based on how you interact with our
                    platform.
                  </p>

                  {/* Web2 Data */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-base">
                        A. Direct Information
                      </h3>
                      <Badge variant="secondary">Web2 Data</Badge>
                    </div>
                    <p>
                      This information is collected when you interact with our
                      forms or payment gateways:
                    </p>
                    <ul className="space-y-2 ml-6 list-disc">
                      <li>
                        <strong className="text-foreground">
                          Donation Information:
                        </strong>{" "}
                        Name (optional), Email address (required for receipts
                        and contact), and Donation amount.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          Ambassador/Volunteer Data:
                        </strong>{" "}
                        Full Name, Contact Information (phone number), Location,
                        and Experience (collected via the Ambassador Sign-up
                        Form).
                      </li>
                      <li>
                        <strong className="text-foreground">
                          Communication Data:
                        </strong>{" "}
                        Information submitted via the Contact Form or direct
                        emails.
                      </li>
                    </ul>
                  </div>

                  {/* Technical Data */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-base">
                        B. Automated Information
                      </h3>
                      <Badge variant="secondary">Technical Data</Badge>
                    </div>
                    <p>When you visit our website, we automatically collect:</p>
                    <ul className="space-y-2 ml-6 list-disc">
                      <li>
                        <strong className="text-foreground">Usage Data:</strong>{" "}
                        IP address, browser type, operating system, pages
                        viewed, time spent on pages, and referring website
                        addresses (via analytics tools like Google Analytics).
                      </li>
                      <li>
                        <strong className="text-foreground">
                          Cookies and Tracking:
                        </strong>{" "}
                        We use essential cookies to maintain session states and
                        non-essential cookies (like Google Analytics) for
                        performance tracking.
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section 3: Blockchain Data */}
              <AccordionItem value="blockchain-data">
                <AccordionTrigger className="text-lg font-semibold">
                  3. Information Collected via the Blockchain
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary">Web3 Data</Badge>
                    <Badge variant="destructive">Immutable</Badge>
                  </div>
                  <p>
                    Due to the decentralized nature of our platform, certain
                    information is public and immutable:
                  </p>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground text-base">
                      Transaction Metadata
                    </h3>
                    <p>
                      When a donation is made via Stacks (STX) or when a fiat
                      donation is verified, the following data is permanently
                      recorded on the Stacks Layer 2:
                    </p>
                    <ul className="space-y-2 ml-6 list-disc">
                      <li>
                        <strong className="text-foreground">
                          Stacks Address (Sender):
                        </strong>{" "}
                        The public wallet address that initiated the
                        transaction.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          Transaction Hash (TxID):
                        </strong>{" "}
                        The unique identifier linking the event to the Bitcoin
                        Layer.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          NFT Proof ID:
                        </strong>{" "}
                        The unique identifier for the Proof of Impact token.
                      </li>
                      <li>
                        <strong className="text-foreground">
                          Function Arguments:
                        </strong>{" "}
                        Encoded data related to the donation amount and the
                        targeted impact (recorded in the smart contract).
                      </li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4 rounded-lg">
                    <p className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
                      ⚠️ Nature of Blockchain Data
                    </p>
                    <p className="text-amber-800 dark:text-amber-300">
                      This data is public, immutable, and fully auditable by
                      anyone. BlockLift cannot alter or delete this information
                      once it is recorded on the Stacks blockchain.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section 4: How We Use Information */}
              <AccordionItem value="how-we-use">
                <AccordionTrigger className="text-lg font-semibold">
                  4. How We Use Your Information
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-muted-foreground">
                  <p>We use your data strictly for the following purposes:</p>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>
                      <strong className="text-foreground">
                        To Process Donations:
                      </strong>{" "}
                      To execute and verify transactions via Paystack or Stacks
                      and issue receipts.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        To Record Impact:
                      </strong>{" "}
                      To create the verifiable, on-chain record of your donation
                      via the Clarity smart contract.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        To Manage Community:
                      </strong>{" "}
                      To review and contact applicants for the Ambassador and
                      Volunteer programs.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Security and Legal:
                      </strong>{" "}
                      To prevent fraud, ensure the security of our services, and
                      comply with legal requirements.
                    </li>
                    <li>
                      <strong className="text-foreground">Analytics:</strong> To
                      understand website usage, optimize our platform, and track
                      the effectiveness of our campaigns.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Section 5: Data Sharing */}
              <AccordionItem value="data-sharing">
                <AccordionTrigger className="text-lg font-semibold">
                  5. Data Sharing and Disclosure
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-muted-foreground">
                  <p>We only share data necessary for our core operations:</p>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>
                      <strong className="text-foreground">
                        Payment Processors:
                      </strong>{" "}
                      Sharing necessary information (email, amount) with
                      Paystack or PayPal to process payments.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Legal Compliance:
                      </strong>{" "}
                      Disclosing information when required by law or to protect
                      our rights or the safety of others.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Public Blockchain:
                      </strong>{" "}
                      All Transaction Metadata (sender address, TxID, NFT ID) is
                      publicly visible on the Stacks network and explorers
                      (e.g., Stacks Explorer).
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Analytics Providers:
                      </strong>{" "}
                      Sharing anonymized usage data with Google Analytics.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Section 6: Your Rights */}
              <AccordionItem value="your-rights">
                <AccordionTrigger className="text-lg font-semibold">
                  6. Your Rights and Choices
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    As a user, you have the following rights regarding your
                    personal information:
                  </p>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>
                      <strong className="text-foreground">Access:</strong> You
                      may request details about the personal data we hold about
                      you (Web2 data only).
                    </li>
                    <li>
                      <strong className="text-foreground">Correction:</strong>{" "}
                      You may request correction of inaccurate or incomplete
                      personal data.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Opt-Out of Communications:
                      </strong>{" "}
                      You can opt out of non-essential marketing emails at any
                      time.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Data Deletion (Web2 Only):
                      </strong>{" "}
                      You can request the deletion of your personal data held in
                      our private database (e.g., Ambassador form data).
                    </li>
                  </ul>

                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-4 rounded-lg">
                    <p className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                      ℹ️ Note on Blockchain Data
                    </p>
                    <p className="text-blue-800 dark:text-blue-300">
                      We cannot delete or change any data recorded on the Stacks
                      blockchain, as the distributed ledger is immutable and
                      outside of our control.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section 7: Data Security */}
              <AccordionItem value="data-security">
                <AccordionTrigger className="text-lg font-semibold">
                  7. Data Security
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-muted-foreground">
                  <p>
                    We implement reasonable security measures (encryption,
                    secure servers) to protect the private Web2 information we
                    hold (emails, Ambassador applications). However, no system
                    is 100% secure, and you use our service at your own risk.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* Section 8: Changes to Policy */}
              <AccordionItem value="policy-changes">
                <AccordionTrigger className="text-lg font-semibold">
                  8. Changes to This Policy
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-muted-foreground">
                  <p>
                    We may update this Privacy Policy from time to time. We will
                    notify you of any significant changes by posting the new
                    policy on this page.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Contact Section */}
            <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
              <p>
                For questions or concerns about this Privacy Policy, please
                contact us via our{" "}
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
