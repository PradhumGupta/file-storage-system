import { CheckCircle2 } from 'lucide-react';

const steps = [
  {
    title: 'Create a Workspace',
    description: 'Start by creating a workspace for your team or project. This acts as an isolated environment for all related files.',
  },
  {
    title: 'Invite your Team',
    description: 'Add members to your workspace. Control who has access and manage permissions easily from the dashboard.',
  },
  {
    title: 'Upload and Organize',
    description: 'Drag and drop files, create nested folders, and keep everything structured exactly how your team works best.',
  },
  {
    title: 'Collaborate Seamlessly',
    description: 'Share links, find files with quick search, and ensure everyone is always on the same page with real-time updates.',
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            How Zenith Works
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get your team up and running in minutes with a simple, intuitive workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side: Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 mr-5">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right side: Visual */}
          <div className="relative">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
              <div className="space-y-4">
                <div className="h-8 bg-slate-100 rounded-md w-1/3 mb-6"></div>
                
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center p-3 border border-slate-100 rounded-lg">
                    <CheckCircle2 className="text-green-500 mr-3" size={20} />
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                      U{i}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Decorative background block */}
            <div className="absolute -top-4 -right-4 w-full h-full border-2 border-blue-100 rounded-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
