import React, { useState, useRef, useEffect } from 'react';
import { Download, X, Type, Calendar, User, Award } from 'lucide-react';

const CertificateEditor = ({ studentName, onClose, onSave, certificateType = 'associate' }) => {
  const [name, setName] = useState(studentName || '');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);

  // Select certificate template based on type
  const certificateImage = certificateType === 'diploma'
    ? `${process.env.PUBLIC_URL || ''}/Sword Drill Diploma Certificate.png`
    : `${process.env.PUBLIC_URL || ''}/Sword Drill Associate Certificate.png`;

  const certificateTitle = certificateType === 'diploma' ? 'Diploma Level' : 'Associate Level';
  const certificateColor = certificateType === 'diploma' ? 'amber' : 'indigo';

  // Load and draw certificate with text overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw certificate image
      ctx.drawImage(img, 0, 0);

      // Configure text styling
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Draw student name (adjust position as needed for your certificate)
      ctx.font = 'bold 72px "Times New Roman", serif';
      ctx.fillStyle = '#1e3a8a'; // Dark blue color
      ctx.fillText(name, canvas.width / 2, canvas.height / 2 - 50);

      // Draw date (adjust position as needed)
      ctx.font = '36px "Times New Roman", serif';
      ctx.fillStyle = '#1e3a8a';
      ctx.fillText(date, canvas.width / 2, canvas.height / 2 + 200);
    };

    img.src = certificateImage;
  }, [name, date, certificateImage]);

  const handleDownload = () => {
    setIsGenerating(true);
    const canvas = canvasRef.current;

    // Create download link
    const link = document.createElement('a');
    const certType = certificateType === 'diploma' ? 'Diploma' : 'Associate';
    link.download = `${name.replace(/\s+/g, '_')}_${certType}_Certificate.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    setTimeout(() => {
      setIsGenerating(false);
      if (onSave) {
        onSave({ name, date, certificateUrl: link.href, certificateType });
      }
    }, 500);
  };

  const handleEmailCertificate = () => {
    // In production, this would send email via backend
    alert(`Certificate would be emailed to student at their registered email address.\n\nStudent: ${name}\nDate: ${date}`);
    if (onSave) {
      onSave({ name, date, emailed: true });
    }
  };

  // Determine color scheme based on certificate type
  const headerGradient = certificateType === 'diploma'
    ? 'from-amber-600 to-orange-600'
    : 'from-indigo-600 to-purple-600';
  const borderColor = certificateType === 'diploma'
    ? 'border-amber-500/50'
    : 'border-indigo-500/50';
  const accentColor = certificateType === 'diploma'
    ? 'text-amber-100'
    : 'text-indigo-100';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-slate-900 rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto border-2 ${borderColor} shadow-2xl`}>
        {/* Header */}
        <div className={`bg-gradient-to-r ${headerGradient} p-6 flex items-center justify-between sticky top-0 z-10`}>
          <div className="flex items-center gap-3">
            <Award size={32} className="text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Certificate Editor</h2>
              <p className={`${accentColor} text-sm`}>{certificateTitle} Certificate of Completion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-all"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        <div className="p-6">
          {/* Input Fields */}
          <div className="bg-slate-800/90 rounded-xl p-6 mb-6 border border-slate-600">
            <h3 className="text-xl font-bold text-indigo-400 mb-4">Certificate Details</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Student Name */}
              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  <User size={18} className="inline mr-2" />
                  Student Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter student's full name"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-serif text-lg"
                />
                <p className="text-xs text-slate-500 mt-1">This will appear on the certificate</p>
              </div>

              {/* Completion Date */}
              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  <Calendar size={18} className="inline mr-2" />
                  Completion Date
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Month Day, Year"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-serif text-lg"
                />
                <p className="text-xs text-slate-500 mt-1">Date of completion (e.g., December 23, 2024)</p>
              </div>
            </div>
          </div>

          {/* Certificate Preview */}
          <div className="bg-slate-800/90 rounded-xl p-6 mb-6 border border-slate-600">
            <h3 className="text-xl font-bold text-purple-400 mb-4">Certificate Preview</h3>
            <div className="bg-slate-900 rounded-lg p-4 border-2 border-slate-700">
              <canvas
                ref={canvasRef}
                className="w-full h-auto"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Preview updates automatically as you type
            </p>
          </div>

          {/* Text Position Guide */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-sm">
              <strong>Note:</strong> Text positions are optimized for the standard {certificateTitle} Certificate template.
              If text doesn't align correctly, you may need to adjust the Y-coordinate values in the CertificateEditor component.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              disabled={!name || isGenerating}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-lg font-bold text-white transition-all shadow-lg"
            >
              <Download size={20} />
              {isGenerating ? 'Generating...' : 'Download Certificate'}
            </button>

            <button
              onClick={handleEmailCertificate}
              disabled={!name}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-lg font-bold text-white transition-all shadow-lg"
            >
              <Type size={20} />
              Email to Student
            </button>

            <button
              onClick={onClose}
              className="px-6 py-4 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold text-white transition-all"
            >
              Cancel
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h4 className="font-bold text-slate-300 mb-2">Instructions:</h4>
            <ol className="text-sm text-slate-400 space-y-1 list-decimal list-inside">
              <li>Enter the student's full name exactly as it should appear on the certificate</li>
              <li>Verify the completion date is correct</li>
              <li>Review the preview to ensure text placement looks correct</li>
              <li>Click "Download Certificate" to save the certificate as a PNG image</li>
              <li>Click "Email to Student" to send the certificate to the student's registered email</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateEditor;
