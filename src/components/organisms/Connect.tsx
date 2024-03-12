import { QRCodeSVG } from 'qrcode.react';

function Connect() {
  const url = 'https://explicit-logic.github.io/quiz-web-1/en';

  return (
    <div>
      <div style={{
        marginBottom: '20px',
      }}>
        <QRCodeSVG
          size={350}
          value={url}
        />
      </div>
      <input
        disabled
        placeholder=""
        value={url}
      />
    </div>
  );
}

export default Connect;
