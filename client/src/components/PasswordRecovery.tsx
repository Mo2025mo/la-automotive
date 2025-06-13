import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PasswordRecoveryProps {
  onBackToLogin: () => void;
}

// Security questions for password recovery
const SECURITY_QUESTIONS = {
  "owner": {
    question: "What is the business address number?",
    answer: "5" // 5 Burgess Road
  },
  "manager": {
    question: "What is the business phone number (last 4 digits)?",
    answer: "4551" // +44 788 702 4551
  },
  "staff": {
    question: "What is the business email domain?",
    answer: "hotmail" // LA-Automotive@hotmail.com
  }
};

export default function PasswordRecovery({ onBackToLogin }: PasswordRecoveryProps) {
  const [username, setUsername] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [step, setStep] = useState(1); // 1: enter username, 2: answer question, 3: show password
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [recoveredPassword, setRecoveredPassword] = useState("");
  const { toast } = useToast();

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const securityData = SECURITY_QUESTIONS[username as keyof typeof SECURITY_QUESTIONS];
    
    if (securityData) {
      setCurrentQuestion(securityData.question);
      setStep(2);
    } else {
      toast({
        title: "User Not Found",
        description: "Please contact the system administrator for assistance.",
        variant: "destructive",
      });
    }
  };

  const handleSecurityAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    
    const securityData = SECURITY_QUESTIONS[username as keyof typeof SECURITY_QUESTIONS];
    
    if (securityData && securityAnswer.toLowerCase() === securityData.answer.toLowerCase()) {
      // Show the password based on username
      const passwords = {
        "owner": "NewOwnerPass2025!",
        "manager": "NewManagerPass2025!",
        "staff": "NewStaffPass2025!"
      };
      
      setRecoveredPassword(passwords[username as keyof typeof passwords]);
      setStep(3);
      
      toast({
        title: "Password Recovered",
        description: "Your password has been recovered successfully.",
      });
    } else {
      toast({
        title: "Incorrect Answer",
        description: "The security answer is incorrect. Please try again.",
        variant: "destructive",
      });
      setSecurityAnswer("");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F9FAFB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            color: '#1D4ED8',
            fontSize: '1.75rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            Password Recovery
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1rem' }}>
            LA Automotive Admin Access
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleUsernameSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: '#374151'
              }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#1D4ED8',
                color: 'white',
                padding: '1rem',
                fontSize: '1.125rem',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
            >
              Continue
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSecurityAnswer}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: '#374151'
              }}>
                Security Question
              </label>
              <p style={{
                padding: '0.875rem',
                backgroundColor: '#F3F4F6',
                borderRadius: '8px',
                margin: '0 0 1rem 0',
                color: '#374151'
              }}>
                {currentQuestion}
              </p>
              <input
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
                placeholder="Enter your answer"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#10B981',
                color: 'white',
                padding: '1rem',
                fontSize: '1.125rem',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
            >
              Recover Password
            </button>
          </form>
        )}

        {step === 3 && (
          <div>
            <div style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #10B981',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#065F46', marginBottom: '1rem' }}>
                Password Recovered
              </h3>
              <p style={{ color: '#374151', marginBottom: '1rem' }}>
                Username: <strong>{username}</strong>
              </p>
              <p style={{ color: '#374151', marginBottom: '1rem' }}>
                Password: <strong style={{ fontSize: '1.125rem' }}>{recoveredPassword}</strong>
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                Please write this down and keep it secure
              </p>
            </div>
            
            <button
              onClick={onBackToLogin}
              style={{
                width: '100%',
                backgroundColor: '#1D4ED8',
                color: 'white',
                padding: '1rem',
                fontSize: '1.125rem',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Back to Login
            </button>
          </div>
        )}

        <button
          onClick={onBackToLogin}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            color: '#6B7280',
            padding: '0.75rem',
            fontSize: '0.875rem',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          ← Back to Login
        </button>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#FEF3C7',
          borderRadius: '8px',
          border: '1px solid #F59E0B'
        }}>
          <p style={{
            margin: '0',
            fontSize: '0.875rem',
            color: '#92400E',
            textAlign: 'center'
          }}>
            <strong>Security Notice:</strong><br/>
            Answer the security question correctly to recover your password.
            Contact the business owner if you need assistance.
          </p>
        </div>
      </div>
    </div>
  );
}