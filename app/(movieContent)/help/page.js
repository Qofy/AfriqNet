import { Search, HelpCircle, MessageCircle, Mail, ExternalLink } from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Click 'Sign Up' in the top right corner, fill in your details (name, email, password), and click 'Create Account'. You'll be automatically logged in after registration."
    },
    {
      question: "I forgot my password. How can I reset it?",
      answer: "Currently, password reset is not available through the website. Please contact our support team at support@africannet.com for assistance with password recovery."
    },
    {
      question: "Why can't I play a video?",
      answer: "Video playback issues can occur due to: 1) Poor internet connection, 2) Browser compatibility issues, 3) The video file may be corrupted. Try refreshing the page, checking your internet connection, or using a different browser."
    },
    {
      question: "How do I update my profile information?",
      answer: "Go to your Account page by clicking your profile picture in the top right corner, then select 'Account'. You can update your name, email, profile picture, and password from there."
    },
    {
      question: "What video formats are supported?",
      answer: "AfriqNet supports MP4, WebM, and MOV video formats. For the best experience, we recommend MP4 files with H.264 encoding."
    },
    {
      question: "How do I delete my account?",
      answer: "In your Account settings, scroll down to the 'Danger Zone' section. Type 'DELETE' in the confirmation field and click 'Delete Account'. This action cannot be undone."
    },
    {
      question: "Can I download videos for offline viewing?",
      answer: "Currently, AfriqNet does not support video downloads. All content must be streamed online. We're considering this feature for future updates."
    },
    {
      question: "Why is the video quality poor?",
      answer: "Video quality depends on your internet connection speed and the original video quality. Slower connections may result in lower quality playback to prevent buffering."
    }
  ];

  const troubleshooting = [
    {
      issue: "Page won't load",
      solutions: [
        "Check your internet connection",
        "Clear your browser cache and cookies",
        "Try a different browser or incognito/private mode",
        "Disable browser extensions temporarily",
        "Restart your browser"
      ]
    },
    {
      issue: "Video keeps buffering",
      solutions: [
        "Check your internet speed (minimum 5 Mbps recommended)",
        "Close other applications using internet",
        "Try lowering video quality if option is available",
        "Pause the video and let it buffer for a few minutes",
        "Switch to a different network if possible"
      ]
    },
    {
      issue: "Can't log in",
      solutions: [
        "Check that your email and password are correct",
        "Ensure Caps Lock is not enabled",
        "Clear browser cookies and try again",
        "Try resetting your password",
        "Contact support if the issue persists"
      ]
    },
    {
      issue: "Mobile app issues",
      solutions: [
        "Force close and restart the app",
        "Check for app updates in your app store",
        "Restart your device",
        "Ensure you have a stable internet connection",
        "Clear app cache (Android) or reinstall app (iOS)"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white ">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 mt-25">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Find answers to common questions and get help with AfriqNet
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-white"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900 rounded-xl p-6 text-center hover:bg-gray-800 transition-colors">
            <HelpCircle className="mx-auto mb-4 text-blue-400" size={48} />
            <h3 className="text-lg font-semibold mb-2">Frequently Asked Questions</h3>
            <p className="text-gray-400 text-sm">Quick answers to common questions</p>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-6 text-center hover:bg-gray-800 transition-colors">
            <MessageCircle className="mx-auto mb-4 text-green-400" size={48} />
            <h3 className="text-lg font-semibold mb-2">Live Chat Support</h3>
            <p className="text-gray-400 text-sm">Get instant help from our team</p>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-6 text-center hover:bg-gray-800 transition-colors">
            <Mail className="mx-auto mb-4 text-purple-400" size={48} />
            <h3 className="text-lg font-semibold mb-2">Email Support</h3>
            <p className="text-gray-400 text-sm">support@africannet.com</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* FAQs */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <HelpCircle className="text-blue-400" size={24} />
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="bg-gray-900 rounded-lg overflow-hidden">
                  <summary className="px-6 py-4 cursor-pointer hover:bg-gray-800 transition-colors font-medium">
                    {faq.question}
                  </summary>
                  <div className="px-6 pb-4">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Troubleshooting */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Troubleshooting Guide</h2>
            
            <div className="space-y-6">
              {troubleshooting.map((item, index) => (
                <div key={index} className="bg-gray-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-yellow-400">{item.issue}</h3>
                  <ul className="space-y-2">
                    {item.solutions.map((solution, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300">
                        <span className="text-blue-400 mt-1">•</span>
                        {solution}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help you with any questions or issues you may have.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@africannet.com"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
            >
              <Mail size={20} />
              Email Support
            </a>
            
            <button className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors">
              <MessageCircle size={20} />
              Start Live Chat
            </button>
            
            <a
              href="/feedback"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors"
            >
              <ExternalLink size={20} />
              Send Feedback
            </a>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-12 bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">System Status</h3>
              <p className="text-gray-400">All systems operational</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-400">Online</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>AfriqNet Help Center • Last updated: April 29, 2026</p>
          <p className="mt-2">
            For urgent issues, please contact our emergency support line: +49 (175) 123-4567
          </p>
        </div>
      </div>
    </div>
  );
}
