import * as React from 'react';

interface BookingConfirmationEmailProps {
  bookingNumber: string;
  customerName: string;
  serviceName: string;
  servicePrice: number;
  bookingDate: string;
  bookingTime: string;
  address: string;
  city: string;
  postalCode: string;
  carModel: string;
  licensePlate?: string;
}

export const BookingConfirmationEmail = ({
  bookingNumber,
  customerName,
  serviceName,
  servicePrice,
  bookingDate,
  bookingTime,
  address,
  city,
  postalCode,
  carModel,
  licensePlate,
}: BookingConfirmationEmailProps) => (
  <html>
    <head>
      <style>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .booking-number {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
          border: 2px solid #667eea;
        }
        .booking-number h2 {
          margin: 0 0 10px 0;
          color: #667eea;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .booking-number p {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
          font-family: monospace;
          color: #333;
        }
        .details {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          color: #6b7280;
        }
        .detail-value {
          color: #111827;
          text-align: right;
        }
        .price {
          background: #667eea;
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
        }
        .price h3 {
          margin: 0 0 5px 0;
          font-size: 16px;
          font-weight: normal;
        }
        .price p {
          margin: 0;
          font-size: 36px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: 600;
        }
      `}</style>
    </head>
    <body>
      <div className="header">
        <h1>🚗 Washify</h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '18px' }}>Tack för din bokning!</p>
      </div>
      
      <div className="content">
        <p>Hej {customerName}!</p>
        <p>Vi har tagit emot din bokning för mobil biltvätt. Här är dina bokningsdetaljer:</p>
        
        <div className="booking-number">
          <h2>Bokningsnummer</h2>
          <p>{bookingNumber}</p>
        </div>

        <div className="details">
          <div className="detail-row">
            <span className="detail-label">Tjänst</span>
            <span className="detail-value">{serviceName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Datum</span>
            <span className="detail-value">{new Date(bookingDate).toLocaleDateString('sv-SE', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Tid</span>
            <span className="detail-value">{bookingTime}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Plats</span>
            <span className="detail-value">
              {address}<br/>
              {postalCode} {city}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Bil</span>
            <span className="detail-value">
              {carModel} {licensePlate ? `(${licensePlate})` : ''}
            </span>
          </div>
        </div>

        <div className="price">
          <h3>Totalt pris</h3>
          <p>{servicePrice} kr</p>
        </div>

        <p style={{ marginTop: '30px' }}>
          Vi kontaktar dig senast 24 timmar innan din bokade tid för att bekräfta.
        </p>

        <p>
          Har du frågor? Kontakta oss på <a href="mailto:info@washify.se" style={{ color: '#667eea' }}>info@washify.se</a> 
          eller ring oss på <strong>073-949 59 24</strong>.
        </p>
      </div>

      <div className="footer">
        <p>© {new Date().getFullYear()} Washify - Professionell mobil biltvätt</p>
        <p style={{ fontSize: '12px', marginTop: '10px' }}>
          Detta är en automatisk bekräftelse. Vänligen svara inte på detta e-postmeddelande.
        </p>
      </div>
    </body>
  </html>
);