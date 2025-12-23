import * as React from 'react';

interface InvitationEmailProps {
  guestName: string;
  eventDate: string;
  eventLocation: string;
  loginUrl: string;
}

export function InvitationEmail({
  guestName,
  eventDate,
  eventLocation,
  loginUrl,
}: InvitationEmailProps) {
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
          <h1
            style={{
              color: '#c9a227',
              fontSize: '28px',
              fontWeight: 'normal',
              margin: '0 0 8px 0',
            }}
          >
            Vous êtes invité(e) !
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
          <p>Cher(e) {guestName},</p>
          
          <p>
            Nous avons le plaisir de vous convier à célébrer un moment
            exceptionnel avec nous.
          </p>

          <div
            style={{
              backgroundColor: '#faf7f2',
              borderRadius: '8px',
              padding: '24px',
              margin: '24px 0',
            }}
          >
            <p style={{ margin: '0 0 12px 0' }}>
              <strong>📅 Date :</strong> {eventDate}
            </p>
            <p style={{ margin: '0' }}>
              <strong>📍 Lieu :</strong> {eventLocation}
            </p>
          </div>

          <p>
            Pour confirmer votre présence et accéder à toutes les informations
            de l&apos;événement, cliquez sur le bouton ci-dessous :
          </p>

          {/* CTA Button */}
          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <a
              href={loginUrl}
              style={{
                display: 'inline-block',
                backgroundColor: '#c9a227',
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
            <a href={loginUrl} style={{ color: '#c9a227' }}>
              {loginUrl}
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
          <p>
            Cet email a été envoyé automatiquement.
            <br />
            Merci de ne pas y répondre directement.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InvitationEmail;

