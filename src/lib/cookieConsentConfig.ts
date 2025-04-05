import * as CookieConsent from 'vanilla-cookieconsent';

const cookieConsentConfig: CookieConsent.CookieConsentConfig = {
  categories: {
    necessary: {
      enabled: true,
      readOnly: true
    },
    analytics: {
      autoClear: {
        cookies: [
          {
            name: /^_ga/ // regex: match all cookies starting with '_ga'
          },
          {
            name: '_gid' // string: exact cookie name
          }
        ]
      },
      enabled: true,
    },
  },

  // onFirstConsent: ({ cookie }) => {
  //   console.log('onFirstConsent fired', cookie);
  // },
  //
  // onConsent: ({ cookie }) => {
  //   console.log('onConsent fired!', cookie, CookieConsent.getUserPreferences());
  // },
  //
  // onChange: ({ changedCategories, changedServices }) => {
  //   console.log('onChange fired!', changedCategories, changedServices);
  // },
  //
  // onModalReady: ({ modalName }) => {
  //   console.log('ready:', modalName);
  // },
  //
  // onModalShow: ({ modalName }) => {
  //   console.log('visible:', modalName);
  // },
  //
  // onModalHide: ({ modalName }) => {
  //   console.log('hidden:', modalName);
  // },
  //
  guiOptions: {
    consentModal: {
      layout: 'box inline',
      // layout: 'cloud',
      position: 'bottom left',
      equalWeightButtons: true,
      flipButtons: false
    },
    preferencesModal: {
      layout: 'box',
      equalWeightButtons: true,
      flipButtons: false
    }
  },

  language: {
    default: 'en',
    translations: {
      en: {
        consentModal: {
          title: 'We use cookies',
          description:
            '... and analytics. Please just accept to play.',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          showPreferencesBtn: 'Manage Individual preferences',
          // closeIconLabel: 'Reject all and close modal',
          // footer: `
					// 		<a href="#path-to-impressum.html" target="_blank">Impressum</a>
					// 		<a href="#path-to-privacy-policy.html" target="_blank">Privacy Policy</a>
					// `
        },
        preferencesModal: {
          title: 'Manage cookie preferences',
          acceptAllBtn: 'Accept all',
          // acceptNecessaryBtn: 'Reject all',
          // savePreferencesBtn: 'Accept current selection',
          closeIconLabel: 'Close modal',
          // serviceCounterLabel: 'Service|Services',
          sections: [
            {
              // title: 'Your Privacy Choices',
              description: `C'mon, just accept all to play.`
            },
            {
              title: 'Strictly Necessary',
              description:
                'These cookies are essential for the proper functioning of the website and cannot be disabled.',

              //this field will generate a toggle linked to the 'necessary' category
              linkedCategory: 'necessary'
            },
            {
              title: 'Performance and Analytics',
              description:
                'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.',
              linkedCategory: 'analytics',
            },
            // {
            //   title: 'More information',
            //   description:
            //     'For any queries in relation to my policy on cookies and your choices, please <a href="#contact-page">contact us</a>'
            // }
          ]
        }
      }
    }
  }
};

export { cookieConsentConfig }
