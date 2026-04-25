import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 pt-20">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100/50 text-blue-700 text-sm font-semibold tracking-wide border border-blue-200">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                Introducing Zenith Workspaces
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1]">
                Organize your team's work in one{' '}
                <span className="text-blue-600">
                  place.
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
                Store, sync, and share files with your team securely. Experience real-time collaboration, intuitive folders, and granular access control tailored for modern teams.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-md transition-all" onClick={() => navigate('/register')}>
                Start for free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-100 transition-all">
                <Play className="mr-2 h-5 w-5" />
                See how it works
              </Button>
            </div>
          </div>

          {/* Right content - Generated Illustration */}
          <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none flex justify-center items-center">
            {/* The illustration image */}
            <img 
              src="/hero-illustration.png" 
              alt="Zenith Cloud Storage Illustration" 
              className="relative z-10 w-full h-auto max-w-[500px] drop-shadow-2xl animate-in fade-in zoom-in duration-700"
            />
            
            {/* Decorative background glow behind the image to make it pop */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100 rounded-full blur-[100px] opacity-50 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}