import { Button } from '@/components/ui/button';
import { Menu, ServerIcon, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ServerIcon size={20} />
                {/* <div className="w-4 h-4 bg-white rounded-sm"></div> */}
              </div>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">Dropbox</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Products
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Solutions
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Pricing
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Resources
              </a>
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600" onClick={() => navigate('/login')}>
              Sign in
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6" onClick={() => navigate('/register')}>
              Get started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <a href="#" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Products
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Solutions
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Pricing
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Resources
              </a>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex flex-col space-y-2">
                  <Button variant="ghost" className="justify-start">
                    Sign in
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Get started
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}