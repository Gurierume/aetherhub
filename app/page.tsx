'use client';
import React, { useState } from 'react';

export default function Page() {
  const [dark, setDark] = useState(false);

  return (
    <div style={{
      backgroundColor: dark ? '#000000' : '#ffffff',
      color: dark ? '#ffffff' : '#000000',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transition: '0.3s',
      fontFamily: 'sans-serif'
    }}>
      <h1>AetherHub Ativo</h1>
      <button 
        onClick={() => setDark(!dark)}
        style={{
          padding: '10px 20px',
          cursor: 'pointer',
          borderRadius: '8px',
          border: '1px solid',
          borderColor: dark ? '#fff' : '#000',
          background: 'transparent',
          color: 'inherit'
        }}
      >
        Mudar para {dark ? 'Branco' : 'Preto'}
      </button>
    </div>
  );
}
