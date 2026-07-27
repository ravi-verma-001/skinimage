'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  CircularProgress,
  Paper
} from '@mui/material';
import { Lock, ArrowLeft } from 'lucide-react';
import { API_URL } from '@/config';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg('Invalid or missing reset token.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');

      setSuccessMsg(data.message || 'Password reset successful!');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f4', minHeight: '80vh', display: 'flex', alignItems: 'center', py: 8 }}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e7e5e4', textAlign: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: '#ecfdf5', p: 1.5, borderRadius: '50%' }}>
              <Lock size={32} style={{ color: '#047857' }} />
            </Box>
            
            <Typography variant="h5" component="h1" sx={{ fontFamily: 'serif', fontWeight: 'bold', color: '#1c1917' }}>
              Reset Password
            </Typography>
            <Typography variant="body2" sx={{ color: '#78716c', mb: 2 }}>
              Choose a secure, strong new password for your account.
            </Typography>

            {successMsg && <Alert severity="success" sx={{ width: '100%', mb: 1, fontSize: '12px' }}>{successMsg}</Alert>}
            {errorMsg && <Alert severity="error" sx={{ width: '100%', mb: 1, fontSize: '12px' }}>{errorMsg}</Alert>}

            {!successMsg && (
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  fullWidth
                  required
                  type="password"
                  label="New Password"
                  variant="outlined"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '14px',
                      '&:hover fieldset': { borderColor: '#047857' },
                      '&.Mui-focused fieldset': { borderColor: '#047857' }
                    },
                    '& label.Mui-focused': { color: '#047857' }
                  }}
                />

                <TextField
                  fullWidth
                  required
                  type="password"
                  label="Confirm Password"
                  variant="outlined"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '14px',
                      '&:hover fieldset': { borderColor: '#047857' },
                      '&.Mui-focused fieldset': { borderColor: '#047857' }
                    },
                    '& label.Mui-focused': { color: '#047857' }
                  }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={loading || !token}
                  sx={{
                    bgcolor: '#047857',
                    '&:hover': { bgcolor: '#065f46' },
                    py: 1.25,
                    fontSize: '13px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderRadius: 2,
                    boxShadow: 'none'
                  }}
                >
                  {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Update Password'}
                </Button>
              </Box>
            )}

            <Box sx={{ borderTop: '1px solid #f5f5f4', width: '100%', pt: 2, mt: 1 }}>
              <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 'bold', color: '#047857', textDecoration: 'none' }}>
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f4' }}>
        <CircularProgress sx={{ color: '#047857' }} />
      </Box>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
