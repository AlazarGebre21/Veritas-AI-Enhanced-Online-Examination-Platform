export default function CandidateAccessPage() {
  return <div className="min-h-screen flex items-center justify-center bg-warm-white">
    <div className="bg-white rounded-comfortable shadow-card p-8 w-full max-w-md border border-whisper">
      <h1 className="text-2xl font-bold text-notion-black mb-2">Enter Your Exam Token</h1>
      <p className="text-warm-gray-500 text-sm mb-6">Enter the access token provided in your enrollment email.</p>
      <input className="w-full border border-[#ddd] rounded-micro px-3 py-2 text-notion-black focus:outline-none focus:ring-2 focus:ring-focus-blue" placeholder="Paste token here..." />
    </div>
  </div>;
}
