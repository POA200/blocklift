// Blog posts metadata manifest
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
}

export const POSTS_MANIFEST: BlogPost[] = [
  {
    slug: "stacks-nft-impact-explained",
    title: "Stacks NFT Impact Explained: How BlockLift Uses Bitcoin-Secured Proof",
    date: "Dec 2, 2025",
    excerpt:
      "Discover how BlockLift leverages Stacks Layer 2 to create immutable, Bitcoin-secured Proof of Impact NFTs that verify every donation and distribution.",
    category: "Stacks",
  },
  {
    slug: "ambassador-spotlight-lagos",
    title: "Ambassador Spotlight: Bringing BlockLift to Lagos Communities",
    date: "Nov 28, 2025",
    excerpt:
      "Meet our local ambassadors in Lagos who are bridging the gap between blockchain technology and grassroots impact, ensuring transparent aid delivery.",
    category: "Community",
  },
  {
    slug: "transparency-blockchain-charity",
    title: "Why Transparency Matters: The Case for Blockchain in Charity",
    date: "Nov 20, 2025",
    excerpt:
      "Traditional charity models often lack transparency. Learn how BlockLift's blockchain-based approach ensures every donation is tracked, verified, and immutable.",
    category: "Blockchain",
  },
  {
    slug: "first-distribution-success",
    title: "Success Story: Our First Major School Supply Distribution",
    date: "Nov 15, 2025",
    excerpt:
      "Celebrating our milestone: 500 students across 5 schools received essential supplies. See how blockchain verification made every step transparent and accountable.",
    category: "Impact",
  },
  {
    slug: "how-to-verify-donation",
    title: "How to Verify Your Donation on the Stacks Blockchain",
    date: "Nov 10, 2025",
    excerpt:
      "A step-by-step guide for donors to verify their contributions on the Stacks blockchain using the Impact-Chain Dashboard and Stacks Explorer.",
    category: "Tutorial",
  },
  {
    slug: "paystack-integration-announcement",
    title: "Announcing Paystack Integration: Donate with Naira, Verify on Bitcoin",
    date: "Nov 5, 2025",
    excerpt:
      "We've integrated Paystack to make donations easier for Nigerian donors. Pay with Naira and get the same blockchain verification as crypto donations.",
    category: "Product",
  },
];
