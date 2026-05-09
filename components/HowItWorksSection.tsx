'use client'

import { useState } from 'react'

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  return (
    <div id="how-it-works" className="feature-section fs-how" style={{
      backgroundImage: 'linear-gradient(rgba(21,128,61,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(21,128,61,.065) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
      padding: '40px 0',
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      display: 'block', // Override the grid layout
      borderBottom: 'none', // Remove the default border
      minHeight: 'auto' // Override the min-height
    }}>
      <div className="fs-label b" style={{ paddingLeft: '24px', paddingRight: '24px' }}>⚡ How It Works</div>

      {/* Horizontal step boxes */}
      <div className="steps-horizontal" style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        margin: '20px 0 0',
        gap: '80px',
        paddingLeft: '80px',
        paddingRight: '80px'
      }}>
        {/* Sign Up Box */}
        <div
          className="step-box"
          style={{
            flex: '0 0 312px',
            background: activeStep === 1 ? 'var(--green)' : 'var(--card)',
            border: activeStep === 1 ? '2px solid var(--green)' : '1px solid var(--border)',
            borderRadius: '16px',
            padding: '50px 25px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: activeStep === 1 ? 'translateY(-4px)' : 'translateY(0)',
            boxShadow: activeStep === 1 ? '0 8px 24px rgba(0,0,0,0.15)' : 'var(--shadow)',
            position: 'relative',
            margin: '20px 0'
          }}
          onMouseEnter={() => setActiveStep(1)}
          onMouseLeave={() => setActiveStep(null)}
        >
          <div 
            className="step-number"
            style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '39px',
              height: '39px',
              borderRadius: '50%',
              background: activeStep === 1 ? 'white' : 'var(--green)',
              color: activeStep === 1 ? 'var(--green)' : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '20px',
              fontFamily: 'var(--font-display)',
              border: activeStep === 1 ? '2px solid white' : 'none',
              zIndex: 2
            }}
          >
            1
          </div>

          <h3 style={{
            fontSize: '24px',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            color: activeStep === 1 ? 'white' : 'var(--text)',
            margin: '0 0 16px',
            letterSpacing: '-0.5px'
          }}>
            Sign Up
          </h3>

          <p style={{
            fontSize: '16px',
            color: activeStep === 1 ? 'rgba(255,255,255,0.9)' : 'var(--text2)',
            lineHeight: 1.4,
            margin: '0 0 24px'
          }}>
            Free account, 30 seconds
          </p>

          <div 
            className="step-visual"
            style={{
              display: 'flex',
              justifyContent: 'center',
              transform: activeStep === 1 ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              background: activeStep === 1 ? 'white' : 'var(--green)',
              color: activeStep === 1 ? 'var(--green)' : 'white',
              padding: '14px 28px',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease'
            }}>
              Sign Up Free
            </div>
          </div>
          
          <div style={{
            position: 'absolute',
            top: '50%',
            right: '-65px',
            transform: 'translateY(-50%)',
            color: 'white',
            fontSize: '48px',
            fontWeight: 900,
            zIndex: 1,
            textShadow: '0 5px 10px rgba(0,0,0,0.7)',
            letterSpacing: '-5px',
            strokeWidth: '3px',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
          }}>
            →
          </div>
        </div>

        {/* Compete Box */}
        <div
          className="step-box"
          style={{
            flex: '0 0 338px',
            background: activeStep === 2 ? 'var(--blue)' : 'var(--card)',
            border: activeStep === 2 ? '2px solid var(--blue)' : '1px solid var(--border)',
            borderRadius: '16px',
            padding: '55px 30px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: activeStep === 2 ? 'translateY(-4px)' : 'translateY(0)',
            boxShadow: activeStep === 2 ? '0 8px 24px rgba(0,0,0,0.15)' : 'var(--shadow)',
            position: 'relative',
            margin: '20px 0'
          }}
          onMouseEnter={() => setActiveStep(2)}
          onMouseLeave={() => setActiveStep(null)}
        >
          <div 
            className="step-number"
            style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '39px',
              height: '39px',
              borderRadius: '50%',
              background: activeStep === 2 ? 'white' : 'var(--blue)',
              color: activeStep === 2 ? 'var(--blue)' : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '20px',
              fontFamily: 'var(--font-display)',
              border: activeStep === 2 ? '2px solid white' : 'none',
              zIndex: 2
            }}
          >
            2
          </div>

          <h3 style={{
            fontSize: '24px',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            color: activeStep === 2 ? 'white' : 'var(--text)',
            margin: '0 0 16px',
            letterSpacing: '-0.5px'
          }}>
            Compete
          </h3>

          <p style={{
            fontSize: '16px',
            color: activeStep === 2 ? 'rgba(255,255,255,0.9)' : 'var(--text2)',
            lineHeight: 1.4,
            margin: '0 0 24px'
          }}>
            Live 1v1 battles & bellringers
          </p>

          <div 
            className="step-visual"
            style={{
              display: 'flex',
              justifyContent: 'center',
              transform: activeStep === 2 ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
              width: '180px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--text)'
              }}>
                <span>LIVE 1v1 BATTLE</span>
                <span style={{ color: 'var(--green)' }}>🔴 LIVE</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--green)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 800
                }}>
                  D
                </div>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--text)',
                    lineHeight: 1.2
                  }}>
                    DesignWolf
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: 'var(--text2)',
                    lineHeight: 1.2
                  }}>
                    vs NeonBrush
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '11px',
                color: 'var(--text2)',
                marginBottom: '8px'
              }}>
                <span>⏱️ 2:34 remaining</span>
                <span>🏆 +5 ELO</span>
              </div>
              <div style={{
                background: 'var(--green)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: '8px'
              }}>
                "AI-powered study tools"
              </div>
              <div style={{
                fontSize: '10px',
                color: 'var(--text2)',
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                Round 3 of 5
              </div>
            </div>
          </div>
          
          <div style={{
            position: 'absolute',
            top: '50%',
            right: '-65px',
            transform: 'translateY(-50%)',
            color: 'white',
            fontSize: '48px',
            fontWeight: 900,
            zIndex: 1,
            textShadow: '0 5px 10px rgba(0,0,0,0.7)',
            letterSpacing: '-5px',
            strokeWidth: '3px',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
          }}>
            →
          </div>
        </div>

        {/* Get Judged Box */}
        <div
          className="step-box"
          style={{
            flex: '0 0 364px',
            background: activeStep === 3 ? 'var(--orange)' : 'var(--card)',
            border: activeStep === 3 ? '2px solid var(--orange)' : '1px solid var(--border)',
            borderRadius: '16px',
            padding: '60px 35px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: activeStep === 3 ? 'translateY(-4px)' : 'translateY(0)',
            boxShadow: activeStep === 3 ? '0 8px 24px rgba(0,0,0,0.15)' : 'var(--shadow)',
            position: 'relative',
            margin: '20px 0'
          }}
          onMouseEnter={() => setActiveStep(3)}
          onMouseLeave={() => setActiveStep(null)}
        >
          <div 
            className="step-number"
            style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '39px',
              height: '39px',
              borderRadius: '50%',
              background: activeStep === 3 ? 'white' : 'var(--orange)',
              color: activeStep === 3 ? 'var(--orange)' : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '20px',
              fontFamily: 'var(--font-display)',
              border: activeStep === 3 ? '2px solid white' : 'none',
              zIndex: 2
            }}
          >
            3
          </div>

          <h3 style={{
            fontSize: '24px',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            color: activeStep === 3 ? 'white' : 'var(--text)',
            margin: '0 0 16px',
            letterSpacing: '-0.5px'
          }}>
            Get Judged
          </h3>

          <p style={{
            fontSize: '16px',
            color: activeStep === 3 ? 'rgba(255,255,255,0.9)' : 'var(--text2)',
            lineHeight: 1.4,
            margin: '0 0 24px'
          }}>
            Community scoring & feedback
          </p>

          <div 
            className="step-visual"
            style={{
              display: 'flex',
              justifyContent: 'center',
              transform: activeStep === 3 ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
              width: '180px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: '8px',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Community Review
              </div>
              <div style={{
                background: 'var(--orange)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: '12px'
              }}>
                "AI-powered study tools"
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                fontSize: '11px',
                color: 'var(--text2)'
              }}>
                <span>Submitted by DesignWolf</span>
                <span style={{ color: 'var(--orange)' }}>⚡ 2h ago</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '8px',
                gap: '2px'
              }}>
                {[1,2,3,4,5].map((star) => (
                  <span key={star} style={{ fontSize: '16px', color: 'var(--gold)' }}>⭐</span>
                ))}
              </div>
              <div style={{
                fontSize: '10px',
                color: 'var(--text2)',
                textAlign: 'center',
                marginBottom: '8px'
              }}>
                24 reviews • 4.8 avg rating
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '10px',
                color: 'var(--text2)'
              }}>
                <span>👍 89% helpful</span>
                <span>💬 12 comments</span>
              </div>
            </div>
          </div>
          
          <div style={{
            position: 'absolute',
            top: '50%',
            right: '-65px',
            transform: 'translateY(-50%)',
            color: 'white',
            fontSize: '48px',
            fontWeight: 900,
            zIndex: 1,
            textShadow: '0 5px 10px rgba(0,0,0,0.7)',
            letterSpacing: '-5px',
            strokeWidth: '3px',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
          }}>
            →
          </div>
        </div>

        {/* Climb Box */}
        <div
          className="step-box"
          style={{
            flex: '0 0 390px',
            background: activeStep === 4 ? 'var(--gold)' : 'var(--card)',
            border: activeStep === 4 ? '2px solid var(--gold)' : '1px solid var(--border)',
            borderRadius: '16px',
            padding: '95px 40px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: activeStep === 4 ? 'translateY(-4px)' : 'translateY(0)',
            boxShadow: activeStep === 4 ? '0 8px 24px rgba(0,0,0,0.15)' : 'var(--shadow)',
            position: 'relative',
            margin: '20px 0'
          }}
          onMouseEnter={() => setActiveStep(4)}
          onMouseLeave={() => setActiveStep(null)}
        >
          <div 
            className="step-number"
            style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '39px',
              height: '39px',
              borderRadius: '50%',
              background: activeStep === 4 ? 'white' : 'var(--gold)',
              color: activeStep === 4 ? 'var(--gold)' : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '20px',
              fontFamily: 'var(--font-display)',
              border: activeStep === 4 ? '2px solid white' : 'none',
              zIndex: 2
            }}
          >
            4
          </div>

          <h3 style={{
            fontSize: '24px',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            color: activeStep === 4 ? 'white' : 'var(--text)',
            margin: '0 0 16px',
            letterSpacing: '-0.5px'
          }}>
            Climb
          </h3>

          <p style={{
            fontSize: '16px',
            color: activeStep === 4 ? 'rgba(255,255,255,0.9)' : 'var(--text2)',
            lineHeight: 1.4,
            margin: '0 0 24px'
          }}>
            ELO & leaderboard rankings
          </p>

          <div 
            className="step-visual"
            style={{
              display: 'flex',
              justifyContent: 'center',
              transform: activeStep === 4 ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.3s ease'
            }}
          >
            <div className="pc-lb" style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
                <div className="pc-lb-title" style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--text)',
                  textAlign: 'center',
                  marginBottom: '8px',
                  fontFamily: 'var(--font-display)'
                }}>
                  Weekly Leaderboard
                </div>
                <div className="pc-lb-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div className="pc-lb-rank" style={{ fontSize: '14px' }}>🥇</div>
                  <div className="pc-lb-av" style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'var(--green)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 800
                  }}>D</div>
                  <div className="pc-lb-name" style={{ fontSize: '12px', fontWeight: 700 }}>DesignWolf</div>
                  <div className="pc-lb-elo" style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 700 }}>1,891</div>
                  <div className="pc-lb-delta" style={{ fontSize: '10px', color: 'var(--green)' }}>↑3</div>
                </div>
                <div className="pc-lb-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div className="pc-lb-rank" style={{ fontSize: '14px' }}>🥈</div>
                  <div className="pc-lb-av" style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'var(--blue)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 800
                  }}>N</div>
                  <div className="pc-lb-name" style={{ fontSize: '12px', fontWeight: 700 }}>NeonBrush</div>
                  <div className="pc-lb-elo" style={{ fontSize: '12px', color: 'var(--text)', fontWeight: 700 }}>1,756</div>
                  <div className="pc-lb-delta" style={{ fontSize: '10px', color: 'var(--green)' }}>↑1</div>
                </div>
                <div className="pc-lb-row you-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="pc-lb-rank" style={{ color: 'var(--green)', fontSize: '10px', fontWeight: 700 }}>#47</div>
                  <div className="pc-lb-av" style={{ 
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'var(--green-mid)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 800
                  }}>J</div>
                  <div className="pc-lb-name" style={{ color: 'var(--green)', fontWeight: 700, fontSize: '12px' }}>you</div>
                  <div className="pc-lb-elo" style={{ fontSize: '12px', fontWeight: 700 }}>1,240</div>
                  <div className="pc-lb-delta" style={{ fontSize: '10px', color: 'var(--green)' }}>↑4</div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
