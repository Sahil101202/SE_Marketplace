const options = {
    bottom: '18px', // default: '32px'
    right: 'unset', // default: '32px'
    left: '70px', // default: 'unset'
    time: '0.5s', // default: '0.3s'
    mixColor: '#fff', // default: '#fff'
    backgroundColor: '#fff',  // default: '#fff'
    buttonColorDark: '#100f2c',  // default: '#100f2c'
    color: '#fff',
    blockquote: '#fff',
    buttonColorLight: '#fff', // default: '#fff'
    saveInCookies: false, // default: true,
    label: '🌓', // default: ''
    autoMatchOsTheme: false// default: true
  }
  
  const darkmode = new Darkmode(options);
  darkmode.showWidget();