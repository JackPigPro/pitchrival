'use client'

export default function LaunchBanner() {
  return (
    <div className="launch-banner">
      <div className="launch-content">
        <div className="launch-icon">🚀</div>
        <div className="launch-text">
          <span className="launch-label">Launching</span>
          <span className="launch-date">July 20th at 10AM EST</span>
        </div>
      </div>
      
      <style jsx>{`
        .launch-banner {
          width: 100%;
          background: var(--card);
          color: var(--text);
          padding: 12px 0;
          text-align: center;
          font-family: var(--font-display);
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--border);
        }
        
        .launch-banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          animation: shimmer 3s infinite;
          opacity: 0.1;
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        .launch-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }
        
        .launch-icon {
          font-size: 18px;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .launch-text {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        
        .launch-label {
          opacity: 0.7;
          color: var(--text2);
        }
        
        .launch-date {
          font-weight: 800;
          color: var(--gold);
        }
        
        @media (max-width: 768px) {
          .launch-content {
            gap: 8px;
          }
          
          .launch-text {
            font-size: 13px;
            gap: 6px;
          }
          
          .launch-icon {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  )
}
