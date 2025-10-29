import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, Users, Smartphone, Globe, Lock } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and advanced security features to keep your files safe and compliant.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Zap,
    title: 'Lightning Fast Sync',
    description: 'Instant file synchronization across all your devices with our optimized sync technology.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together seamlessly with real-time collaboration tools and shared workspaces.',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Access and edit your files on any device with our award-winning mobile apps.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Your files are available anywhere in the world with our global infrastructure.',
    color: 'from-pink-500 to-red-500'
  },
  {
    icon: Lock,
    title: 'Advanced Permissions',
    description: 'Granular control over who can access, edit, and share your important documents.',
    color: 'from-indigo-500 to-indigo-600'
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              stay productive
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to help individuals and teams work smarter, 
            collaborate better, and achieve more together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">700M+</div>
              <div className="text-blue-100">Registered users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">300K+</div>
              <div className="text-blue-100">Business customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime guarantee</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1B+</div>
              <div className="text-blue-100">Files uploaded daily</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}