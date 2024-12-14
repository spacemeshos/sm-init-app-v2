import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Univers45';
    src: url('/fonts/Univers LT W01 45 Light.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Univers55';
    src: url('/fonts/Univers LT W01 55 Roman.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Univers63';
    src: url('/fonts/Univers LT W01 63 Bold Extended.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Univers65';
    src: url('/fonts/Univers LT W01 65 Bold.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Univers93';
    src: url('/fonts/Univers LT W01 93 X Black Ext.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  /* Reset CSS */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Base styles */
  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Univers45', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  /* Ensure fonts are inherited properly */
  button, input, select, textarea {
    font-family: inherit;
  }
`;

export default GlobalStyles;
