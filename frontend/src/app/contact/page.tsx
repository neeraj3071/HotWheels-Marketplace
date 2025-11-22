'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:neerajsa@umich.edu?subject=${encodeURIComponent(subject || 'Website Contact')}&body=${encodeURIComponent(
      `Name: ${name}%0D%0A%0D%0A${message}`
    )}`;
    window.location.href = mailto;
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-600 mb-4">Contact</h1>
        <p className="text-gray-700 mb-6">Have questions or want to get involved? Reach out.</p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Email</h3>
            <a href="mailto:neerajsa@umich.edu" className="text-orange-600 hover:underline">neerajsa@umich.edu</a>

            <h3 className="font-semibold mt-4 mb-2">Social</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.instagram.com/neerxj.7?igsh=ZDg0OTUwejcwZ3Fw&utm_source=qr" target="_blank" rel="noreferrer" className="text-orange-600 hover:underline">Instagram</a>
              </li>
              <li>
                <a href="https://discord.gg/hmetCUFb" target="_blank" rel="noreferrer" className="text-orange-600 hover:underline">Discord</a>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Send a Message</h3>
            <form onSubmit={onSubmit} className="space-y-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full p-2 border rounded" />
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full p-2 border rounded" />
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" className="w-full p-2 border rounded h-32" />
              <div className="flex justify-end">
                <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">Send via Email</button>
              </div>
            </form>
          </div>
        </div>

        <p className="text-sm text-gray-500">Alternatively, use the email or social links above to reach us directly.</p>
      </div>
    </div>
  );
}
