import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const footerLinks = {
  'Products': [
    'Dropbox Basic',
    'Dropbox Plus',
    'Dropbox Family',
    'Dropbox Professional',
    'Dropbox Business',
    'Enterprise'
  ],
  'Features': [
    'File sharing',
    'Cloud storage',
    'Mobile apps',
    'Integrations',
    'File recovery',
    'Password protect'
  ],
  'Support': [
    'Help center',
    'Contact us',
    'Privacy & terms',
    'Cookie policy',
    'AI principles',
    'Sitemap'
  ],
  'Company': [
    'About us',
    'Jobs',
    'Investor relations',
    'ESG',
    'Brand assets',
    'Referrals'
  ]
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' }
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <div className="w-5 h-5 bg-white rounded-sm"></div>
              </div>
              <span className="text-2xl font-bold">Dropbox</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Dropbox brings everything—traditional files, cloud content, and web shortcuts—together in one place.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap items-center space-x-6 mb-4 md:mb-0">
              <select className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm">
                <option>English (United States)</option>
                <option>Español</option>
                <option>Français</option>
                <option>Deutsch</option>
              </select>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 Dropbox, Inc. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}