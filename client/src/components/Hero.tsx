import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 pt-20">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-100 rounded-full blur-[120px] opacity-40 mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white text-blue-700 text-sm font-semibold tracking-wide border border-blue-200 shadow-sm mx-auto">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
            Introducing Zenith Workspaces
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            Organize your team's work in one{' '}
            <span className="text-blue-600">
              place.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Store, sync, and share files with your team securely. Experience real-time collaboration, intuitive folders, and granular access control tailored for modern teams.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg font-semibold rounded-xl shadow-md transition-all hover:-translate-y-1 w-full sm:w-auto" onClick={() => navigate('/register')}>
              Start for free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button size="lg" variant="outline" className="px-10 py-6 text-lg font-semibold rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300 transition-all w-full sm:w-auto bg-transparent">
              <Play className="mr-2 h-5 w-5" />
              See how it works
            </Button>
          </div>
          
          <div className="pt-10 flex items-center justify-center space-x-6 text-sm text-slate-500 font-medium">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div> No credit card required
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div> 14-day free trial
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}