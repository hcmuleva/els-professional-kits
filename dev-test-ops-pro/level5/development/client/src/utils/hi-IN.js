// src/locales/hi-IN.js
export default {
    Form: {
      defaultValidateMessages: {
        default: '${name} फ़ील्ड में सत्यापन त्रुटि',
        required: 'यह फ़ील्ड आवश्यक है',
        enum: '[${enum}] में से एक होना चाहिए',
        whitespace: 'खाली नहीं हो सकता',
        date: {
          format: 'अमान्य तारीख प्रारूप',
          parse: 'तारीख पार्स नहीं की जा सकी',
          invalid: 'अमान्य तारीख',
        },
        types: {
          string: 'पाठ होना चाहिए',
          method: 'फ़ंक्शन होना चाहिए',
          array: 'सरणी होना चाहिए',
          object: 'ऑब्जेक्ट होना चाहिए',
          number: 'संख्या होना चाहिए',
          date: 'तारीख होना चाहिए',
          boolean: 'सही/गलत होना चाहिए',
          integer: 'पूर्णांक होना चाहिए',
          float: 'दशमलव संख्या होना चाहिए',
          regexp: 'नियमित अभिव्यक्ति होनी चाहिए',
          email: 'वैध ईमेल होना चाहिए',
          url: 'वैध URL होना चाहिए',
          hex: 'वैध हेक्स रंग होना चाहिए',
        },
        string: {
          len: 'ठीक ${len} वर्णों का होना चाहिए',
          min: 'कम से कम ${min} वर्णों का होना चाहिए',
          max: 'अधिकतम ${max} वर्णों का होना चाहिए',
          range: '${min}-${max} वर्णों के बीच होना चाहिए',
        },
        number: {
          len: '${len} के बराबर होना चाहिए',
          min: 'कम से कम ${min} होना चाहिए',
          max: 'अधिकतम ${max} होना चाहिए',
          range: '${min}-${max} के बीच होना चाहिए',
        },
        array: {
          len: 'ठीक ${len} आइटम होने चाहिए',
          min: 'कम से कम ${min} आइटम होने चाहिए',
          max: 'अधिकतम ${max} आइटम होने चाहिए',
          range: '${min}-${max} आइटमों के बीच होने चाहिए',
        },
        pattern: {
          mismatch: 'पैटर्न ${pattern} से मेल नहीं खाता',
        },
      },
    },
    // Add other Hindi translations as needed
  };