import type { TDocumentDefinitions } from 'pdfmake/interfaces';

export const COLORS = {
  PRIMARY: '#000000',
  CORRECT: '#16a34a',
  HALF: '#f59e0b',
  WRONG: '#dc2626',

  BLUE_600: '#2563eb',
  GRAY_700: '#374151',
};

export const getHeader = (): TDocumentDefinitions['header'] => ({
  columns: [
    {
      alignment: 'left',
      image:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAWJAAAFiQFtaJ36AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAt7SURBVHgBzVtNjBxHFf5ed8941ru2Z/GubWRjz9oKVzYCBcPFBnFAREiGWwAJIaEoF8AIUDZIAa9CJHJAiYORFQgkxonJDQcOhECCDUQKB4QBR1iYeFdxYhsC2jFZ785fd1HdXd39qrqqZ9YmTp62t+vnVdX76v3Uz8wQhlCz2WqGvn8AAvsINEvwmiC0IP+BKP6Pclq9s5I8nxFPCy0tBC9L30KofPIWaWmabsvnTAQsAtEpPwyfbrcX26ggghtoa+B5B0ngs0TUzAAQB2MDTMS6zfixRsBZuVDVIoOu/kQOPm1TTJBMPd6PwvlOe3ERFvJthRubrS9FoKekuPtltkHEBEyAZeApLwPsgNMiAyxnMSZCY82tZQ0kxKxPdLDRmES3s3TarC4B3tBsPSZHmZPJRjY65SB0Deflqow0c4bBz0CYRSwjBCxEziLhqofY32g0m91O+5e8VAM80Ww9KF93mb5IxP3RQwGmMG1VMsR/C7Dk0B6NoFEqkKouBEzXULS31mi2+p320zABS7DflIxzuWk6AQNlDdsDlu6/3C2KUayALJPE/+vJoTM0K0FflaBfzLnlJLQCiAV9ANNUuYaJCT0sYFn8V/WahSJokTlNl4OXFp1V4Mp4I9bOGuzaA9CtcSBL7NOPokOw+g40IazkCD5WRg2ssyPo1lE1ngKuO7RN4maA6GDSKl5nByJa0s3RpWHTjF0By+G/FlO2azlbf7O0uRzpS5MoLVGMP+tPoB0QzXh9hAdgiHD9VICxgR29d9NayF6Vk021wqxr9sPwgIcI+wFHJ8LdccmAnUGETQJsoYpsncDFZsphFc/VF9E+T2pil7MfwrCCivIK4UtcNv8v+zHxOlSQZs5FoexvVgYtms25LA3TlxgqslZCQ1nWUj0Cd7Ya2y0wLU4CZTOO0k1UknCkTR4eqGwi2bTIe6UhyIdPCx9DWGSUtS3P3lSfK25KxgjqbdaXg1W1oK6SIeNeB3mjiCDMiDcsaJZ6s/soSqVUCn62c4dlACZn9TpgABZGSDfTozhned3VPYtPmr7kjB7myNJAC9FFmYHHE9ez7qogMCqRM+fQCLlb6+VUdKP16Savsta5nbRtDOyH/VIPXKmkazhj2LplGkcO34df/Ow4Pn3HJ4xLB1jkAcoTaScvrbaZsKl7R8ivUIB1oyGMhgbDti1TeOD+OeyZ2ZlsEz9zxyexe2YX3ESOWbWTN1oHqnxosKRqwfIX6WMp04g1++1vzWHL9BSKa6zqY0bSAak3LzMDLVIVejxjMtiyfNR8/QSVrdwWmW3qVmUp2Luxdes0ipsjwpM/+SkuLLyi9WMPIeQSUCOvqB41CPHtnaVNfvth8Fv8O0vnmt0ypWn0CQn2yadOqm7NcdmlA6f8CGDXlDfa9rHoTMuUnJkwPr4eH3j/exPhy1SeoATsfXdL/s05qBjzyZ8/ixMxWLK0I3d/btFT4QNXNQSV1zmymCkz51joh78zj/GJcaxcW8E99z6AhcWLLBqLfF2Oc9PTm3H//FexefMkoihS2iU8/5sX8IMfnihJFXcj1rAE2eo9Xm47YdiJrO8P7fsg6vU6+v0+avUa5r/xFbRaOzW+HOzUZln/ZUw2NyX8Pfn0+wM8+9xv8dCRH+ljWSyJj8s8e6joQ9Zhd0tbhP7rS+cSwXu99KnVAtz79S9i187tWrupqXfI8i9gctPGlF+B/fXzv8eRoz/WzFiPBVQxfiZteTPDb1X8+rqNh/gskrE1zEyW0n/JJV4SNuLLPCLtzvr1fy8lF2rvvmU3IvmOwhC+52HvbbfiL2fP4ep/38D69WP42sE7ZTSeQhgJxRfh9O/+gEcePeGYUQa05GYsjcyGrDORkAS86RCMvnPQ7B5LA5wD9UpXtX8794/EH2/Z00rByHQM+rb3vQcLcnm58/Ofwo7t22SdBBuFCCXYP/7pLI5+/wldCPbW4xahvPZGyO+0DISmm9L4xh2CIVUpruUMsKe06hdp6J8+EDO7j9/+Edz+sQ/nywxpwqbRJ6557bUrePDhR3FtpZPVagLzKCWMS7vYmpIr2uQdqrxA8bmTAiyKPpVJFyLpoDPNFaDjvEfEzNnTrUK1+fv5hcRU9+zemWgxjLInTLQeSnO/+OplHP7uY1hd7VpWVW5lWVJF+lzGTKsKoHD4LiMGWAdNRpprufBfD9ycTSHPv7woJz9Ca2ZHAj4GmoKN8KrU7PeOHpdgOyhfIBjyoGq9FcXDrmvtfCMBVhoGBxwzeIVfozDrPNCp5MsXXknk2D3zrsTcYt+9dOmf0mdPoNPpKrBC89HCMQAePEtE/Lyrm7KBMycDMB9ADa20x7VLnmcELVi1lE3ahYWLyTs276Wlq3LpOZ6CLY3L+6BSdTqMsiUyfTwq+64FtWWnZeyyVDYfk8xlS5eo5IOKfvXcCwnIsy+dt4PlNyECpb40AAkPD4AMdwmnM0obAmhajjXpw/MCmfSTdB7EEiZPkyXPCwFQlf9VkP6pfp4uPlRLI3ISnaM4Qg+SZQ7qgzVhnQHnTkvAtX6TGT3Z6Sj3vsy0RgDrPKVppyNuP6RZWlbLA3TVQSjAWolSPzLFMCO0vSnlAvG0u4Hqi5tmBlRdHIiSa3GyHh6Em1lkCzcfjAWUPHry/I2R+1yerRVFXn+UzPnLjisoOIavdWm0LraZmRCjaFVl0pfQI7nIj42iVJ5mMk0L3oniYdMg7IcHjiPgGU2qvAdmMqTPqv2zQJdPsmHI3iabiGIbY0bnNDJnfCLjyS3NFXuKQs9eqcd2kZ9E2C4r8x2LdktLCEHPa1S2AN1LyDBmKlyJ7fOLUYUFT0EVQYupQkXdFKxXMmPTbN1+CJT8zRSwYnK4ZjPcIlcCoO+lK3xYGFZTLJ/MzOMyz4f2jR6Qw/VthWJEHjLejJdEMW6OWq678b4gb18GKooDGgLz2lf7WiMTRCRn2xC1YAxjG7ahObUN29/pY8yvyw1JDUFtDELWBfX1GG+MwR+rYUPTx3TDRyA3LDGPH6S8fq2Onu+jNpAHiUFXHix68uljJeqjKzcS3dUBVpdDdK6FuNbpoN9dRqe3glrYlQePLnqS99LrPSz96z9YeeOKvC1ZVpsPV7BiC836DdvdXCZgKVjSKNtHxxqXYHwJwvPjp548frAOvp8+Xq0h341kQoJaXCYnpx5PUCDBDpKn1+3Id089K8kkxMDCficZM07HExJF8cQMJDi5qxLxrqoAme4CA6DSnapuLTWTEmxJyA7gcjB5pkUskNaWcj8uApzy/fy2JM3n20Oog3x8c6kOAVl51ZrKxxT5fyaHDbBkWZRVrQIoB83wZkc4QagWoNiwFF8YM4RQJ7AUiyN4jUzkWPKs4NuBjANtkMnAiS9L2bo4DDScfaUvcd3wdCL2P9uy8hJ9XCHojLSx6M+oElBUD/b2ICZLhQvIM/SiF8E7tSZtvW1wkvZyLUl6i+hU8tXDXthbQOnbPJkZpB2lt4GRSpf5bi6xTY+261I3qXw3xqjur0x68W8E5A7mmN6h0F66mZibjZutcnLnS3OvFTzelpTspcMgfEi+Kn8cgZG2i282UWW2iqJ+NB+/ky+IDzrL7aA20ZVr5Ee5dkf/cO1mURmwebta3KIydkHzqyuXkw+a82/ED/rLL9bWTczI5Kx9sGKRs7gHysei/zfZwLJyslz9ULL9PryyfHkua6b95qHfWz5Zr2+YlMm9zq9AvCVE1iIdsMcUkWlbHFtZvnIXb1b6VYsE/UytPhE321+UOk46I5+UbpTIMTw/I2sabkszvmd1+cqc2ZP1d0sS9KnAmzgme5iMv3I7gghvEjncxAo4yctdIz0iBvS5zuqVZ1w9VlJTUqdfO4DkR1vRLrkez8qOm1pIc1r9jbgDVValu2FvUZBoyx3UGXleOt2o9U/GSw8q6H9zU7i1LXxFHwAAAABJRU5ErkJggg==',
      margin: [10, 5],
      width: 25,
    },
    {
      alignment: 'left',
      margin: [15, 7],
      text: [
        { text: 'Light Pass\n', fontSize: 10, bold: true, lineHeight: 1.1 },
        { text: new Date().toLocaleString(), fontSize: 8, color: COLORS.GRAY_700, bold: true },
      ],
    },
  ],
});

export const getCheckbox = (checked: boolean, color?: string) => ({
  font: 'fontello',
  text: String.fromCodePoint(checked ? 0xf14a : 0xf096),
  color,
});

export const getRadio = (checked: boolean, color?: string) => ({
  font: 'fontello',
  text: String.fromCodePoint(checked ? 0xf192 : 0xf10c),
  color,
});
