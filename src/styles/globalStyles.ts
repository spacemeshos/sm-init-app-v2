import { createGlobalStyle, css } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  ${css`
    @font-face {
      font-family: 'Univers45';
      src: url('/fonts/Univers LT W01 45 Light.otf') format('opentype');
      font-display: swap;
    }
    @font-face {
      font-family: 'Univers55';
      src: url('/fonts/Univers LT W01 55 Roman.otf') format('opentype');
      font-display: swap;
    }
    @font-face {
      font-family: 'Univers63';
      src: url('/fonts/Univers LT W01 63 Bold Extended.otf') format('opentype');
      font-display: swap;
    }
    @font-face {
      font-family: 'Univers65';
      src: url('/fonts/Univers LT W01 65 Bold.otf') format('opentype');
      font-display: swap;
    }
    @font-face {
      font-family: 'Univers93';
      src: url('/fonts/Univers LT W01 93 X Black Ext.otf') format('opentype');
      font-display: swap;
    }
  `}
`;

export default GlobalStyles;
