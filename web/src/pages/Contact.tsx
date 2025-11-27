import SimpleHeader from "@/components/simple-header";
import SimpleFooter from "@/components/simple-footer";
import { useState } from "react";
import { Mail, Phone, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import { navigate } from "@/lib/router";

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        fill="currentColor"
        d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.56 4.11 1.53 5.82L0 24l6.33-1.66A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.2-3.48-8.52zM12 21.39c-1.78 0-3.5-.47-5.02-1.36l-.36-.21-3.76.99 1-3.67-.23-.38A9.83 9.83 0 012.1 12C2.1 6.58 6.51 2.17 12.01 2.17c2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 012.91 6.99c0 5.42-4.41 9.33-9.91 9.33zm5.4-7.4c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.64.07-.29-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.29-.35.44-.52.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.93-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.08-.13-.27-.2-.57-.35z"
      />
    </svg>
  );
}

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const formspreeId =
    (import.meta.env.VITE_FORMSPREE_ID as string | undefined) || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    if (!formspreeId) {
      setStatus("error");
      setErrorMsg("Form is not configured. Set VITE_FORMSPREE_ID.");
      return;
    }
    setStatus("sending");
    setErrorMsg(null);
    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        // Formspree returns 422 for validation errors
        const msg =
          body?.errors?.[0]?.message ||
          body?.message ||
          "Failed to send message";
        throw new Error(msg);
      }
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <Seo
        title="Contact"
        description="Contact BlockLift for partnerships, sponsorships, or general inquiries."
      />
      <SimpleHeader />
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Go Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (typeof window === "undefined") return;
              if (window.history.length > 1) {
                window.history.back();
              } else {
                navigate("/");
              }
            }}
            aria-label="Go back to previous page"
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              Contact Us
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-md mb-8">
              We are committed to attending to any of your enquiries about
              BLOCKLIFT and try to provide the best services.
            </p>
            <ul className="space-y-6 text-sm">
              <li className="flex items-center gap-4">
                <span className="p-2 rounded-md border border-primary text-primary">
                  <Mail className="h-4 w-4" />
                </span>
                <a
                  href="mailto:blocklift.stx@gmail.com"
                  className="font-mono underline hover:opacity-90"
                  aria-label="Send email to blocklift.stx@gmail.com"
                  title="Send us an email"
                >
                  blocklift.stx@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-4">
                <span className="p-2 rounded-md border border-primary text-primary">
                  <WhatsAppIcon className="h-4 w-4" />
                </span>
                <a
                  href="https://wa.me/2349029959227"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono underline hover:opacity-90"
                  aria-label="Chat with us on WhatsApp"
                  title="WhatsApp"
                >
                  +234 902 995 9227
                </a>
              </li>
              <li className="flex items-center gap-4">
                <span className="p-2 rounded-md border border-primary text-primary">
                  <Phone className="h-4 w-4" />
                </span>
                <a
                  href="tel:+2349029959227"
                  className="font-mono underline hover:opacity-90"
                  aria-label="Call +2349029959227"
                  title="Call"
                >
                  +2349029959227
                </a>
              </li>
            </ul>
          </div>
          {/* Right – Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-primary/70 bg-transparent focus-visible:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-primary/70 bg-transparent focus-visible:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full rounded-md border border-primary/70 bg-transparent px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                />
              </div>
              <Button
                type="submit"
                disabled={status === "sending"}
                className="w-full"
              >
                {status === "sending"
                  ? "Sending…"
                  : status === "sent"
                  ? "Sent!"
                  : "Send Message"}
              </Button>
              {status === "error" && (
                <p className="text-xs text-destructive">{errorMsg}</p>
              )}
              {status === "sent" && (
                <p className="text-xs text-emerald-500">
                  Thanks! We received your message.
                </p>
              )}
            </form>
          </div>
        </div>
      </main>
      <SimpleFooter />
    </div>
  );
}
