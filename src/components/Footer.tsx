import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Globe, Share2, X } from 'lucide-react';

type PolicyTopic = 'About SmartDeal' | 'Contact' | 'Privacy Policy' | 'Terms & Conditions' | 'Help Center';

const TOPIC_COPY: Record<PolicyTopic, { title: string; body: string }> = {
  'About SmartDeal': {
    title: 'About SmartDeal',
    body: 'SmartDeal is an Indian B2B & retail marketplace built to replace rigid fixed pricing with transparent price negotiation, tiered bulk savings, and verified group buying across manufacturers, wholesalers, and direct buyers.',
  },
  Contact: {
    title: 'Contact SmartDeal Support',
    body: 'Reach our Bengaluru merchant operations desk at support@smartdeal.in or call +91 80 4120 8900 (Monday to Saturday, 9:00 AM – 7:00 PM IST).',
  },
  'Privacy Policy': {
    title: 'Privacy Policy',
    body: 'We collect only essential trade identity, GST verification, and order fulfillment records. Negotiation transcripts are private between the participating buyer and seller.',
  },
  'Terms & Conditions': {
    title: 'Terms and Conditions',
    body: 'Accepted price offers and completed group-buy commitments represent binding wholesale quotes subject to seller stock verification and GST invoicing guidelines.',
  },
  'Help Center': {
    title: 'SmartDeal Help Center',
    body: 'Browse guides on submitting competitive unit offers, understanding tiered bulk pricing brackets, and locking group-buy allocations before campaign deadlines.',
  },
};

export const Footer: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<PolicyTopic | null>(null);

  return (
    <footer className="bg-[#14213D] text-white border-t border-[#1E293B]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-bold tracking-tight text-white">
              SmartDeal
            </Link>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Negotiate Better. Buy Smarter. Save More. Built for Indian buyers, retailers, wholesalers, and manufacturers.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Marketplace</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Explore Products
                </Link>
              </li>
              <li>
                <Link to="/negotiations" className="hover:text-white transition-colors">
                  Price Negotiation
                </Link>
              </li>
              <li>
                <Link to="/bulk-discounts" className="hover:text-white transition-colors">
                  Bulk Discounts
                </Link>
              </li>
              <li>
                <Link to="/group-buying" className="hover:text-white transition-colors">
                  Group Buying
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Workspaces</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link to="/buyer/dashboard" className="hover:text-white transition-colors">
                  Buyer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/seller/dashboard" className="hover:text-white transition-colors">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-white transition-colors">
                  Admin Console
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-white transition-colors">
                  Login & Sign Up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Company & Support</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              {(Object.keys(TOPIC_COPY) as PolicyTopic[]).map((topic) => (
                <li key={topic}>
                  <button
                    type="button"
                    onClick={() => setActiveTopic(topic)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {topic}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <p>© 2026 SmartDeal Marketplace Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:support@smartdeal.in"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>support@smartdeal.in</span>
            </a>
            <button
              type="button"
              onClick={() => setActiveTopic('About SmartDeal')}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTopic('Contact')}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>X / Twitter</span>
            </button>
          </div>
        </div>
      </div>

      {activeTopic && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white text-[#1E293B] rounded-xl border border-[#E2E8F0] max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between gap-4 mb-3">
              <h4 className="text-lg font-bold text-[#14213D]">{TOPIC_COPY[activeTopic].title}</h4>
              <button
                type="button"
                onClick={() => setActiveTopic(null)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#14213D]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-[#64748B] leading-relaxed">{TOPIC_COPY[activeTopic].body}</p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTopic(null)}
                className="px-4 py-2 rounded-lg bg-[#14213D] text-white text-sm font-medium hover:bg-[#1E293B]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
