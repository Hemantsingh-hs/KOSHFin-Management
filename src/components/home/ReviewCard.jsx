import React from 'react';

// Star rating helper component

export const ReviewCard = ({ reviewData }) => {
  const { name, role, type,  comment } = reviewData;

  return (
    <div 
      className="review-card" 
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        margin: '0 12px', // Provides spacing between cards in a slider
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: '220px',
        border: '1px solid #e5e7eb'
      }}
    >
      <div>
       
        <p 
          className="review-text" 
          style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '16px' }}
        >
          “{comment}”
        </p>
      </div>

      <div className="reviewer-info" style={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
        <img 
          src={"https://placeholder.com"} 
          alt={name} 
          style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', marginRight: '12px' }}
        />
        <div>
          <h4 style={{ margin: '0', color: '#111827', fontWeight: '600', fontSize: '15px' }}>{name}</h4>
          <p style={{ margin: '0', color: '#6b7280', fontSize: '13px' }}>
            {role} {type && `at ${type}`}
          </p>
        </div>
      </div>
    </div>
  );
};
