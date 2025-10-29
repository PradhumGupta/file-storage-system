import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
    const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                Now with AI-powered search
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                Your files,{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  anywhere
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
                Store, sync, and share your files with the world's most trusted cloud storage platform. 
                Access your content from any device, collaborate seamlessly, and never lose a file again.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-10 duration-700 delay-600">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"  onClick={() => navigate('/register')}>
                Get started free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200">
                <Play className="mr-2 h-5 w-5" />
                Watch demo
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-8 text-sm text-gray-500 animate-in fade-in duration-700 delay-800">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>700M+ users</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>99.9% uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Enterprise ready</span>
              </div>
            </div>
          </div>

          {/* Right content - Visual representation */}
          <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-300">
            <div className="relative mx-auto max-w-lg">
              {/* Main cloud storage visual */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <div className="w-5 h-5 bg-white rounded-sm"></div>
                    </div>
                    <div>
                      <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-2 bg-gray-100 rounded w-16"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`w-8 h-8 rounded ${i === 0 ? 'bg-red-100' : i === 1 ? 'bg-green-100' : i === 2 ? 'bg-yellow-100' : 'bg-purple-100'}`}></div>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded mb-1" style={{width: `${60 + i * 20}%`}}></div>
                          <div className="h-1.5 bg-gray-100 rounded" style={{width: `${40 + i * 15}%`}}></div>
                        </div>
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg animate-bounce delay-1000 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-lg opacity-90"></div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl shadow-lg animate-pulse delay-500 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded opacity-90"></div>
              </div>

              <div className="absolute top-1/2 -right-8 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg animate-ping delay-700"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}