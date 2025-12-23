import * as React from 'react';

interface AnnouncementEmailProps {
  guestName: string;
  title: string;
  content: string;
  dashboardUrl: string;
}

export function AnnouncementEmail({
  guestName,
  title,
  content,
  dashboardUrl,
}: AnnouncementEmailProps) {
  return (
    <div
      style={{
        fontFamily: 'Georgia, serif',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '40px 20px',
        backgroundColor: '#faf7f2',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              backgroundColor: '#fef3e7',
              borderRadius: '20px',
              marginBottom: '16px',
            }}
          >
            <span style={{ fontSize: '14px', color: '#c45d35' }}>
              📢 Nouvelle annonce
            </span>
          </div>
          <h1
            style={{
              color: '#c9a227',
              fontSize: '24px',
              fontWeight: 'normal',
              margin: '0 0 8px 0',
            }}
          >
            {title}
          </h1>
          <div
            style={{
              width: '60px',
              height: '2px',
              backgroundColor: '#c9a227',
              margin: '0 auto',
            }}
          />
        </div>

        {/* Content */}
        <div style={{ color: '#333', lineHeight: '1.8', fontSize: '16px' }}>
          <p>Bonjour {guestName},</p>
          
          <p>
            Nous avons une nouvelle annonce concernant l&apos;anniversaire d&apos;Yvonne à Marrakech :
          </p>

          <div
            style={{
              backgroundColor: '#faf7f2',
              borderRadius: '8px',
              padding: '24px',
              margin: '24px 0',
              borderLeft: '4px solid #c9a227',
            }}
          >
            <p style={{ margin: '0', whiteSpace: 'pre-wrap' }}>
              {content}
            </p>
          </div>

          <p>
            Pour plus de détails, consultez votre espace invité :
          </p>

          {/* CTA Button */}
          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <a
              href={dashboardUrl}
              style={{
                display: 'inline-block',
                backgroundColor: '#c45d35',
                color: '#ffffff',
                padding: '16px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              Accéder à mon espace
            </a>
          </div>

          <p style={{ color: '#666', fontSize: '14px' }}>
            Si le bouton ne fonctionne pas, copiez ce lien dans votre
            navigateur :<br />
            <a href={dashboardUrl} style={{ color: '#c9a227' }}>
              {dashboardUrl}
            </a>
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: '40px',
            paddingTop: '24px',
            borderTop: '1px solid #eee',
            textAlign: 'center',
            color: '#999',
            fontSize: '12px',
          }}
        >
          <p style={{ margin: '0 0 8px 0' }}>
            🎉 Anniversaire d&apos;Yvonne - 60 ans
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            12-18 janvier 2026 • Marrakech, Maroc
          </p>
          <p style={{ margin: 0 }}>
            Cet email a été envoyé automatiquement.
            <br />
            Merci de ne pas y répondre directement.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementEmail;

