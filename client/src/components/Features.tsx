import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, Users, Search, FolderOpen, LayoutGrid } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Team Workspaces',
    description: 'Create dedicated workspaces for different teams or projects. Keep files organized and isolated.',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    icon: Zap,
    title: 'Real-time Uploads',
    description: 'Upload files instantly with progress tracking. Support for large files and parallel uploads.',
    bgColor: 'bg-slate-100',
    iconColor: 'text-slate-700'
  },
  {
    icon: LayoutGrid,
    title: 'Flexible Views',
    description: 'Switch between detailed list views and visual grid views to find what you need faster.',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-700'
  },
  {
    icon: Search,
    title: 'Quick Search',
    description: 'Find files instantly across your entire workspace with our powerful search functionality.',
    bgColor: 'bg-slate-100',
    iconColor: 'text-slate-700'
  },
  {
    icon: FolderOpen,
    title: 'Nested Folders',
    description: 'Organize your files exactly how you want with deep, nested folder hierarchies.',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    icon: Shield,
    title: 'Access Control',
    description: 'Granular control over who can access, edit, and share your important workspace documents.',
    bgColor: 'bg-slate-100',
    iconColor: 'text-slate-700'
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Everything your team needs
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Powerful features designed to help teams organize, share, and collaborate on files effortlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
              >
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>


      </div>
    </section>
  );
}